from flask import Flask
from flask_cors import CORS

# Rota blueprint'lerimizi import ediyoruz
from app.routes.comment_routes import comment_routes

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Test rotası (eski)
@app.route('/api/test', methods=['GET'])
def test_route():
    return {"message": "Hello from the CommendAI Backend!"}

# Yeni yorum üretme rotalarını uygulamaya kaydediyoruz
app.register_blueprint(comment_routes)

if __name__ == '__main__':
    app.run(debug=True, port=5000)