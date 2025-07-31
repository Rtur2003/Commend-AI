from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.comment_routes import comment_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# --- YENİ EKLENEN BÖLÜM: MERKEZİ HATA YÖNETİCİSİ ---
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
# ----------------------------------------------------

# Test rotası
@app.route('/api/test', methods=['GET'])
def test_route():
    return {"message": "Hello from the CommendAI Backend!"}

# Yorum rotalarını uygulamaya kaydediyoruz
app.register_blueprint(comment_routes)

if __name__ == '__main__':
    app.run(debug=True, port=5000)