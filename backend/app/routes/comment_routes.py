from flask import Blueprint, request, jsonify
from pydantic import BaseModel, Field
from flask_pydantic import validate
from typing import Literal
from ..services.youtube_service import get_video_details, post_youtube_comment, get_video_comments, get_channel_details
from ..services.gemini_service import generate_comment_text
from ..services.database_service import load_comments, check_if_url_has_posted_comment, add_posted_comment
import re


comment_routes = Blueprint('comment', __name__)

# --- PYDANTIC VERİ MODELLERİ ---
class GenerateCommentRequest(BaseModel):
    video_url: str = Field(..., min_length=15, description="YouTube video URL'si")
    language: Literal['Turkish', 'English', 'Russian', 'Chinese', 'Japanese']
    comment_style: str

class PostCommentRequest(BaseModel):
    video_url: str = Field(..., min_length=15)
    comment_text: str = Field(..., min_length=1)

@comment_routes.route('/api/generate_comment', methods=['POST'])
def generate_comment_route():
    """Generate comment with detailed error handling."""
    from flask import request
    
    # Manuel validation with detailed error info
    data = request.get_json()
    if not data:
        return jsonify({"status": "error", "message": "No JSON data provided"}), 400
    
    # Validate required fields
    if 'video_url' not in data:
        return jsonify({"status": "error", "message": "video_url required"}), 400
    if 'language' not in data:
        return jsonify({"status": "error", "message": "language required"}), 400
    if 'comment_style' not in data:
        return jsonify({"status": "error", "message": "comment_style required"}), 400
        
    # Create validated object
    try:
        body = GenerateCommentRequest(
            video_url=data['video_url'],
            language=data['language'], 
            comment_style=data['comment_style']
        )
    except Exception as validation_error:
        return jsonify({
            "status": "error", 
            "message": f"Validation error: {str(validation_error)}",
            "received_data": data
        }), 400
    
    try:
        # 1. Video detaylarını ve istatistiklerini çek
        details, error = get_video_details(body.video_url)
        if error:
            return jsonify({"status": "error", "message": f"Video details error: {error}"}), 500
    except Exception as e:
        return jsonify({"status": "error", "message": f"Exception in video details: {str(e)}"}), 500

    # 2. Kanal istatistiklerini çek
    if details and details.get('channel_id'):
        channel_stats, error = get_channel_details(details['channel_id'])
        if channel_stats:
            details.update(channel_stats) # Kanal istatistiklerini ana 'details' sözlüğüne ekle

    # 3. Mevcut yorumları çek
    video_id_match = re.search(r"(?<=v=)[^&#]+", body.video_url) or re.search(r"(?<=be/)[^&#]+", body.video_url)
    video_id = video_id_match.group(0) if video_id_match else None
    existing_comments = []
    if video_id:
        existing_comments, _ = get_video_comments(video_id, max_results=10)

    # 4. Tüm verilerle Gemini'den yorum üret
    comment_text, error = generate_comment_text(details, body.comment_style, body.language, existing_comments)
    if error:
        return jsonify({"status": "error", "message": error}), 500
   # CORRECT
    return jsonify({
        "status": "success",
        "generated_text": comment_text
    })

@comment_routes.route('/api/post_comment', methods=['POST'])
@validate()
def post_comment_route(body: PostCommentRequest):
    if check_if_url_has_posted_comment(body.video_url):
        return jsonify({"status": "error", "message": "Bu videoya daha önce zaten bir yorum gönderdiniz."}), 409

    video_id_match = re.search(r"(?<=v=)[^&#]+", body.video_url) or re.search(r"(?<=be/)[^&#]+", body.video_url)
    if not video_id_match:
        return jsonify({"status": "error", "message": "Geçersiz YouTube URL formatı."}), 400
    video_id = video_id_match.group(0)

    response, error = post_youtube_comment(video_id, body.comment_text)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    
    # YENİ EKLENEN SATIR: Yorum başarıyla gönderildikten sonra veritabanına kaydet
    add_posted_comment(body.video_url, body.comment_text)
    
    return jsonify({"status": "success", "message": "Comment posted successfully!", "data": response})


@comment_routes.route('/api/history', methods=['GET'])
def get_history_route():
    comments = load_comments()
    return jsonify({
        "status": "success",
        "history": comments
    })