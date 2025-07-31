# backend/app/models/ad.py
from .. import db
from datetime import datetime

class Ad(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False) # Reklam içeriği (HTML kodu, metin vb.)
    link_url = db.Column(db.String(500))         # Reklamın yönlendireceği link
    is_active = db.Column(db.Boolean, default=True, nullable=False) # Reklam aktif mi?
    created_at = db.Column(db.DateTime, default=datetime.utcnow)