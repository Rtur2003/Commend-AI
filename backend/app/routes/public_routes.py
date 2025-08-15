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

@public_routes.route('/api/test-youtube', methods=['GET'])
def test_youtube():
    """Test YouTube API authentication."""
    try:
        from ..services.youtube_service import get_authenticated_service
        service = get_authenticated_service()
        return jsonify({
            "status": "success",
            "message": "YouTube API authentication successful",
            "service_available": service is not None
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "error_type": type(e).__name__
        }), 500

@public_routes.route('/api/debug-request', methods=['POST'])
def debug_request():
    """Debug incoming request data."""
    from flask import request
    import json
    try:
        data = request.get_json()
        return jsonify({
            "status": "success",
            "headers": dict(request.headers),
            "user_agent": request.headers.get('User-Agent'),
            "content_type": request.content_type,
            "data": data,
            "method": request.method,
            "is_mobile": "Mobile" in request.headers.get('User-Agent', '')
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e),
            "raw_data": request.get_data(as_text=True)
        }), 500

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
        