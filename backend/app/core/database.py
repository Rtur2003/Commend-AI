"""
Core database configuration and utilities
"""
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize extensions
db = SQLAlchemy()
cors = CORS()

def init_database(app):
    """Initialize database with the Flask app"""
    db.init_app(app)
    
    # CORS configuration
    cors.init_app(app, 
                  resources={r"/*": {"origins": "*"}}, 
                  supports_credentials=True)
    
    # Create all tables
    with app.app_context():
        db.create_all()