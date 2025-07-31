from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from app.routes.comment_routes import comment_routes
from app.routes.admin_routes import admin_routes

# Flask uygulamasını oluştur
app = Flask(__name__)

# Yapılandırma ayarlarını config.py dosyasından yükle (SECRET_KEY için önemli)
app.config.from_object(Config)

# Frontend'den (localhost:3000) gelen isteklere izin ver ve oturum (session) bilgilerini destekle
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# --- MERKEZİ HATA YÖNETİCİSİ ---
@app.errorhandler(Exception)
def handle_exception(e):
    """Uygulamada yakalanmayan tüm hatalar için genel bir cevap döndürür."""
    # Gerçek hatayı loglayarak bizim görmemizi sağlar
    print(f"An unhandled error occurred: {e}") 
    # Frontend'e her zaman temiz ve anlaşılır bir mesaj gönderir
    response = {
        "status": "error",
        "message": "Sunucuda beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    }
    return jsonify(response), 500
# ------------------------------------

# Rota gruplarını (Blueprint) uygulamaya kaydet
app.register_blueprint(comment_routes)
app.register_blueprint(admin_routes)

# Bu betik doğrudan çalıştırıldığında sunucuyu başlat
if __name__ == '__main__':
    app.run(debug=True, port=5000)