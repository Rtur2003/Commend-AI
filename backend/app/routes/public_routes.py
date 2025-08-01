from flask import Blueprint, jsonify
from ..models.ad import Ad

public_routes = Blueprint('public', __name__)

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
        