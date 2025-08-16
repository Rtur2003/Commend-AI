/**
 * Open Graph Image Generator
 * Creates dynamic OG images for better social media sharing
 * Author: Hasan Arthur Altuntaş
 */

export const generateOGImageConfig = (page, title, description) => {
  const baseConfig = {
    width: 1200,
    height: 630,
    backgroundColor: '#0f172a', // Dark blue background
    fontFamily: 'Inter, system-ui, sans-serif'
  };

  const pageConfigs = {
    home: {
      title: 'CommendAI',
      subtitle: 'AI YouTube Comment Generator',
      description: 'Generate engaging comments with AI',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: '🤖',
      features: ['5 Languages', 'AI-Powered', 'Free Forever']
    },
    features: {
      title: 'Features',
      subtitle: 'Powerful AI Tools',
      description: 'Everything you need for YouTube success',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '🚀',
      features: ['Real-time Generation', 'Multi-language', 'Smart Analytics']
    },
    faq: {
      title: 'FAQ',
      subtitle: 'Get Your Questions Answered',
      description: 'Learn how CommendAI can help you',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '❓',
      features: ['Quick Answers', 'Detailed Guides', 'Expert Tips']
    }
  };

  return {
    ...baseConfig,
    ...(pageConfigs[page] || pageConfigs.home),
    customTitle: title,
    customDescription: description
  };
};

// Function to create OG image HTML template
export const createOGImageHTML = (config) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          width: ${config.width}px;
          height: ${config.height}px;
          background: ${config.gradient};
          font-family: ${config.fontFamily};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .container {
          width: 90%;
          height: 90%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 40px;
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .icon {
          font-size: 60px;
          background: rgba(255, 255, 255, 0.2);
          width: 100px;
          height: 100px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-section {
          flex: 1;
        }

        .main-title {
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin: 0 0 10px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
          font-size: 28px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 0;
        }

        .description {
          font-size: 24px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.4;
          margin-bottom: 30px;
          max-width: 800px;
        }

        .features {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .feature {
          background: rgba(255, 255, 255, 0.15);
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: 600;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .branding {
          font-size: 20px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .url {
          font-size: 18px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
        }

        .decoration {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          z-index: 1;
        }

        .decoration-2 {
          position: absolute;
          bottom: -30px;
          left: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          z-index: 1;
        }
      </style>
    </head>
    <body>
      <div class="decoration"></div>
      <div class="decoration-2"></div>
      
      <div class="container">
        <div class="header">
          <div class="icon">${config.icon}</div>
          <div class="title-section">
            <h1 class="main-title">${config.customTitle || config.title}</h1>
            <p class="subtitle">${config.subtitle}</p>
          </div>
        </div>

        <div class="content">
          <p class="description">${config.customDescription || config.description}</p>
          <div class="features">
            ${config.features.map(feature => `<div class="feature">${feature}</div>`).join('')}
          </div>
        </div>

        <div class="footer">
          <div class="branding">CommendAI</div>
          <div class="url">commend-ai.vercel.app</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Export function to generate image URL (for actual implementation)
export const generateOGImageUrl = (page, title, description) => {
  const config = generateOGImageConfig(page, title, description);
  const html = createOGImageHTML(config);
  
  // In production, you would use a service like:
  // - Vercel OG Image Generation API
  // - Cloudinary Dynamic Images
  // - Custom serverless function
  
  // For now, return a placeholder URL structure
  const params = new URLSearchParams({
    page,
    title: title || config.title,
    description: description || config.description
  });
  
  return `https://commend-ai.vercel.app/api/og?${params.toString()}`;
};

// Default OG images for each page
export const defaultOGImages = {
  home: '/og-home.png',
  features: '/og-features.png',
  faq: '/og-faq.png',
  default: '/og-image.png'
};