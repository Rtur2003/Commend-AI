import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from .config import Config

# Eklentileri (extensions) burada başlatıyoruz
db = SQLAlchemy()
cors = CORS()

def create_app(config_class=Config):
    """Uygulamayı oluşturan ana fabrika fonksiyonu."""
    app = Flask(__name__, instance_relative_config=True)
    
    # Yapılandırmayı yükle
    app.config.from_object(config_class)
    
    # API anahtarlarını doğrula
    try:
        config_class.validate_api_keys()
    except ValueError as e:
        print(f"Configuration error: {e}")
        raise

    # Eklentileri uygulamayla ilişkilendir
    db.init_app(app)
    # CORS ayarlarını burada merkezi olarak yap
    cors.init_app(app, 
                  resources={r"/*": {"origins": "*"}}, 
                  supports_credentials=True)

    # Instance folder'ın var olduğundan emin ol
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    with app.app_context():
        # Rota ve modelleri import et (döngüsel import'u önlemek için burada)
        from .models import user, comment, ad
        from .routes import comment_routes, admin_routes, public_routes
        
        # Veritabanı tablolarını oluştur
        db.create_all()

        # Rota gruplarını (Blueprint) kaydet
        app.register_blueprint(comment_routes.comment_routes)
        app.register_blueprint(admin_routes.admin_routes)
        app.register_blueprint(public_routes.public_routes)

        # --- MERKEZİ HATA YÖNETİCİSİ ---
        @app.errorhandler(Exception)
        def handle_exception(e):
            print(f"An unhandled error occurred: {e}")
            response = {
                "status": "error",
                "message": f"🔧 Sistem hatası oluştu!\n\nSunucuda beklenmedik bir sorun yaşandı.\n\nTeknik detay: {str(e)}\n\n💡 Bu hata otomatik olarak kaydedildi. Lütfen birkaç dakika sonra tekrar deneyin.",
                "technical_error": str(e),
                "user_friendly": True,
                "author": config_class.get_author_info()["author"]
            }
            return jsonify(response), 500
        
        @app.errorhandler(404)
        def handle_404(e):
            response = {
                "status": "error",
                "message": "🔍 Sayfa bulunamadı!\n\nAradığınız sayfa mevcut değil.\n\n💡 URL'yi kontrol edin veya ana sayfaya dönün.",
                "user_friendly": True
            }
            return jsonify(response), 404
        
        @app.errorhandler(500)
        def handle_500(e):
            response = {
                "status": "error",
                "message": "⚠️ Sunucu hatası!\n\nSistemde geçici bir sorun var.\n\n💡 Birkaç dakika sonra tekrar deneyin.",
                "user_friendly": True
            }
            return jsonify(response), 500
        
        # Uygulama bilgilerini döndüren endpoint
        @app.route('/api/info')
        def app_info():
            return jsonify(config_class.get_author_info())
            
        return app