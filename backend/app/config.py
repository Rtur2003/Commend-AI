import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    SECRET_KEY = os.getenv('SECRET_KEY', 'varsayilan-gizli-anahtar-degistir')

    # --- VERİTABANI AYARLARI ---
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- SESSION AYARLARI ---
    SESSION_COOKIE_SECURE = False  # Development için False, production'da True
    SESSION_COOKIE_HTTPONLY = False  # JavaScript erişimi için False
    SESSION_COOKIE_SAMESITE = None   # Cross-origin için None
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 3600  # 1 saat (saniye cinsinden)
    
    # --- ADMIN ŞIFRE ---
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')  # Varsayılan şifre