import os
from flask import Flask, jsonify
from .core.config import Config
from .core.database import db, cors, init_database

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

    # Initialize database and extensions
    init_database(app)

    # Instance folder'ın var olduğundan emin ol
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    with app.app_context():
        # Import models from modules (to avoid circular imports)
        from .modules.user import models as user_models
        from .modules.comment import models as comment_models
        from .modules.ads import models as ads_models
        
        # Import routes from modules
        from .modules.comment.routes import comment_routes
        from .modules.admin.routes import admin_routes
        from .routes.public_routes import public_routes
        
        # Create database tables
        db.create_all()

        # Register blueprint routes
        app.register_blueprint(comment_routes)
        app.register_blueprint(admin_routes)
        app.register_blueprint(public_routes)

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