
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
  - **Veritabanı:** JSON (yorum geçmişi için)
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

## ⚙️ Kullanım

  - **Ana Arayüz:** `http://localhost:3000` adresinden uygulamayı kullanabilirsiniz.
  - **Admin Paneli:** `http://localhost:3000/admin` adresine gidin ve `.env` dosyasında belirlediğiniz `ADMIN_PASSWORD` ile giriş yapın.