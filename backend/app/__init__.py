# backend/app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from .config import Config
import os

db = SQLAlchemy()
login_manager = LoginManager()

def create_app(config_class=Config):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config_class)

    # Instance folder'ın var olduğundan emin ol
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)
    login_manager.init_app(app)

    with app.app_context():
        # Rota ve modelleri import et
        from .models import user, comment, ad 
        from .routes import comment_routes, admin_routes  # admin_routes'u import et

        # Veritabanı tablolarını oluştur
        db.create_all()

        # Rotaları kaydet
        app.register_blueprint(comment_routes.comment_routes)
        app.register_blueprint(admin_routes.admin_routes)  # admin_routes'u kaydet

        return app