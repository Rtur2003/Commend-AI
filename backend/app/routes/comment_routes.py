from flask import Blueprint, request, jsonify
from ..services.youtube_service import get_video_details, post_youtube_comment
from ..services.gemini_service import generate_comment_text
from ..services.database_service import add_comment, load_comments, check_if_url_has_posted_comment, mark_comment_as_posted
import re

comment_routes = Blueprint('comment', __name__)

# generate_comment_route ve history_route aynı kalıyor...
@comment_routes.route('/api/generate_comment', methods=['POST'])
def generate_comment_route():
    # ... (değişiklik yok)
    data = request.json
    video_url = data.get('video_url')
    comment_style = data.get('comment_style')
    language = data.get('language', 'Turkish')
    details, error = get_video_details(video_url)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    comment_text, error = generate_comment_text(details, comment_style, language)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    add_comment(comment_text, video_url)
    return jsonify({"status": "success", "generated_text": comment_text})

@comment_routes.route('/api/history', methods=['GET'])
def get_history_route():
    # ... (değişiklik yok)
    comments = load_comments()
    return jsonify({"status": "success", "history": comments})


# --- GÜNCELLENEN POST ROTASI ---
@comment_routes.route('/api/post_comment', methods=['POST'])
def post_comment_route():
    data = request.json
    video_url = data.get('video_url')
    comment_text = data.get('comment_text')

    # 1. Yorum göndermeden önce veritabanını kontrol et
    if check_if_url_has_posted_comment(video_url):
        return jsonify({"status": "error", "message": "Bu videoya daha önce zaten bir yorum gönderdiniz."}), 409 # 409 Conflict status code

    video_id_match = re.search(r"(?<=v=)[^&#]+", video_url) or re.search(r"(?<=be/)[^&#]+", video_url)
    if not video_id_match:
        return jsonify({"status": "error", "message": "Invalid YouTube URL"}), 400
    video_id = video_id_match.group(0)

    # 2. Yorumu YouTube'a gönder
    response, error = post_youtube_comment(video_id, comment_text)
    if error:
        return jsonify({"status": "error", "message": error}), 500
    
    # 3. Başarılı olursa, veritabanında yorumu 'gönderildi' olarak işaretle
    mark_comment_as_posted(video_url, comment_text)
    
    return jsonify({"status": "success", "message": "Comment posted successfully!", "data": response})