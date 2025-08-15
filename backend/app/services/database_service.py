import json
import os
from datetime import datetime
import uuid

# SQLAlchemy için gerekli importlar
try:
    from .. import db
    from ..models.comment import Comment
    USE_SQLALCHEMY = True
except ImportError:
    USE_SQLALCHEMY = False

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database.json')

# Production'da PostgreSQL kullan, development'da JSON
USE_DATABASE = os.environ.get('USE_DATABASE', 'false').lower() == 'true' or os.environ.get('DATABASE_URL') is not None

print(f"Database Service Config:")
print(f"  USE_SQLALCHEMY: {USE_SQLALCHEMY}")
print(f"  USE_DATABASE: {USE_DATABASE}")
print(f"  DATABASE_URL exists: {os.environ.get('DATABASE_URL') is not None}")

def load_comments():
    """Yorumları yükler - Production'da SQLAlchemy, Development'da JSON."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            comments = Comment.query.order_by(Comment.created_at.desc()).all()
            return [
                {
                    "id": comment.id,
                    "text": comment.text,
                    "video_url": comment.video_url,
                    "created_at": comment.created_at.isoformat() + "Z" if comment.created_at else None,
                    "posted_at": comment.posted_at.isoformat() + "Z" if comment.posted_at else None
                }
                for comment in comments
            ]
        except Exception as e:
            print(f"Database error in load_comments: {e}")
            return []
    else:
        # JSON file kullan
        if not os.path.exists(DB_PATH):
            with open(DB_PATH, 'w', encoding='utf-8') as f:
                json.dump({"comments": []}, f)
            return []
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('comments', [])

def save_comments(comments):
    """Verilen yorum listesini database.json dosyasına yazar."""
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump({"comments": comments}, f, ensure_ascii=False, indent=4)

def add_generated_comment(video_url, comment_text):
    """Generate edilen yorumu ekler (henüz gönderilmemiş)."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            comment_id = str(uuid.uuid4())
            new_comment = Comment(
                id=comment_id,
                text=comment_text,
                video_url=video_url,
                created_at=datetime.utcnow(),
                posted_at=None,
                user_id=1
            )
            db.session.add(new_comment)
            db.session.commit()
            return comment_id
        except Exception as e:
            print(f"Database error in add_generated_comment: {e}")
            db.session.rollback()
            return None
    else:
        # JSON file kullan
        comments = load_comments()
        new_comment = {
            "id": str(uuid.uuid4()),
            "text": comment_text,
            "video_url": video_url,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "posted_at": None
        }
        comments.insert(0, new_comment)
        save_comments(comments)
        return new_comment["id"]

def add_posted_comment(video_url, comment_text):
    """Başarıyla gönderilmiş yorumu ekler."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            comment_id = str(uuid.uuid4())
            new_comment = Comment(
                id=comment_id,
                text=comment_text,
                video_url=video_url,
                created_at=datetime.utcnow(),
                posted_at=datetime.utcnow(),
                user_id=1
            )
            db.session.add(new_comment)
            db.session.commit()
        except Exception as e:
            print(f"Database error in add_posted_comment: {e}")
            db.session.rollback()
    else:
        # JSON file kullan
        comments = load_comments()
        new_comment = {
            "id": str(uuid.uuid4()),
            "text": comment_text,
            "video_url": video_url,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "posted_at": datetime.utcnow().isoformat() + "Z"
        }
        comments.insert(0, new_comment)
        save_comments(comments)

def mark_comment_as_posted(comment_id):
    """Mevcut bir yorumu gönderilmiş olarak işaretler."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            comment = Comment.query.filter_by(id=comment_id).first()
            if comment:
                comment.posted_at = datetime.utcnow()
                db.session.commit()
                return True
            return False
        except Exception as e:
            print(f"Database error in mark_comment_as_posted: {e}")
            db.session.rollback()
            return False
    else:
        # JSON file kullan
        comments = load_comments()
        for comment in comments:
            if comment.get("id") == comment_id:
                comment["posted_at"] = datetime.utcnow().isoformat() + "Z"
                break
        save_comments(comments)

def check_if_url_has_posted_comment(video_url):
    """Verilen URL için daha önce gönderilmiş bir yorum olup olmadığını kontrol eder."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            normalized_url = normalize_youtube_url(video_url)
            posted_comments = Comment.query.filter(
                Comment.posted_at.isnot(None)
            ).all()
            
            for comment in posted_comments:
                stored_normalized = normalize_youtube_url(comment.video_url)
                if stored_normalized == normalized_url:
                    return True
            return False
        except Exception as e:
            print(f"Database error in check_if_url_has_posted_comment: {e}")
            return False
    else:
        # JSON file kullan
        comments = load_comments()
        normalized_url = normalize_youtube_url(video_url)
        
        for comment in comments:
            if comment.get('posted_at'):  # Sadece gönderilmiş yorumları kontrol et
                stored_url = comment.get('video_url', '')
                stored_normalized = normalize_youtube_url(stored_url)
                
                if stored_normalized == normalized_url:
                    return True
        return False

def normalize_youtube_url(url):
    """YouTube URL'lerini standart formata çevirir."""
    import re
    
    if not url:
        return ""
    
    # Video ID'sini çıkar
    video_id_patterns = [
        r'(?:v=|/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed/)([0-9A-Za-z_-]{11})',
        r'(?:watch\?v=)([0-9A-Za-z_-]{11})',
        r'(?:youtu\.be/)([0-9A-Za-z_-]{11})'
    ]
    
    for pattern in video_id_patterns:
        match = re.search(pattern, url)
        if match:
            video_id = match.group(1)
            return f"https://www.youtube.com/watch?v={video_id}"
    
    # Hiçbir pattern eşleşmezse orijinal URL'i döndür
    return url

def get_video_comment_count(video_url):
    """Belirli bir videoya yapılan gönderilmiş yorum sayısını döndürür."""
    if USE_DATABASE and USE_SQLALCHEMY:
        # SQLAlchemy kullan
        try:
            normalized_url = normalize_youtube_url(video_url)
            posted_comments = Comment.query.filter(
                Comment.posted_at.isnot(None)
            ).all()
            
            count = 0
            for comment in posted_comments:
                stored_normalized = normalize_youtube_url(comment.video_url)
                if stored_normalized == normalized_url:
                    count += 1
            
            return count
        except Exception as e:
            print(f"Database error in get_video_comment_count: {e}")
            return 0
    else:
        # JSON file kullan
        comments = load_comments()
        normalized_url = normalize_youtube_url(video_url)
        
        count = 0
        for comment in comments:
            if comment.get('posted_at'):  # Sadece gönderilmiş yorumları say
                stored_normalized = normalize_youtube_url(comment.get('video_url', ''))
                if stored_normalized == normalized_url:
                    count += 1
        
        return count