from flask import Blueprint, request, jsonify
from ..services.youtube_service import get_video_details, post_youtube_comment
from ..services.gemini_service import generate_comment_text
import re

comment_routes = Blueprint('comment', __name__)

# --- YORUM ÜRETME ROTASI ---
@comment_routes.route('/api/generate_comment', methods=['POST'])
def generate_comment_route():
    data = request.json
    video_url = data.get('video_url')
    comment_style = data.get('comment_style')
    language = data.get('language', 'Turkish')

    if not video_url:
        return jsonify({"status": "error", "message": "Video URL is required"}), 400

    # 1. YouTube'dan video detaylarını çek
    details, error = get_video_details(video_url)
    if error:
        return jsonify({"status": "error", "message": error}), 500

    # 2. Gemini ile yorum üret (Doğru yer burası)
    comment_text, error = generate_comment_text(details, comment_style, language)
    if error:
        return jsonify({"status": "error", "message": error}), 500

    # 3. Başarılı sonucu frontend'e gönder
    return jsonify({
        "status": "success",
        "generated_text": comment_text
    })


# --- YORUM GÖNDERME ROTASI ---
@comment_routes.route('/api/post_comment', methods=['POST'])
def post_comment_route():
    data = request.json
    video_url = data.get('video_url')
    comment_text = data.get('comment_text')

    # URL'den video ID'sini ayıkla
    video_id_match = re.search(r"(?<=v=)[^&#]+", video_url) or re.search(r"(?<=be/)[^&#]+", video_url)
    if not video_id_match:
        return jsonify({"status": "error", "message": "Invalid YouTube URL"}), 400
    video_id = video_id_match.group(0)

    # Yorumu gönder
    response, error = post_youtube_comment(video_id, comment_text)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    
    return jsonify({"status": "success", "message": "Comment posted successfully!", "data": response})