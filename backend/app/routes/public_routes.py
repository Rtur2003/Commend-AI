from flask import Blueprint, jsonify
from ..models.ad import Ad

public_routes = Blueprint('public', __name__)

@public_routes.route('/', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "CommendAI Backend is running!"})

@public_routes.route('/api/test', methods=['GET'])
def test_env():
    """Test environment variables."""
    import os
    return jsonify({
        "status": "ok",
        "has_gemini_key": bool(os.getenv('GEMINI_API_KEY')),
        "has_secret_key": bool(os.getenv('SECRET_KEY')),
        "has_client_secret": bool(os.getenv('CLIENT_SECRET_JSON')),
        "has_token_json": bool(os.getenv('TOKEN_JSON')),
        "flask_env": os.getenv('FLASK_ENV', 'not set')
    })

@public_routes.route('/api/public/active-ads', methods=['GET'])
def get_active_ads():
    """Returns a list of all active ads."""
    try:
        active_ads = Ad.query.filter_by(is_active=True).all()
        return jsonify([
            {
                "id": ad.id,
                "content": ad.content,
                "link_url": ad.link_url,
                "position": ad.position
            } for ad in active_ads
        ])
    except Exception as e:
        print(f"Error fetching active ads: {e}")
        return jsonify([]), 500
        