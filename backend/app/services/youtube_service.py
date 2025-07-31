from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import re
from ..config import Config
import os
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

# Bu kapsamlarda değişiklik yaparsanız, token.json dosyasını silin.
SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
CLIENT_SECRETS_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'client_secret.json')
TOKEN_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'token.json')

def get_authenticated_service():
    """OAuth 2.0 ile YouTube API kimlik doğrulaması yapar ve servis nesnesini döndürür."""
    creds = None
    # token.json dosyası, kullanıcının erişim ve yenileme token'larını saklar ve 
    # ilk yetkilendirme akışı tamamlandığında otomatik olarak oluşturulur.
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # Eğer geçerli kimlik bilgisi yoksa, kullanıcının giriş yapmasına izin ver.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES)
            # Bu, konsola bir URL yazdıracaktır. Yetkilendirme yapmak için bu linki AÇMANIZ ZORUNLUDUR.
            creds = flow.run_local_server(port=0)
        
        # Bir sonraki çalıştırma için kimlik bilgilerini kaydet
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    
    return build('youtube', 'v3', credentials=creds)

def get_video_details(video_url):
    """Verilen YouTube URL'sinden video detaylarını çeker."""
    try:
        video_id_match = re.search(r"(?<=v=)[^&#]+", video_url) or re.search(r"(?<=be/)[^&#]+", video_url)
        if not video_id_match:
            return None, "Geçersiz YouTube URL'si"
        video_id = video_id_match.group(0)

        youtube = get_authenticated_service()

        request = youtube.videos().list(
            part="snippet",
            id=video_id
        )
        response = request.execute()

        if not response.get('items'):
            return None, "Video bulunamadı"

        video_snippet = response['items'][0]['snippet']
        details = {
            'title': video_snippet.get('title'),
            'channel_name': video_snippet.get('channelTitle'),
            'description': video_snippet.get('description')
        }
        return details, None
    except Exception as e:
        print(f"get_video_details içinde beklenmedik bir hata oluştu: {e}")
        return None, "Beklenmedik bir hata oluştu. Backend konsolunu kontrol edin."

        # Dosyanın en altına bu fonksiyonu ekleyin
def post_youtube_comment(video_id, comment_text):
    """Verilen video ID'sine, belirtilen metinle bir yorum gönderir."""
    try:
        youtube = get_authenticated_service()

        insert_request = youtube.commentThreads().insert(
            part="snippet",
            body={
                "snippet": {
                    "videoId": video_id,
                    "topLevelComment": {
                        "snippet": {
                            "textOriginal": comment_text
                        }
                    }
                }
            }
        )
        response = insert_request.execute()
        return response, None
    except Exception as e:
        print(f"An error occurred while posting comment: {e}")
        return None, "An error occurred while posting the comment."
        
def get_video_comments(video_id, max_results=10):
    """Belirtilen video ID'sine ait ilk yorumları çeker."""
    try:
        youtube = get_authenticated_service()
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=max_results,
            order="relevance"  # Alternatif: 'time'
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
        return None, "Yorumlar alınırken hata oluştu."
