
-----

# CommendAI v2.0

> YouTube için yapay zeka destekli, stil sahibi yorumlar üreten ve bu yorumları sizin adınıza gönderen kişisel bir web uygulaması.



## ✨ Temel Özellikler

  - **Yapay Zeka Destekli Yorum Üretme:** Google Gemini API'si ile videonun içeriğine uygun, yaratıcı ve esprili yorumlar oluşturur.
  - **Çoklu Dil Desteği:** Belirtilen dilde (Türkçe, İngilizce, Rusça vb.) yorumlar üretebilir.
  - **Otomatik Yorum Gönderme:** Üretilen yorumları, yetkilendirilmiş bot hesabı üzerinden YouTube'a gönderir.
  - **Yorum Geçmişi:** Daha önce gönderilmiş tüm yorumları saklar ve arayüzde gösterir.
  - **Tekrarlı Yorum Engelleme:** Bir videoya daha önce yorum yapılmışsa, tekrar yorum gönderilmesini akıllıca engeller.
  - **Veri Doğrulama:** Backend'e gelen verileri doğrulayarak sistemi daha güvenli ve sağlam hale getirir.
  - **Admin Paneli:** Uygulama istatistiklerini takip etmek için gizli bir admin paneli içerir.

## 🛠️ Kullanılan Teknolojiler

  - **Frontend:** React, React Router, Axios
  - **Backend:** Python, Flask, Pydantic
  - **API'ler:** Google Gemini API, YouTube Data API v3
  - **Veritabanı:** SQLite (development), PostgreSQL (production)
  - **Kimlik Doğrulama:** Google OAuth 2.0, Flask Sessions

## Gereksinimler

Projeyi çalıştırmadan önce bilgisayarınızda aşağıdaki araçların kurulu olduğundan emin olun:

  - **Python** (versiyon 3.8+)
  - **Node.js** ve **npm** (versiyon 16+)
  - **Git**

## 🚀 Kurulum Adımları

Bu projeyi yerel makinenizde sıfırdan kurmak ve çalıştırmak için aşağıdaki adımları izleyin.

### 1\. Projeyi Bilgisayarınıza İndirin

```bash
git clone https://github.com/Rtur2003/Commend-AI.git
cd Commend-AI
```

### 2\. Google Cloud ve API Anahtarlarını Ayarlama (En Önemli Adım)

Bu uygulama, Google'ın API'lerini kullandığı için birkaç anahtar ve kimlik bilgisi dosyası oluşturmanız gerekmektedir.

