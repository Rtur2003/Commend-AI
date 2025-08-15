# backend/app/models/comment.py
from .. import db

class Comment(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    text = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    posted_at = db.Column(db.DateTime, nullable=True)  # Nullable - henüz gönderilmemiş olabilir

    # Kullanıcı ile ilişki (Foreign Key) - Production için nullable
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True, default=1)