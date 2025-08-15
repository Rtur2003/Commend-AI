# User services
from flask import session, request
from .models import User
from ...core.database import db
import uuid

def get_current_user():
    """Get or create current user based on session"""
    # Generate session ID if not exists
    if 'user_session_id' not in session:
        session['user_session_id'] = str(uuid.uuid4())
    
    session_id = session['user_session_id']
    ip_address = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')
    
    # Get or create user
    try:
        user = User.get_or_create_user(
            session_id=session_id,
            ip_address=ip_address,
            user_agent=user_agent
        )
        return user
    except Exception as e:
        print(f"Error in get_current_user: {e}")
        # Fallback to default user ID 1 for compatibility
        return None

def get_user_id():
    """Get current user ID, fallback to 1 for compatibility"""
    user = get_current_user()
    if user:
        return user.id
    return 1  # Default fallback