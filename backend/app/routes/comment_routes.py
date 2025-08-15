from flask import Blueprint, request, jsonify
from pydantic import BaseModel, Field
from flask_pydantic import validate
from typing import Literal
from ..services.youtube_service import get_video_details, post_youtube_comment, get_video_comments, get_channel_details, get_video_transcript
from ..services.gemini_service import generate_comment_text, summarize_transcript
from ..services.database_service import load_comments, check_if_url_has_posted_comment, add_posted_comment, add_generated_comment, mark_comment_as_posted, get_video_comment_count
import re


comment_routes = Blueprint('comment', __name__)

# --- PYDANTIC VERİ MODELLERİ ---
class GenerateCommentRequest(BaseModel):
    video_url: str = Field(..., min_length=15, description="YouTube video URL'si")
    language: Literal['Turkish', 'English', 'Russian', 'Chinese', 'Japanese']
    comment_style: str

class PostCommentRequest(BaseModel):
    video_url: str = Field(..., min_length=15)
    comment_text: str = Field(..., min_length=1)
    comment_id: str = Field(None, description="Generated comment ID if available")

@comment_routes.route('/api/generate_comment', methods=['POST'])
def generate_comment_route():
    """Generate comment with detailed error handling."""
    from flask import request
    
    # Manuel validation with detailed error info
    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error", 
            "message": "📡 Veri gönderilmedi!\n\nSunucuya hiç veri ulaşmadı.\n\n💡 İnternet bağlantınızı kontrol edin ve tekrar deneyin.",
            "user_friendly": True
        }), 400
    
    # Validate required fields
    if 'video_url' not in data:
        return jsonify({
            "status": "error", 
            "message": "📝 Eksik bilgi!\n\nYouTube video URL'si gerekli.\n\n💡 Lütfen geçerli bir YouTube video linki girin.",
            "user_friendly": True
        }), 400
    if 'language' not in data:
        return jsonify({
            "status": "error", 
            "message": "🌐 Dil seçimi gerekli!\n\nLütfen yorum dilini seçin.\n\n💡 Türkçe, İngilizce veya diğer mevcut dillerden birini seçin.",
            "user_friendly": True
        }), 400
    if 'comment_style' not in data:
        return jsonify({
            "status": "error", 
            "message": "🎨 Yorum stili gerekli!\n\nLütfen bir yorum stili belirtin.\n\n💡 Forma eksik bilgi gönderildi.",
            "user_friendly": True
        }), 400
        
    # Create validated object
    try:
        body = GenerateCommentRequest(
            video_url=data['video_url'],
            language=data['language'], 
            comment_style=data['comment_style']
        )
    except Exception as validation_error:
        return jsonify({
            "status": "error", 
            "message": f"📋 Form bilgileri hatalı!\n\nGönderilen veriler geçerli değil.\n\nTeknik detay: {str(validation_error)}\n\n💡 Sayfayı yenileyip tekrar deneyin.",
            "technical_error": str(validation_error),
            "user_friendly": True
        }), 400
    
    try:
        # 1. Video detaylarını ve istatistiklerini çek
        details, error = get_video_details(body.video_url)
        if error:
            user_friendly_message = "📹 Video bilgileri alınamadı!\n\n"
            
            if "not found" in error.lower():
                user_friendly_message += "Video bulunamadı. Bu durum şu sebeplerden olabilir:\n• Video silinmiş veya gizli\n• URL hatalı yazılmış\n• Video erişim kısıtlamasına sahip\n\n💡 URL'i kontrol edin ve geçerli, herkese açık bir video deneyin."
            elif "private" in error.lower():
                user_friendly_message += "Bu video özel veya kısıtlı erişimli.\n\n💡 Herkese açık bir YouTube videosu deneyin."
            else:
                user_friendly_message += f"Teknik detay: {error}\n\n💡 Farklı bir video deneyin veya daha sonra tekrar deneyin."
                
            return jsonify({
                "status": "error", 
                "message": user_friendly_message,
                "technical_error": error,
                "user_friendly": True
            }), 500
    except Exception as e:
        return jsonify({
            "status": "error", 
            "message": f"🔧 Beklenmeyen sistem hatası!\n\nTeknik detay: {str(e)}\n\n💡 Sayfayı yenileyin ve tekrar deneyin. Sorun devam ederse sistem yöneticisi ile iletişime geçin.",
            "technical_error": str(e),
            "user_friendly": True
        }), 500

    # 2. Kanal istatistiklerini çek
    if details and details.get('channel_id'):
        channel_stats, error = get_channel_details(details['channel_id'])
        if channel_stats:
            details.update(channel_stats) # Kanal istatistiklerini ana 'details' sözlüğüne ekle

    # 3. Video ID'sini çıkar
    video_id_match = re.search(r"(?<=v=)[^&#]+", body.video_url) or re.search(r"(?<=be/)[^&#]+", body.video_url)
    video_id = video_id_match.group(0) if video_id_match else None
    
    # 4. Mevcut yorumları çek
    existing_comments = []
    if video_id:
        existing_comments, _ = get_video_comments(video_id, max_results=10)
    
    # 5. Video transcript'ini çek ve özetle
    transcript_summary = None
    if video_id:
        transcript_text, transcript_error = get_video_transcript(video_id)
        if transcript_text and not transcript_error:
            transcript_summary, summary_error = summarize_transcript(transcript_text, body.language)
            if summary_error:
                transcript_summary = None

    # 6. Duplicate yorum kontrolü (generate etmeden önce uyar)
    if check_if_url_has_posted_comment(body.video_url):
        comment_count = get_video_comment_count(body.video_url)
        return jsonify({
            "status": "warning", 
            "message": f"⚠️ Aynı videoya daha önce yorum yapmışsınız!\n\nBu videoya toplam {comment_count} kez yorum gönderildi. Sistem güvenliği için aynı videoya birden fazla yorum gönderilmesine izin verilmiyor.\n\n✅ Yeni yorum oluşturabilirsiniz\n❌ Ancak bu videoya gönderilemez",
            "comment_count": comment_count,
            "can_generate": True,
            "can_post": False,
            "user_friendly": True
        }), 200

    # 7. Tüm verilerle Gemini'den yorum üret (transcript özeti dahil)
    comment_text, error = generate_comment_text(details, body.comment_style, body.language, existing_comments, transcript_summary)
    if error:
        # AI hata mesajını kullanıcı dostu hale getir
        user_friendly_message = "🤖 Yorum üretilirken hata oluştu!\n\n"
        
        if "api key" in error.lower():
            user_friendly_message += "🔑 AI servis bağlantısında sorun var.\n\n💡 Sistem yöneticisi ile iletişime geçin veya daha sonra tekrar deneyin."
        elif "quota" in error.lower() or "limit" in error.lower():
            user_friendly_message += "⏰ AI servis limit aşıldı.\n\n💡 Birkaç dakika bekleyip tekrar deneyin."
        elif "network" in error.lower() or "connection" in error.lower():
            user_friendly_message += "🌐 İnternet bağlantısı sorunu.\n\n💡 Bağlantınızı kontrol edin ve tekrar deneyin."
        else:
            user_friendly_message += f"Teknik detay: {error}\n\n💡 Sayfayı yenileyip tekrar deneyin."
        
        return jsonify({
            "status": "error", 
            "message": user_friendly_message,
            "technical_error": error,
            "user_friendly": True
        }), 500
    
    # 8. Generate edilen yorumu history'e kaydet
    comment_id = add_generated_comment(body.video_url, comment_text)
    
    return jsonify({
        "status": "success",
        "generated_text": comment_text,
        "comment_id": comment_id,
        "can_post": True
    })

