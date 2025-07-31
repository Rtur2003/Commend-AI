# backend/app/models/comment.py
from .. import db

class Comment(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    text = db.Column(db.Text, nullable=False)
    video_url = db.Column(db.String(255), nullable=False)
    posted_at = db.Column(db.DateTime, nullable=False)

    # Kullanıcı ile ilişki (Foreign Key)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)