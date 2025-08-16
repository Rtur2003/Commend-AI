from app import create_app
from app.core.config import Config

# Uygulama fabrikasını çağırarak uygulamayı oluştur
app = create_app(Config)

# Bu betik doğrudan çalıştırıldığında sunucuyu başlat
if __name__ == '__main__':
    app.run(debug=True, port=5000)