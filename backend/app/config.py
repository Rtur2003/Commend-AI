import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    SECRET_KEY = os.getenv('SECRET_KEY')
    
    if not SECRET_KEY:
        raise ValueError("SECRET_KEY environment variable is required")

    # --- VERİTABANI AYARLARI ---
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL:
        # PostgreSQL için (Render'da otomatik sağlanır)
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Local development için SQLite
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance', 'app.db')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- SESSION AYARLARI ---
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 3600  # 1 saat (saniye cinsinden)
    
    # --- ADMIN ŞIFRE ---
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')
    
    if not ADMIN_PASSWORD:
        raise ValueError("ADMIN_PASSWORD environment variable is required")