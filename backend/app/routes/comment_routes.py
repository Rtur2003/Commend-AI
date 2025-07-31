from flask import Blueprint, request, jsonify
import time

# Bu, 'comment' adında bir blueprint (rota grubu) oluşturur.
comment_routes = Blueprint('comment', __name__)

@comment_routes.route('/api/generate_comment', methods=['POST'])
def generate_comment_route():
    data = request.json
    video_url = data.get('video_url')
    comment_style = data.get('comment_style')

    # --- SİMÜLASYON BAŞLANGICI ---
    # Bir sonraki adımda buraya gerçek YouTube ve Gemini servis çağrıları gelecek.
    # Şimdilik, bağlantıyı test etmek için sahte bir cevap üretiyoruz.
    print(f"Backend'e gelen istek: URL='{video_url}', Stil='{comment_style}'")

    time.sleep(2) # Yapay zekanın düşünme süresini taklit edelim.

    simulated_comment = f"Bu, '{video_url}' linki için üretilmiş '{comment_style}' stilinde SİMÜLE bir yorumdur."
    # --- SİMÜLASYON SONU ---

    return jsonify({
        "status": "success",
        "generated_text": simulated_comment
    })