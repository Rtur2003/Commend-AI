from flask import Blueprint, request, jsonify
from ..config import Config
import jwt
import datetime
from functools import wraps
from .. import db
from ..models.ad import Ad

# Blueprint'i /api/admin prefix'i ile oluştur
admin_routes = Blueprint('admin', __name__, url_prefix='/api/admin')

# Config'den admin şifresini ve secret key'i al
ADMIN_PASSWORD = Config.ADMIN_PASSWORD or 'admin123'
SECRET_KEY = Config.SECRET_KEY

# --- JWT TOKEN YARDIMCI FONKSİYONLARI ---
def generate_token():
    """Admin için JWT token oluşturur"""
    payload = {
        'is_admin': True,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # 1 saat geçerli
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    """JWT token'ı doğrular"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload.get('is_admin', False)
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

# --- ADMİN KORUMA DEKORATÖRÜ ---
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Authorization header'dan token'ı al
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"status": "error", "message": "Admin access required. No token provided."}), 403
        
        token = auth_header.split(' ')[1]
        if not verify_token(token):
            return jsonify({"status": "error", "message": "Invalid or expired token."}), 403
            
        return f(*args, **kwargs)
    return decorated_function

# --- Admin Rotaları (artık /api/admin prefix'i otomatik ekleniyor) ---
@admin_routes.route('/login', methods=['POST'])
def admin_login():
    data = request.json
    password = data.get('password')
    
    print(f"Login attempt with password: {password}")  # DEBUG
    print(f"Expected password: {ADMIN_PASSWORD}")  # DEBUG
    
    if password == ADMIN_PASSWORD:
        token = generate_token()
        print(f"Login successful, token generated")  # DEBUG
        return jsonify({
            "status": "success", 
            "message": "Admin login successful.",
            "token": token
        })
    else:
        return jsonify({"status": "error", "message": "Invalid password."}), 401

@admin_routes.route('/logout', methods=['POST'])
def admin_logout():
    # JWT ile logout sadece frontend'de token'ı silmek demek
    return jsonify({"status": "success", "message": "Logout successful."})

@admin_routes.route('/check_auth', methods=['GET'])
def check_auth():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"is_admin": False})
    
    token = auth_header.split(' ')[1]
    is_admin = verify_token(token)
    print(f"Auth check - Token valid: {is_admin}")  # DEBUG
    return jsonify({"is_admin": is_admin})

# --- REKLAM YÖNETİMİ ROTALARI ---

@admin_routes.route('/ads', methods=['GET'])
@admin_required
def get_ads():
    """Tüm reklamları listeler."""
    ads = Ad.query.order_by(Ad.created_at.desc()).all()
    return jsonify([
        {
            "id": ad.id,
            "content": ad.content,
            "link_url": ad.link_url,
            "is_active": ad.is_active,
            "created_at": ad.created_at
        } for ad in ads
    ])

@admin_routes.route('/ads', methods=['POST'])
@admin_required
def create_ad():
    """Yeni bir reklam oluşturur."""
    data = request.json
    new_ad = Ad(
        content=data.get('content'),
        link_url=data.get('link_url'),
        is_active=data.get('is_active', True)
    )
    db.session.add(new_ad)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ad created successfully.", "id": new_ad.id}), 201

@admin_routes.route('/ads/<int:ad_id>', methods=['DELETE'])
@admin_required
def delete_ad(ad_id):
    """Bir reklamı siler."""
    ad = Ad.query.get_or_404(ad_id)
    db.session.delete(ad)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ad deleted successfully."})

@admin_routes.route('/ads/<int:ad_id>/toggle', methods=['PUT'])
@admin_required
def toggle_ad(ad_id):
    """Bir reklamın aktif/pasif durumunu değiştirir."""
    ad = Ad.query.get_or_404(ad_id)
    ad.is_active = not ad.is_active
    db.session.commit()
    return jsonify({"status": "success", "message": f"Ad status changed to {'active' if ad.is_active else 'inactive'}."})