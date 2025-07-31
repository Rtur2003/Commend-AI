from flask import Blueprint, request, jsonify
from pydantic import BaseModel, Field
from flask_pydantic import validate
from typing import Literal
from ..services.youtube_service import get_video_details, post_youtube_comment, get_video_comments
from ..services.gemini_service import generate_comment_text

# Değişen importlar: add_comment ve mark_comment_as_posted gitti, add_posted_comment geldi
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
@validate()
def generate_comment_route(body: GenerateCommentRequest):
    details, error = get_video_details(body.video_url)
    if error:
        return jsonify({"status": "error", "message": error}), 500

    # Video ID’yi URL'den al
    video_id_match = re.search(r"(?<=v=)[^&#]+", body.video_url) or re.search(r"(?<=be/)[^&#]+", body.video_url)
    if not video_id_match:
        return jsonify({"status": "error", "message": "Geçersiz video URL'si"}), 400
    video_id = video_id_match.group(0)

    # İlk 10 yorumu al
    comments, comment_err = get_video_comments(video_id, max_results=10)
    if comment_err:
        comments = []  # Yorumlar başarısızsa prompt'u yorumlar olmadan oluşturur

    # Yorumu oluştur
    comment_text, error = generate_comment_text(details, body.comment_style, body.language, comments)
    if error:
        return jsonify({"status": "error", "message": error}), 500

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