from datetime import datetime
import uuid
from .. import db
from ..models.comment import Comment

def load_comments():
    """SQLAlchemy'den tüm yorumları yükler."""
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

def add_generated_comment(video_url, comment_text):
    """Generate edilen yorumu veritabanına ekler (henüz gönderilmemiş)."""
    try:
        comment_id = str(uuid.uuid4())
        new_comment = Comment(
            id=comment_id,
            text=comment_text,
            video_url=video_url,
            created_at=datetime.utcnow(),
            posted_at=None,
            user_id=1  # Default user ID, bu daha sonra authentication ile değiştirilebilir
        )
        db.session.add(new_comment)
        db.session.commit()
        return comment_id
    except Exception as e:
        print(f"Database error in add_generated_comment: {e}")
        db.session.rollback()
        return None

def add_posted_comment(video_url, comment_text):
    """Başarıyla gönderilmiş yorumu veritabanına ekler."""
    try:
        comment_id = str(uuid.uuid4())
        new_comment = Comment(
            id=comment_id,
            text=comment_text,
            video_url=video_url,
            created_at=datetime.utcnow(),
            posted_at=datetime.utcnow(),
            user_id=1  # Default user ID
        )
        db.session.add(new_comment)
        db.session.commit()
    except Exception as e:
        print(f"Database error in add_posted_comment: {e}")
        db.session.rollback()

def mark_comment_as_posted(comment_id):
    """Mevcut bir yorumu gönderilmiş olarak işaretler."""
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

def check_if_url_has_posted_comment(video_url):
    """Verilen URL için daha önce gönderilmiş bir yorum olup olmadığını kontrol eder."""
    try:
        normalized_url = normalize_youtube_url(video_url)
        posted_comment = Comment.query.filter(
            Comment.posted_at.isnot(None)
        ).all()
        
        for comment in posted_comment:
            stored_normalized = normalize_youtube_url(comment.video_url)
            if stored_normalized == normalized_url:
                return True
        return False
    except Exception as e:
        print(f"Database error in check_if_url_has_posted_comment: {e}")
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
    
    return url

def get_video_comment_count(video_url):
    """Belirli bir videoya yapılan yorum sayısını döndürür."""
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