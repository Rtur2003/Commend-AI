"""
Comment generation and management services
"""
import uuid
from datetime import datetime
from typing import List, Dict, Optional, Tuple

from ...core.database import db
from .models import Comment
from ...integrations.youtube.service import get_video_details, post_youtube_comment, get_video_comments, get_channel_details, get_video_transcript
from ...integrations.gemini.service import generate_comment_text, summarize_transcript
from ...modules.user.services import get_user_id


class CommentService:
    """Service class for comment operations"""
    
    @staticmethod
    def get_all_comments() -> List[Dict]:
        """Get all comments from all users - Public history"""
        try:
            comments = Comment.query.order_by(Comment.created_at.desc()).all()
            return [
                {
                    "id": comment.id,
                    "text": comment.text,
                    "video_url": comment.video_url,
                    "created_at": comment.created_at.isoformat() + "Z" if comment.created_at else None,
                    "posted_at": comment.posted_at.isoformat() + "Z" if comment.posted_at else None,
                    "user_id": comment.user_id,
                    "is_posted": comment.posted_at is not None
                }
                for comment in comments
            ]
        except Exception as e:
            print(f"Database error in get_all_comments: {e}")
            return []
    
    @staticmethod
    def add_generated_comment(video_url: str, comment_text: str, user_id: Optional[int] = None) -> Optional[str]:
        """Add a generated comment (not yet posted)"""
        try:
            # Get current user ID if not provided
            if user_id is None:
                try:
                    user_id = get_user_id()
                except:
                    user_id = 1  # Default fallback
            
            comment_id = str(uuid.uuid4())
            new_comment = Comment(
                id=comment_id,
                text=comment_text,
                video_url=video_url,
                created_at=datetime.utcnow(),
                posted_at=None,
                user_id=user_id
            )
            db.session.add(new_comment)
            db.session.commit()
            return comment_id
        except Exception as e:
            print(f"Database error in add_generated_comment: {e}")
            db.session.rollback()
            return None
    
    @staticmethod
    def add_posted_comment(video_url: str, comment_text: str, user_id: Optional[int] = None) -> bool:
        """Add a successfully posted comment"""
        try:
            # Get current user ID if not provided
            if user_id is None:
                try:
                    user_id = get_user_id()
                except:
                    user_id = 1  # Default fallback
            
            comment_id = str(uuid.uuid4())
            new_comment = Comment(
                id=comment_id,
                text=comment_text,
                video_url=video_url,
                created_at=datetime.utcnow(),
                posted_at=datetime.utcnow(),
                user_id=user_id
            )
            db.session.add(new_comment)
            db.session.commit()
            return True
        except Exception as e:
            print(f"Database error in add_posted_comment: {e}")
            db.session.rollback()
            return False
    
    @staticmethod
    def mark_comment_as_posted(comment_id: str) -> bool:
        """Mark an existing comment as posted"""
        try:
            comment = Comment.query.filter_by(id=comment_id).first()
            if comment:
                comment.posted_at = datetime.utcnow()
                db.session.commit()
                return True
            return False
        except Exception as e:
            print(f"Database error in mark_comment_as_posted: {e}")
            db.session.rollback()
            return False
    
    @staticmethod
    def check_duplicate_comment(video_url: str) -> bool:
        """Check if a comment has already been posted for this video"""
        try:
            normalized_url = CommentService._normalize_youtube_url(video_url)
            posted_comments = Comment.query.filter(
                Comment.posted_at.isnot(None)
            ).all()
            
            for comment in posted_comments:
                stored_normalized = CommentService._normalize_youtube_url(comment.video_url)
                if stored_normalized == normalized_url:
                    return True
            return False
        except Exception as e:
            print(f"Database error in check_duplicate_comment: {e}")
            return False
    
    @staticmethod
    def get_video_comment_count(video_url: str) -> int:
        """Get the count of posted comments for a specific video"""
        try:
            normalized_url = CommentService._normalize_youtube_url(video_url)
            posted_comments = Comment.query.filter(
                Comment.posted_at.isnot(None)
            ).all()
            
            count = 0
            for comment in posted_comments:
                stored_normalized = CommentService._normalize_youtube_url(comment.video_url)
                if stored_normalized == normalized_url:
                    count += 1
            
            return count
        except Exception as e:
            print(f"Database error in get_video_comment_count: {e}")
            return 0
    
    @staticmethod
    def _normalize_youtube_url(url: str) -> str:
        """Normalize YouTube URLs to standard format"""
        import re
        
        if not url:
            return ""
        
        # Extract video ID patterns
        video_id_patterns = [
            r'(?:v=|/)([0-9A-Za-z_-]{11}).*',
            r'(?:embed/)([0-9A-Za-z_-]{11})',
            r'(?:watch\?v=)([0-9A-Za-z_-]{11})',
            r'(?:youtu\.be/)([0-9A-Za-z_-]{11})'
        ]
        
        for pattern in video_id_patterns:
            match = re.search(pattern, url)
            if match:
                video_id = match.group(1)
                return f"https://www.youtube.com/watch?v={video_id}"
        
        return url


class CommentGenerationService:
    """Service for AI comment generation"""
    
    @staticmethod
    def generate_comment(video_url: str, language: str, comment_style: str = 'default') -> Tuple[Optional[str], Optional[str]]:
        """Generate a comment for a YouTube video"""
        try:
            # Get video details
            details, error = get_video_details(video_url)
            if error:
                return None, error
            
            # Get channel statistics
            if details and details.get('channel_id'):
                channel_stats, _ = get_channel_details(details['channel_id'])
                if channel_stats:
                    details.update(channel_stats)
            
            # Extract video ID and get existing comments
            import re
            video_id_match = re.search(r"(?<=v=)[^&#]+", video_url) or re.search(r"(?<=be/)[^&#]+", video_url)
            video_id = video_id_match.group(0) if video_id_match else None
            
            existing_comments = []
            if video_id:
                existing_comments, _ = get_video_comments(video_id, max_results=10)
            
            # Get and summarize transcript
            transcript_summary = None
            if video_id:
                transcript_text, transcript_error = get_video_transcript(video_id)
                if transcript_text and not transcript_error:
                    transcript_summary, summary_error = summarize_transcript(transcript_text, language)
                    if summary_error:
                        transcript_summary = None
            
            # Generate comment with all data
            comment_text, error = generate_comment_text(
                details, comment_style, language, existing_comments, transcript_summary
            )
            
            return comment_text, error
            
        except Exception as e:
            return None, str(e)
    
    @staticmethod
    def post_comment(video_id: str, comment_text: str) -> Tuple[Optional[Dict], Optional[str]]:
        """Post a comment to YouTube"""
        try:
            response, error = post_youtube_comment(video_id, comment_text)
            return response, error
        except Exception as e:
            return None, str(e)