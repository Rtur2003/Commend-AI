# User model
from ...core.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=True)  # Admin users için
    password_hash = db.Column(db.String(256), nullable=True)  # Admin users için
    is_admin = db.Column(db.Boolean, default=False)
    
    # Session-based tracking for anonymous users
    session_id = db.Column(db.String(128), unique=True, nullable=True)  # Browser session ID
    ip_address = db.Column(db.String(45), nullable=True)  # IPv4/IPv6 support
    user_agent = db.Column(db.Text, nullable=True)  # Browser info
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    # Yorumlarla ilişki
    comments = db.relationship('Comment', backref='author', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @staticmethod
    def get_or_create_user(session_id, ip_address=None, user_agent=None):
        """Get existing user by session_id or create new anonymous user"""
        user = User.query.filter_by(session_id=session_id).first()
        if not user:
            user = User(
                session_id=session_id,
                ip_address=ip_address,
                user_agent=user_agent
            )
            db.session.add(user)
            db.session.commit()
        else:
            # Update last seen
            user.last_seen = datetime.utcnow()
            db.session.commit()
        return user