a. **Google Cloud Projesi Oluşturun:**

  - [Google Cloud Console](https://console.cloud.google.com/)'a gidin ve yeni bir proje oluşturun.

b. **Gerekli API'leri Aktif Edin:**

  - Oluşturduğunuz projede, "API'ler ve Hizmetler" \> "Kitaplık" bölümüne gidin ve aşağıdaki iki API'yi aratıp etkinleştirin:
    1.  **YouTube Data API v3**
    2.  **Generative Language API** (veya Vertex AI API)

c. **Gemini API Anahtarı Oluşturun:**

  - [Google AI Studio](https://ai.google.dev/)'ya gidin, aynı Google hesabıyla giriş yapın ve bir API anahtarı oluşturun. Bu anahtarı kopyalayın.

d. **OAuth 2.0 Kimlik Bilgileri Oluşturun (`client_secret.json`):**

  - Google Cloud Console'da "API'ler ve Hizmetler" \> "Kimlik Bilgileri" sayfasına gidin.
  - **"+ KİMLİK BİLGİSİ OLUŞTUR"** \> **"OAuth istemci kimliği"** seçeneğini seçin.
  - **"Uygulama türü"** olarak **"Masaüstü uygulaması"** seçin.
  - Bir isim verin ve **OLUŞTUR**'a tıklayın.
  - Açılan pencereden **"JSON'U İNDİR"** butonuna tıklayın ve indirilen dosyanın adını **`client_secret.json`** olarak değiştirin.

e. **İzin Ekranını Yapılandırın:**

  - Kimlik Bilgileri sayfasında, "İzin Ekranı" (OAuth consent screen) sekmesine gidin.
  - **"+ ADD USERS"** butonuna tıklayarak bot hesabınızın e-posta adresini (`commend.ai.v1@gmail.com`) test kullanıcısı olarak ekleyin.

### 3\. Backend'i Kurma

```bash
# Backend klasörüne gidin
cd backend

# Gerekli Python kütüphanelerini kurun
pip install -r requirements.txt

# .env dosyasını oluşturun
# .env.example dosyasını kopyalayıp .env olarak adlandırın ve içini kendi bilgilerinizle doldurun.
```

**`.env` dosyanızın içeriği şu şekilde olmalıdır:**

```
GEMINI_API_KEY="Buraya_Google_AI_Studio'dan_aldığınız_anahtar_gelecek"
YOUTUBE_API_KEY="Bu_alan_artik_gerekli_degil_bos_birakabilirsiniz"
SECRET_KEY="Buraya_cok_gizli_ve_tahmin_edilemez_bir_anahtar_yazin"
ADMIN_PASSWORD="Buraya_sadece_sizin_bileceginiz_guclu_bir_sifre_yazin"
```

  - Son olarak, bir önceki adımda indirdiğiniz **`client_secret.json`** dosyasını bu `backend` klasörünün içine yerleştirin.

### 4\. Frontend'i Kurma

```bash
# Ana dizine geri dönün, sonra frontend klasörüne gidin
cd ../frontend

# Gerekli Node.js paketlerini kurun
npm install
```

## 💻 Uygulamayı Çalıştırma

### Geliştirme Ortamı
Uygulamanın çalışması için **iki ayrı terminal** gereklidir.

  - **Terminal 1 (Backend):**

    ```bash
    cd backend
    python run.py
    ```

  - **Terminal 2 (Frontend):**

    ```bash
    cd frontend
    npm start
    ```

Uygulama arayüzü `http://localhost:3000` adresinde açılacaktır.

### 🔑 İlk Yetkilendirme (Tek Seferlik)

Backend'i ilk kez çalıştırdıktan sonra, uygulamadan bir işlem yapmaya çalıştığınızda (örn. yorum üretme), terminal sizden bir URL'i ziyaret ederek bot hesabınızı yetkilendirmenizi isteyecektir. Bu adımı tamamladıktan sonra projenizin `backend` dizininde bir `token.json` dosyası oluşacak ve bu adıma bir daha gerek kalmayacaktır.

## 🚀 Production Deployment

### Backend Deployment (Render)

1. **Render hesabı ve proje ayarlama:**
   ```bash
   # GitHub'a projeyi push edin
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Render.com'da Web Service oluşturun:**
   - [Render.com](https://render.com) hesabı açın
   - "New Web Service" seçin
   - GitHub repository'nizi bağlayın
   - Ayarlar:
     - **Name:** commend-ai-backend
     - **Environment:** Python
     - **Build Command:** `pip install -r requirements.txt`
     - **Start Command:** `gunicorn -w 4 -b 0.0.0.0:$PORT "app:create_app()"`
     - **Root Directory:** `backend`

3. **PostgreSQL Database ekleyin:**
   - Render Dashboard'da "New PostgreSQL" seçin
   - Database adı: `commend-ai-db`
   - Plan: Free tier
   - External Database URL'i kopyalayın

4. **Environment Variables ayarlayın:**
   ```bash
   FLASK_ENV=production
   SECRET_KEY=your-super-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key-here  
   ADMIN_PASSWORD=your-admin-password-here
   DATABASE_URL=postgresql://username:password@host:port/database
   CLIENT_SECRET_JSON={"web":{"client_id":"...","project_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"...","redirect_uris":["http://localhost"]}}
   ```

### Frontend Deployment (Vercel)

1. **Vercel hesabı ve deploy:**
   - [Vercel.com](https://vercel.com) hesabı açın
   - "New Project" seçin  
   - GitHub repository'nizi bağlayın
   - Ayarlar:
     - **Framework Preset:** Create React App
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`

2. **API URL otomatik ayarlandı:**
   - Production ve development URL'leri `src/services/api.js`'de ayarlandı
   - Production: `https://commend-ai-backend.onrender.com/api`
   - Development: `http://127.0.0.1:5000/api`

### Live Deployment URLs

🌐 **Frontend (Vercel):** https://commend-ai-frontend.vercel.app  
⚙️ **Backend API (Render):** https://commend-ai-backend.onrender.com  
📊 **Health Check:** https://commend-ai-backend.onrender.com/api/test

### Güvenlik ve Deployment Kontrol Listesi

✅ **Tamamlandı:**
- SECRET_KEY environment variable olarak ayarlandı
- ADMIN_PASSWORD environment variable olarak ayarlandı  
- Session cookies production'da güvenli
- Gemini model adı düzeltildi (`gemini-1.5-flash`)
- Production dependencies eklendi (PostgreSQL, Gunicorn)
- SQLite → PostgreSQL migration tamamlandı
- CORS ayarları production için yapılandırıldı
- Environment variables için JSON parsing ve error handling eklendi
- Frontend ve Backend başarıyla deploy edildi

⚠️ **Manuel Kontrol Gerekli:**
- `.env` dosyası git'e commit edilmemeli
- `client_secret.json` dosyası git'e commit edilmemeli  
- CLIENT_SECRET_JSON environment variable'ı tek satırda, kontrol karakterleri olmadan ayarlanmalı
- Güçlü şifreler kullanın
- Production'da HTTPS otomatik olarak aktif (Render/Vercel)

## ⚙️ Kullanım

  - **Ana Arayüz:** Uygulamanızın domain adresinden erişebilirsiniz
  - **Admin Paneli:** `/admin` yoluna gidin ve `.env` dosyasında belirlediğiniz `ADMIN_PASSWORD` ile giriş yapın