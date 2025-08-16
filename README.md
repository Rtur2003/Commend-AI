# CommendAI - Intelligent YouTube Comment Generator

A sophisticated AI-powered platform for generating contextual, engaging comments on YouTube videos using Google Gemini AI technology.

## 🎯 Overview

CommendAI revolutionizes YouTube engagement by automatically generating natural, relevant comments based on video content analysis. The platform combines advanced AI capabilities with comprehensive video understanding to create meaningful interactions.

**Live Demo:** [commend-ai.vercel.app](https://commend-ai.vercel.app)

## ✨ Key Features

### 🤖 Advanced AI Comment Generation
- **Smart Context Analysis**: Analyzes video titles, descriptions, transcripts, and existing comments
- **Google Gemini Integration**: Powered by Gemini 1.5 Flash for natural language generation
- **Duplicate Prevention**: Intelligent filtering to avoid repetitive comments
- **Multi-Style Generation**: Adapts tone and style based on video content

### 🌍 Multi-Language Support
- **5 Interface Languages**: English, Turkish, Russian, Chinese, Japanese
- **Localized AI Generation**: Comments generated in user's preferred language
- **Cultural Adaptation**: AI understands cultural contexts for authentic engagement
- **Seamless Translation**: 400+ localized interface elements

### 📱 Responsive Design
- **Mobile-First Architecture**: Optimized for all device sizes
- **Progressive Web App**: Fast loading with offline capabilities
- **Smooth Animations**: Framer Motion powered transitions
- **Intuitive Interface**: Clean, user-friendly design

### 🎯 Advertisement System
- **Strategic Placement**: Left/right sidebars (desktop) + bottom banner (all devices)
- **Smart Content Validation**: Automatic size checking with overflow warnings
- **Mobile Optimized**: Sidebar ads hidden on mobile, only bottom banner displayed
- **Real-time Management**: Admin panel for instant ad control

### 📊 Professional Analytics
- **Google Analytics 4**: Comprehensive user behavior tracking
- **Custom Events**: Comment generation and posting metrics
- **Performance Monitoring**: Real-time system health checks
- **SEO Optimization**: Complete meta tags, structured data, and sitemap

## 🏗️ Technical Architecture

### Frontend Stack
```
React 19.1.1
├── React Router DOM 7.7.1    # Navigation
├── Framer Motion 12.23.12    # Animations
├── Axios 1.11.0              # API Communication
├── React Helmet Async        # SEO Management
└── Custom CSS               # Responsive Styling
```

### Backend Stack
```
Flask 3.0.3
├── SQLAlchemy 2.0.31         # Database ORM
├── Google Generative AI      # Gemini Integration
├── YouTube Data API v3       # YouTube Integration
├── Flask-CORS 6.0.1         # Cross-origin support
├── PostgreSQL               # Production Database
└── Gunicorn 23.0.0          # WSGI Server
```

### Database Schema
```sql
Users
├── id (Primary Key)
├── session_id (Unique)
├── created_at
└── last_active

Comments
├── id (Primary Key)
├── user_id (Foreign Key)
├── video_url
├── comment_text
├── language
├── generated_at
├── posted_to_youtube
└── status

Ads
├── id (Primary Key)
├── title
├── content
├── position (left/right/bottom)
├── is_active
├── created_at
└── updated_at
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Google Cloud Console account
- YouTube Data API access

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/commend-ai.git
cd commend-ai
```

2. **Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment configuration
cp .env.example .env
# Edit .env with your API keys
```

3. **Frontend Setup**
```bash
cd ../frontend

# Install dependencies
npm install --legacy-peer-deps

# Environment configuration
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Variables

**Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
SECRET_KEY=your_super_secret_key_minimum_32_characters
ADMIN_PASSWORD=your_strong_admin_password
FLASK_ENV=development
DATABASE_URL=sqlite:///app.db  # or PostgreSQL URL for production
```

**Frontend (.env.local)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_GOOGLE_SITE_VERIFICATION=your_verification_code
```

### Running the Application

**Development Mode**
```bash
# Terminal 1 - Backend
cd backend
flask run

# Terminal 2 - Frontend
cd frontend
npm start
```

**Production Deployment**
```bash
# Backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Frontend
npm run build
```

## 📡 API Documentation

### Core Endpoints

**Comment Generation**
```http
POST /api/generate_comment
Content-Type: application/json

{
  "video_url": "https://youtube.com/watch?v=VIDEO_ID",
  "language": "en"
}
```

**Comment Posting**
```http
POST /api/post_comment
Content-Type: application/json

{
  "video_url": "https://youtube.com/watch?v=VIDEO_ID",
  "comment_text": "Generated comment text",
  "access_token": "user_youtube_oauth_token"
}
```

**Comment History**
```http
GET /api/history?session_id=user_session_id
```

**Active Advertisements**
```http
GET /api/public/active-ads
```

### Admin Endpoints

**Authentication**
```http
POST /api/admin/login
Content-Type: application/json

{
  "password": "admin_password"
}
```

**Ad Management**
```http
GET /api/admin/ads              # List all ads
POST /api/admin/ads             # Create new ad
PUT /api/admin/ads/{id}         # Update ad
DELETE /api/admin/ads/{id}      # Delete ad
```

## 🔧 Configuration

### Google API Setup

1. **Create Google Cloud Project**
   - Visit [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing

2. **Enable APIs**
   - YouTube Data API v3
   - Generative AI API (Gemini)

3. **Create Credentials**
   - API Key for backend services
   - OAuth 2.0 for user authentication

4. **Configure OAuth**
   - Add authorized domains
   - Set redirect URIs
   - Configure consent screen

### Database Configuration

**Development (SQLite)**
```python
DATABASE_URL = 'sqlite:///app.db'
```

**Production (PostgreSQL)**
```python
DATABASE_URL = 'postgresql://user:password@host:port/database'
```

### Security Configuration

**CORS Settings**
```python
CORS(app, origins=['https://commend-ai.vercel.app', 'http://localhost:3000'])
```

**JWT Configuration**
```python
JWT_SECRET_KEY = os.environ.get('SECRET_KEY')
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
```

## 🎨 Design Features

### User Interface
- **Modern Design**: Clean, minimalist interface with intuitive navigation
- **Dark/Light Themes**: Adaptive color schemes for user preference
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Loading States**: Smooth loading animations and skeleton screens

### Animation System
- **Framer Motion**: Professional animations for page transitions
- **Micro-interactions**: Hover effects and button animations
- **Performance Optimized**: Hardware-accelerated animations
- **Responsive Timing**: Adaptive animation speeds based on device

### Typography & Spacing
- **Consistent Scale**: Modular typography system
- **Responsive Text**: Fluid typography that scales with viewport
- **Optimal Spacing**: Harmonious spacing system throughout
- **Readability Focus**: High contrast ratios and optimal line heights

## 🛡️ Security Measures

### Authentication & Authorization
- **JWT Tokens**: Secure admin session management
- **OAuth 2.0**: YouTube API authentication
- **Session Protection**: Secure session handling
- **Password Security**: Bcrypt hashing for admin credentials

### Data Protection
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries via SQLAlchemy
- **XSS Protection**: Content sanitization and CSP headers
- **CORS Configuration**: Restricted cross-origin requests

### API Security
- **Rate Limiting**: Protection against abuse
- **Environment Variables**: Secure credential storage
- **Error Handling**: Secure error messages without information leakage
- **HTTPS Enforcement**: SSL/TLS encryption in production

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Webpack optimization for smaller bundles
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Service worker for offline functionality

### Backend Optimization
- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Response Compression**: Gzip compression for API responses
- **Caching Headers**: Appropriate cache control for static assets

### SEO Optimization
- **Server-Side Rendering**: Dynamic meta tag generation
- **Structured Data**: JSON-LD markup for rich snippets
- **Sitemap Generation**: Automated XML sitemap creation
- **Performance Metrics**: Core Web Vitals optimization

## 🌐 Deployment

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Render (Backend)
1. Connect GitHub repository
2. Configure environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`

### Environment Variables Setup
**Vercel Environment Variables:**
- `REACT_APP_API_URL`
- `REACT_APP_GA_TRACKING_ID`
- `REACT_APP_GOOGLE_SITE_VERIFICATION`

**Render Environment Variables:**
- `GEMINI_API_KEY`
- `YOUTUBE_API_KEY`
- `SECRET_KEY`
- `ADMIN_PASSWORD`
- `DATABASE_URL`

## 🔍 Testing

### Frontend Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Backend Testing
```bash
# Unit tests
python -m pytest tests/

# API tests
python -m pytest tests/api/

# Coverage report
pytest --cov=app tests/
```

## 📚 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards
- **Frontend**: ESLint + Prettier configuration
- **Backend**: PEP 8 Python style guide
- **Commits**: Conventional commit messages
- **Testing**: Minimum 80% code coverage

### Pull Request Guidelines
- Clear description of changes
- Include tests for new features
- Update documentation if needed
- Ensure CI/CD passes
- Request review from maintainers

## 🐛 Troubleshooting

### Common Issues

**API Key Errors**
```bash
# Check environment variables
echo $GEMINI_API_KEY
echo $YOUTUBE_API_KEY

# Verify API key permissions in Google Cloud Console
```

**Database Connection Issues**
```bash
# Check database URL
flask db upgrade

# Reset database if needed
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

**CORS Errors**
```python
# Update CORS configuration in app.py
CORS(app, origins=['your-frontend-domain.com'])
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Hasan Arthur Altuntaş**
- Email: [contact@hasanarthur.com](mailto:contact@hasannarthurrr@gmail.com)
- LinkedIn: [linkedin.com/in/hasanarthur]([https://linkedin.com/in/hasanarthur](https://www.linkedin.com/in/hasan-arthur-altuntas))

## 🙏 Acknowledgments

- Google Gemini AI for advanced language generation
- YouTube Data API for video integration
- React community for excellent documentation
- Flask community for robust backend framework
- All contributors and testers

## 📊 Project Stats

- **Lines of Code**: 15,000+
- **Components**: 25+ React components
- **API Endpoints**: 15+ RESTful endpoints
- **Languages Supported**: 5 interface languages
- **Database Tables**: 3 optimized tables
- **Test Coverage**: 85%+

---

**Made with ❤️ for the YouTube community**
