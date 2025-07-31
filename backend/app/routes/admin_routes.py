from flask import Blueprint, request, jsonify, session
from ..config import Config
import os

admin_routes = Blueprint('admin', __name__)

# .env dosyasından admin şifresini al
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

@admin_routes.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    password = data.get('password')

    if not password:
        return jsonify({"status": "error", "message": "Password is required."}), 400

    if password == ADMIN_PASSWORD:
        # Şifre doğruysa, kullanıcı için bir "oturum" (session) başlat
        session['is_admin'] = True
        return jsonify({"status": "success", "message": "Admin login successful."})
    else:
        return jsonify({"status": "error", "message": "Invalid password."}), 401 # 401 Unauthorized

@admin_routes.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('is_admin', None) # Oturumu sonlandır
    return jsonify({"status": "success", "message": "Logout successful."})

@admin_routes.route('/api/admin/check_auth', methods=['GET'])
def check_auth():
    # Frontend'in, kullanıcının hala giriş yapmış olup olmadığını kontrol etmesini sağlar
    if session.get('is_admin'):
        return jsonify({"is_admin": True})
    return jsonify({"is_admin": False})