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

def add_posted_comment(video_url, comment_text):
    """BAŞARIYLA GÖNDERİLMİŞ bir yorumu listeye ekler ve kaydeder."""
    comments = load_comments()
    new_comment = {
        "id": str(uuid.uuid4()),
        "text": comment_text,
        "video_url": video_url,
        "posted_at": datetime.utcnow().isoformat() + "Z" # Yorumun gönderildiği zaman
    }
    comments.insert(0, new_comment)
    save_comments(comments)

def check_if_url_has_posted_comment(video_url):
    """Verilen URL için daha önce gönderilmiş bir yorum olup olmadığını kontrol eder."""
    comments = load_comments()
    for comment in comments:
        # Sadece URL'nin eşleşip eşleşmediğini kontrol etmemiz yeterli
        if comment.get('video_url') == video_url:
            return True
    return False