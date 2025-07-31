from flask import Blueprint, request, jsonify, session
from ..config import Config
import os
from functools import wraps
from .. import db
from ..models.ad import Ad # Yeni Ad modelini import et

admin_routes = Blueprint('admin', __name__)
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

# --- YENİ ADMİN KORUMA DEKORATÖRÜ ---
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('is_admin'):
            return jsonify({"status": "error", "message": "Admin access required."}), 403 # 403 Forbidden
        return f(*args, **kwargs)
    return decorated_function
# ----------------------------------------

# --- Mevcut Admin Rotaları ---
@admin_routes.route('/api/admin/login', methods=['POST'])
def admin_login():
    # ... (değişiklik yok)
    data = request.json
    password = data.get('password')
    if password == ADMIN_PASSWORD:
        session['is_admin'] = True
        return jsonify({"status": "success", "message": "Admin login successful."})
    else:
        return jsonify({"status": "error", "message": "Invalid password."}), 401

@admin_routes.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    # ... (değişiklik yok)
    session.pop('is_admin', None)
    return jsonify({"status": "success", "message": "Logout successful."})

@admin_routes.route('/api/admin/check_auth', methods=['GET'])
def check_auth():
    # ... (değişiklik yok)
    return jsonify({"is_admin": session.get('is_admin', False)})


# --- YENİ REKLAM YÖNETİMİ ROTALARI ---

@admin_routes.route('/api/admin/ads', methods=['GET'])
@admin_required # Bu rota artık admin koruması altında
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

@admin_routes.route('/api/admin/ads', methods=['POST'])
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

@admin_routes.route('/api/admin/ads/<int:ad_id>', methods=['DELETE'])
@admin_required
def delete_ad(ad_id):
    """Bir reklamı siler."""
    ad = Ad.query.get_or_404(ad_id)
    db.session.delete(ad)
    db.session.commit()
    return jsonify({"status": "success", "message": "Ad deleted successfully."})

@admin_routes.route('/api/admin/ads/<int:ad_id>/toggle', methods=['PUT'])
@admin_required
def toggle_ad(ad_id):
    """Bir reklamın aktif/pasif durumunu değiştirir."""
    ad = Ad.query.get_or_404(ad_id)
    ad.is_active = not ad.is_active
    db.session.commit()
    return jsonify({"status": "success", "message": f"Ad status changed to {'active' if ad.is_active else 'inactive'}."})