@comment_routes.route('/api/post_comment', methods=['POST'])
def post_comment_route():
    from flask import request
    
    # Manuel validation
    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error", 
            "message": "📡 Veri gönderilmedi!",
            "user_friendly": True
        }), 400
    
    # Validate required fields
    if 'video_url' not in data or 'comment_text' not in data:
        return jsonify({
            "status": "error", 
            "message": "📝 Eksik bilgi! Video URL'si ve yorum metni gerekli.",
            "user_friendly": True
        }), 400
        
    # Create validated object
    try:
        body = PostCommentRequest(
            video_url=data['video_url'],
            comment_text=data['comment_text'],
            comment_id=data.get('comment_id', None)
        )
    except Exception as validation_error:
        return jsonify({
            "status": "error", 
            "message": f"📋 Form bilgileri hatalı! {str(validation_error)}",
            "user_friendly": True
        }), 400
    # Duplicate yorum kontrolü
    if check_if_url_has_posted_comment(body.video_url):
        comment_count = get_video_comment_count(body.video_url)
        return jsonify({
            "status": "error", 
            "message": f"🚫 Yorum gönderilemedi!\n\nBu videoya daha önce {comment_count} kez yorum gönderildi. Sistem güvenliği ve spam önleme politikası gereği aynı videoya birden fazla yorum gönderilmesine izin verilmiyor.\n\n💡 Başka bir videoyu deneyin veya daha önce yorum yapmadığınız bir video seçin.",
            "comment_count": comment_count,
            "user_friendly": True
        }), 409

    video_id_match = re.search(r"(?<=v=)[^&#]+", body.video_url) or re.search(r"(?<=be/)[^&#]+", body.video_url)
    if not video_id_match:
        return jsonify({
            "status": "error", 
            "message": "🔗 Geçersiz YouTube URL!\n\nLütfen geçerli bir YouTube video linki girin. Örnek formatlar:\n• https://www.youtube.com/watch?v=VIDEO_ID\n• https://youtu.be/VIDEO_ID\n\n💡 Linki kopyalarken tamamını seçtiğinizden emin olun.",
            "user_friendly": True
        }), 400
    video_id = video_id_match.group(0)

    response, error = post_youtube_comment(video_id, body.comment_text)
    if error:
        # Hata mesajını kullanıcı dostu hale getir
        user_friendly_message = "🚫 Yorum gönderilirken hata oluştu!\n\n"
        
        if "permission" in error.lower() or "forbidden" in error.lower():
            user_friendly_message += "📝 Yorum gönderme izniniz yok. Bu durum şu sebeplerden olabilir:\n• YouTube hesabınız yorum yapma kısıtlamasına sahip\n• Video sahibi yorumları devre dışı bırakmış\n• Hesabınız henüz doğrulanmamış\n\n💡 YouTube hesabınızı kontrol edin ve daha sonra tekrar deneyin."
        elif "quota" in error.lower() or "limit" in error.lower():
            user_friendly_message += "⏰ API limit aşıldı. Sistem geçici olarak yoğun.\n\n💡 Birkaç dakika bekledikten sonra tekrar deneyin."
        elif "not found" in error.lower():
            user_friendly_message += "📹 Video bulunamadı veya erişilemiyor.\n\n💡 Video linkini kontrol edin ve geçerli, erişilebilir bir video olduğundan emin olun."
        else:
            user_friendly_message += f"Teknik detay: {error}\n\n💡 Sorun devam ederse farklı bir video deneyin veya daha sonra tekrar deneyin."
        
        return jsonify({
            "status": "error", 
            "message": user_friendly_message,
            "technical_error": error,
            "user_friendly": True
        }), 500
    
    # YENİ EKLENEN SATIR: Yorum başarıyla gönderildikten sonra veritabanına kaydet
    if body.comment_id:
        # Eğer comment_id varsa, mevcut kaydı "posted" olarak işaretle
        mark_comment_as_posted(body.comment_id)
    else:
        # Eğer comment_id yoksa, yeni kayıt ekle (direct post)
        add_posted_comment(body.video_url, body.comment_text)
    
    return jsonify({"status": "success", "message": "Comment posted successfully!", "data": response})


@comment_routes.route('/api/history', methods=['GET'])
def get_history_route():
    comments = load_comments()
    return jsonify({
        "status": "success",
        "history": comments
    })