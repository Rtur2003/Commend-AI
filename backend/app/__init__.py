import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .config import Config

# Eklentileri (extensions) burada başlatıyoruz
db = SQLAlchemy()
login_manager = LoginManager()
cors = CORS()

def create_app(config_class=Config):
    """Uygulamayı oluşturan ana fabrika fonksiyonu."""
    app = Flask(__name__, instance_relative_config=True)
    
    # Yapılandırmayı yükle
    app.config.from_object(config_class)

    # Eklentileri uygulamayla ilişkilendir
    db.init_app(app)
    login_manager.init_app(app)
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
                "message": "Sunucuda beklenmedik bir hata oluştu."
            }
            return jsonify(response), 500
            
        return app