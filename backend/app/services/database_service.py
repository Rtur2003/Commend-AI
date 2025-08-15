import json
import os
from datetime import datetime
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'database.json')

def load_comments():
    """database.json dosyasından tüm yorumları yükler."""
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
    """Generate edilen yorumu listeye ekler ve kaydeder (henüz gönderilmemiş)."""
    comments = load_comments()
    new_comment = {
        "id": str(uuid.uuid4()),
        "text": comment_text,
        "video_url": video_url,
        "created_at": datetime.utcnow().isoformat() + "Z", # Generate edildiği zaman
        "posted_at": None  # Henüz gönderilmemiş
    }
    comments.insert(0, new_comment)
    save_comments(comments)
    return new_comment["id"]

def add_posted_comment(video_url, comment_text):
    """BAŞARIYLA GÖNDERİLMİŞ bir yorumu listeye ekler ve kaydeder."""
    comments = load_comments()
    new_comment = {
        "id": str(uuid.uuid4()),
        "text": comment_text,
        "video_url": video_url,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "posted_at": datetime.utcnow().isoformat() + "Z" # Yorumun gönderildiği zaman
    }
    comments.insert(0, new_comment)
    save_comments(comments)

def mark_comment_as_posted(comment_id):
    """Mevcut bir yorumu gönderilmiş olarak işaretler."""
    comments = load_comments()
    for comment in comments:
        if comment.get("id") == comment_id:
            comment["posted_at"] = datetime.utcnow().isoformat() + "Z"
            break
    save_comments(comments)

def check_if_url_has_posted_comment(video_url):
    """Verilen URL için daha önce gönderilmiş bir yorum olup olmadığını kontrol eder."""
    comments = load_comments()
    
    # URL'yi normalize et (farklı formatlar için)
    normalized_url = normalize_youtube_url(video_url)
    
    for comment in comments:
        stored_url = comment.get('video_url', '')
        stored_normalized = normalize_youtube_url(stored_url)
        
        # Normalize edilmiş URL'leri karşılaştır
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
    """Belirli bir videoya yapılan yorum sayısını döndürür."""
    comments = load_comments()
    normalized_url = normalize_youtube_url(video_url)
    
    count = 0
    for comment in comments:
        stored_normalized = normalize_youtube_url(comment.get('video_url', ''))
        if stored_normalized == normalized_url:
            count += 1
    
    return count