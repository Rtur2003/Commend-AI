import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path)

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_test_secret_key_for_development')
    
    # Güvenlik kontrolleri
    @staticmethod
    def validate_api_keys():
        """API anahtarlarının geçerliliğini kontrol eder"""
        if not os.getenv('GEMINI_API_KEY'):
            raise ValueError("GEMINI_API_KEY is required for AI functionality")
        if not os.getenv('YOUTUBE_API_KEY'):
            raise ValueError("YOUTUBE_API_KEY is required for YouTube integration")
    
    @staticmethod
    def get_author_info():
        """Proje yazarı bilgilerini döndürür"""
        return {
            "author": "Hasan Arthur Altuntaş",
            "project": "Commend AI",
            "version": "1.1.0",
            "created": "2025",
            "changelog": "Optimized codebase, removed unnecessary files, improved performance"
        }

    # --- VERİTABANI AYARLARI ---
    DATABASE_URL = os.getenv('DATABASE_URL')
    if DATABASE_URL:
        # PostgreSQL için (Render'da otomatik sağlanır)
        if DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        SQLALCHEMY_DATABASE_URI = DATABASE_URL
    else:
        # Local development için SQLite
        instance_dir = os.path.join(basedir, 'instance')
        os.makedirs(instance_dir, exist_ok=True)
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(instance_dir, 'app.db')
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # --- SESSION AYARLARI ---
    SESSION_COOKIE_SECURE = os.getenv('FLASK_ENV') == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_PERMANENT = False
    PERMANENT_SESSION_LIFETIME = 3600  # 1 saat (saniye cinsinden)
    
    # --- ADMIN ŞIFRE ---
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'default_test_password')