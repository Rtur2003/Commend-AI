import os
from dotenv import load_dotenv

# .env dosyasının yolunu bul ve yükle
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

class Config:
    """Uygulama için yapılandırma ayarlarını yükler."""
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')