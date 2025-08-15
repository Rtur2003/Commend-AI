from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import re
from ..config import Config
import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
import isodate # Videonun süresini parse etmek için

    

def get_authenticated_service():
    """OAuth 2.0 ile YouTube API kimlik doğrulaması yapar ve servis nesnesini döndürür."""
    import json
    import tempfile
    
    # Environment variable'dan client secret'ı oku
    CLIENT_SECRET_JSON = os.getenv('CLIENT_SECRET_JSON')
    if CLIENT_SECRET_JSON:
        try:
            # JSON'u parse et (validation için)
            json_data = json.loads(CLIENT_SECRET_JSON)
            # Temporary file oluştur
            with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as temp_file:
                json.dump(json_data, temp_file)
                CLIENT_SECRETS_FILE = temp_file.name
        except json.JSONDecodeError as e:
            print(f"CLIENT_SECRET_JSON parse error: {e}")
            CLIENT_SECRETS_FILE = 'client_secret.json'  # Fallback
    else:
        CLIENT_SECRETS_FILE = 'client_secret.json'

    # Gerekli kapsamlar (API'nin hangi verilere erişebileceğini belirler)
    SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
    
    # Production ortamında TOKEN_JSON environment variable'dan token'ı oku
    TOKEN_JSON = os.getenv('TOKEN_JSON')
    if TOKEN_JSON:
        try:
            # Environment variable'dan token'ı al ve Credentials oluştur
            token_data = json.loads(TOKEN_JSON)
            creds = Credentials.from_authorized_user_info(token_data, SCOPES)
            
            # Token expire olmuşsa refresh et
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
            
            return build('youtube', 'v3', credentials=creds)
        except Exception as e:
            print(f"TOKEN_JSON parse error: {e}")
    
    # Fallback: Local token.json dosyasını dene
    TOKEN_FILE = 'token.json'
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        if creds and not creds.valid:
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                # Token geçersiz ve browser kullanılamıyor
                raise Exception("OAuth token geçersiz. Local ortamda yeniden authorize edin.")
        return build('youtube', 'v3', credentials=creds)
    
    # Ne token.json var ne de TOKEN_JSON environment variable
    raise Exception("YouTube API kimlik doğrulaması bulunamadı. TOKEN_JSON environment variable'ı ayarlayın.")

def get_video_details(video_url):
    """Verilen YouTube URL'sinden metinsel, istatistiksel ve içerik detaylarını çeker."""
    try:
        video_id_match = re.search(r"(?<=v=)[^&#]+", video_url) or re.search(r"(?<=be/)[^&#]+", video_url)
        if not video_id_match:
            return None, "Geçersiz YouTube URL'si"
        video_id = video_id_match.group(0)

        youtube = get_authenticated_service()
        # İsteğe 'statistics' ve 'contentDetails' bölümlerini ekliyoruz
        request = youtube.videos().list(
            part="snippet,statistics,contentDetails",
            id=video_id
        )
        response = request.execute()

        if not response.get('items'):
            return None, "Video bulunamadı"

        item = response['items'][0]
        snippet = item['snippet']
        stats = item.get('statistics', {})
        content = item.get('contentDetails', {})

        # Süreyi okunabilir bir formata çevir
        duration_iso = content.get('duration', 'PT0S')
        duration_seconds = isodate.parse_duration(duration_iso).total_seconds()
        duration_formatted = f"{int(duration_seconds // 60)} dakika {int(duration_seconds % 60)} saniye"

        details = {
            'title': snippet.get('title'),
            'channel_name': snippet.get('channelTitle'),
            'channel_id': snippet.get('channelId'), # Kanal istatistikleri için
            'description': snippet.get('description'),
            'view_count': int(stats.get('viewCount', 0)),
            'like_count': int(stats.get('likeCount', 0)),
            'comment_count': int(stats.get('commentCount', 0)),
            'duration': duration_formatted
        }
        return details, None
    except Exception as e:
        print(f"Video detayları alınırken hata oluştu: {e}")
        return None, "Video detayları alınırken bir hata oluştu."

# --- YENİ FONKSİYON: KANAL DETAYLARINI ÇEKME ---
def get_channel_details(channel_id):
    """Verilen kanal ID'sinden kanal istatistiklerini çeker."""
    try:
        youtube = get_authenticated_service()
        request = youtube.channels().list(
            part="statistics",
            id=channel_id
        )
        response = request.execute()

        if not response.get('items'):
            return None, "Kanal bulunamadı"

        stats = response['items'][0].get('statistics', {})
        details = {
            'subscriber_count': int(stats.get('subscriberCount', 0))
        }
        return details, None
    except Exception as e:
        print(f"Kanal detayları alınırken hata oluştu: {e}")
        return None, "Kanal detayları alınırken bir hata oluştu."

def post_youtube_comment(video_id, comment_text):
    """Verilen video ID'sine, belirtilen metinle bir yorum gönderir."""
    try:
        youtube = get_authenticated_service()
        request_body = {
            "snippet": {
                "videoId": video_id,
                "topLevelComment": {"snippet": {"textOriginal": comment_text}}
            }
        }
        response = youtube.commentThreads().insert(part="snippet", body=request_body).execute()
        return response, None
    except Exception as e:
        print(f"Yorum gönderilirken hata oluştu: {e}")
        return None, "Yorum gönderilirken bir hata oluştu."

def get_video_comments(video_id, max_results=20):
    """Belirtilen video ID'sine ait en alakalı ilk yorumları çeker."""
    try:
        youtube = get_authenticated_service()
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=max_results,
            order="relevance"
        )
        response = request.execute()

        comments = []
        for item in response.get('items', []):
            top_comment = item['snippet']['topLevelComment']['snippet']
            comments.append({
                'author': top_comment.get('authorDisplayName'),
                'text': top_comment.get('textDisplay')
            })
        return comments, None
    except Exception as e:
        print(f"Yorumlar alınırken hata oluştu: {e}")
        return None, "Videodan yorumlar alınırken bir hata oluştu."