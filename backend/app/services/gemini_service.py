import google.generativeai as genai
from ..config import Config

# API anahtarını yapılandır
GEMINI_API_KEY = Config.GEMINI_API_KEY
if not GEMINI_API_KEY:
    print("ERROR: GEMINI_API_KEY not found in .env file.")
    model = None
else:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
    except Exception as e:
        print(f"Error configuring Gemini API: {e}")
        model = None

def generate_comment_text(details, comment_style, language, existing_comments=None):
    if not model:
        return "Gemini API is not configured correctly. Please check your API key.", True

    comment_section = "No comments available to analyze."
    if existing_comments:
        comment_section = "\n".join(
            [f"- '{c['text']}' (by {c['author']})" for c in existing_comments]
        )

    # --- GELİŞTİRİLMİŞ YORUM ÜRETME PROMPT'U ---
    prompt_template = f"""
### GÖREVİN ###
Sen Hasan Arthur Altuntaş tarafından geliştirilen CommendAI'sın. Görevin: YouTube videolarına özgün, yaratıcı ve değerli yorumlar üretmek. Yorum dili: **{language}**.

### VİDEO ANALİZİ ###
**Video Bilgileri:**
- Başlık: {details['title']}
- Kanal: {details['channel_name']}
- Açıklama: {details['description'][:500]}

**İstatistikler:**
- İzlenme: {details.get('view_count', 'Bilinmiyor')}
- Beğeni: {details.get('like_count', 'Bilinmiyor')}
- Süre: {details.get('duration', 'Bilinmiyor')}
- Abone Sayısı: {details.get('subscriber_count', 'Bilinmiyor')}

**Mevcut Yorumlar:**
{comment_section}

### YORUM STRATEJİSİ ###
**{comment_style}** stilinde yorum yaz:

1. **Özgünlük:** Sıradanlaşmış ifadeler kullanma. Yaratıcı ve dikkat çekici ol.
2. **Değer Katma:** Sadece övgü değil, konstruktif görüş ve analiz ekle.
3. **Kişisellik:** Sanki gerçek bir izleyici gibi, kendi deneyimlerinden bahset.
4. **Etkileşim:** Başkalarının yanıtlamak isteyeceği sorular sor.
5. **Orijinallik:** Mevcut yorumlardan farklı bir bakış açısı sun.

### YORUM KURALLARI ###
- **Dil:** Tamamen **{language}** dilinde yaz
- **Uzunluk:** 1-3 cümle arası, kısa ve etkili
- **Ton:** Video konusuna uygun (ciddi/eğlenceli/destekleyici)
- **Özgünlük:** Klişe ifadelerden kaçın
- **Disclaimer:** Yorumun sonuna yeni satırda "Not: Bu yorum AI tarafından üretilmiştir." ekle

### ÖRNEKLER ###
Kötü: "Harika video! Çok beğendim!"
İyi: "3:45'teki o detay gerçekten önemli bir noktaydı, bu konuya hiç bu açıdan bakmamıştım."

**Yorumun:**
"""

    try:
        response = model.generate_content(prompt_template)
        return response.text, None
    except Exception as e:
        print(f"An error occurred during Gemini API call: {e}")
        return f"Error generating comment: {e}", True