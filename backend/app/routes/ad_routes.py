from flask import Blueprint, jsonify
from flask_cors import cross_origin
from ..models.ad import Ad

# Public ads blueprint - Admin gerektirmez
ad_routes = Blueprint('ads', __name__, url_prefix='/api/ads')

@ad_routes.route('/active', methods=['GET'])
@cross_origin()  # CORS için
def get_active_ads():
    """Aktif reklamları getir - Admin girişi gerektirmez"""
    try:
        # SQLAlchemy kullanarak aktif reklamları getir
        ads = Ad.query.filter_by(is_active=True).order_by(Ad.created_at.desc()).all()
        
        result = []
        for ad in ads:
            result.append({
                'id': ad.id,
                'content': ad.content,
                'link_url': ad.link_url,
                'created_at': ad.created_at.isoformat() if ad.created_at else None
            })
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"Error fetching active ads: {str(e)}")  # Debug için
        return jsonify({'error': 'Failed to fetch active ads'}), 500

from flask import jsonify, request
from flask_jwt_extended import jwt_required

@app.route('/admin/ads/<int:ad_id>', methods=['PUT'])
@jwt_required()
def update_ad(ad_id):
    try:
        ad = Ad.query.get_or_404(ad_id)
        data = request.get_json()
        
        # Güncellenebilir alanlar
        if 'content' in data:
            ad.content = data['content']
        if 'link_url' in data:
            ad.link_url = data['link_url']
        if 'position' in data:
            ad.position = data['position']
        
        db.session.commit()
        
        return jsonify({
            'id': ad.id,
            'content': ad.content,
            'position': ad.position,
            'is_active': ad.is_active
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400     