from .. import db
from datetime import datetime

class Ad(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    link_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    position = db.Column(db.String(20), default='left', nullable=False)  # left, right, top, bottom, sidebar-left, sidebar-right, fixed-bottom, fixed-top