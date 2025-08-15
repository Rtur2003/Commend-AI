
# CommendAI v2.0
**Developer: Hasan Arthur Altuntaş**

> AI-powered web application that generates stylish, contextual comments for YouTube videos and posts them on your behalf.



## ✨ Key Features

  - **AI-Powered Comment Generation:** Uses Google Gemini API to create contextual, creative and witty comments based on video content.
  - **Multi-Language Support:** Generates comments in specified languages (Turkish, English, Russian, etc.).
  - **Automated Comment Posting:** Posts generated comments to YouTube through authorized bot account.
  - **Comment History:** Stores and displays all previously posted comments in the interface.
  - **Duplicate Prevention:** Intelligently prevents posting multiple comments to the same video.
  - **Data Validation:** Validates backend data to make the system more secure and robust.
  - **Admin Panel:** Includes a hidden admin panel to track application statistics.

## 🛠️ Technologies Used

  - **Frontend:** React, React Router, Axios
  - **Backend:** Python, Flask, Pydantic
  - **APIs:** Google Gemini API, YouTube Data API v3
  - **Database:** SQLite (development), PostgreSQL (production)
  - **Authentication:** Google OAuth 2.0, Flask Sessions

## Prerequisites

Before running the project, make sure you have the following tools installed:

  - **Python** (version 3.8+)
  - **Node.js** and **npm** (version 16+)
  - **Git**

## 🚀 Installation Steps

Follow these steps to set up and run this project on your local machine.

### 1\. Clone the Repository

```bash
git clone https://github.com/Rtur2003/Commend-AI.git
cd Commend-AI
```

### 2\. Google Cloud and API Keys Setup (Most Important Step)

Since this application uses Google's APIs, you need to create several keys and credential files.

a. **Create Google Cloud Project:**

  - Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project.

b. **Enable Required APIs:**

  - In your created project, go to "APIs & Services" \> "Library" section and search for and enable these two APIs:
    1.  **YouTube Data API v3**
    2.  **Generative Language API** (or Vertex AI API)

c. **Create Gemini API Key:**

  - Go to [Google AI Studio](https://ai.google.dev/), sign in with the same Google account and create an API key. Copy this key.

d. **Create OAuth 2.0 Credentials (`client_secret.json`):**

  - In Google Cloud Console, go to "APIs & Services" \> "Credentials" page.
  - Select **"+ CREATE CREDENTIALS"** \> **"OAuth client ID"**.
  - Choose **"Desktop application"** as **"Application type"**.
  - Give it a name and click **CREATE**.
  - From the popup window, click **"DOWNLOAD JSON"** button and rename the downloaded file to **`client_secret.json`**.

e. **Configure Consent Screen:**

  - On the Credentials page, go to "OAuth consent screen" tab.
  - Click **"+ ADD USERS"** button to add your bot account's email address (`commend.ai.v1@gmail.com`) as a test user.

### 3\. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install required Python packages
pip install -r requirements.txt

# Create .env file
# Copy .env.example file and rename it to .env, then fill it with your information.
```

**Your `.env` file should contain:**

```
GEMINI_API_KEY="Your_key_from_Google_AI_Studio_goes_here"
YOUTUBE_API_KEY="This_field_is_no_longer_needed_you_can_leave_it_empty"
SECRET_KEY="Write_a_very_secret_and_unpredictable_key_here"
ADMIN_PASSWORD="Write_a_strong_password_that_only_you_know_here"
```

  - Finally, place the **`client_secret.json`** file you downloaded in the previous step into this `backend` folder.

### 4\. Frontend Setup

```bash
# Go back to main directory, then navigate to frontend folder
cd ../frontend

# Install required Node.js packages
npm install
```

## 💻 Running the Application

### Development Environment
The application requires **two separate terminals** to run.

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

The application interface will open at `http://localhost:3000`.

### 🔑 Initial Authorization (One-time Setup)

After running the backend for the first time, when you try to perform an operation from the application (e.g., generating comments), the terminal will ask you to visit a URL to authorize your bot account. After completing this step, a `token.json` file will be created in your project's `backend` directory and this step will not be needed again.

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

🌐 **Frontend (Vercel):** [https://commend-ai-frontend.vercel.app](https://commend-ai.vercel.app)  
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

## ⚙️ Usage

  - **Main Interface:** Access from your application's domain address
  - **Admin Panel:** Go to `/admin` path and log in with the `ADMIN_PASSWORD` you set in the `.env` file
# Migration endpoint
