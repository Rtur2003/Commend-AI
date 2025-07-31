from flask import Flask, jsonify
from flask_cors import CORS
from app import create_app

# Flask uygulamasını create_app() ile oluştur
app = create_app()

# Frontend'den gelen isteklere izin ver
CORS(app,
     origins=["http://localhost:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# --- MERKEZİ HATA YÖNETİCİSİ ---
@app.errorhandler(Exception)
def handle_exception(e):
    print(f"An unhandled error occurred: {e}")
    
    response = {
        "status": "error",
        "message": "Sunucuda beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    }
    return jsonify(response), 500

# DEBUG: Session bilgilerini logla
@app.before_request
def log_request_info():
    from flask import request, session
    print(f"Request: {request.method} {request.url}")
    print(f"Session: {dict(session)}")
    print(f"Headers: {dict(request.headers)}")

# Bu betik doğrudan çalıştırıldığında sunucuyu başlat
if __name__ == '__main__':
    app.run(debug=True, port=5000)