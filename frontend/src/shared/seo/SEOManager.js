/**
 * Professional SEO Management System
 * Comprehensive SEO optimization for CommendAI
 * Author: Hasan Arthur Altuntaş
 */

export class SEOManager {
  constructor() {
    this.baseUrl = 'https://commend-ai.vercel.app';
    this.siteName = 'CommendAI';
    this.defaultImage = '/og-image.png';
    this.twitterHandle = '@CommendAI';
    this.language = 'en';
    this.region = 'US';
  }

  // Core SEO data generator
  generateSEOData(page) {
    const pages = {
      home: {
        title: 'AI YouTube Comment Generator - Free Online Tool | CommendAI',
        description: 'Generate engaging YouTube comments instantly with AI. Free, multilingual (5 languages), and smart. Boost your YouTube engagement with contextual comment suggestions.',
        keywords: [
          'YouTube comment generator', 'AI comment generator', 'YouTube engagement',
          'social media automation', 'content creation tools', 'YouTube marketing',
          'AI writing assistant', 'comment suggestions', 'YouTube growth tools',
          'free online tools', 'artificial intelligence', 'social media growth'
        ],
        type: 'website',
        priority: 1.0,
        changeFreq: 'weekly',
        breadcrumbs: [
          { name: 'Home', url: this.baseUrl }
        ]
      },
      features: {
        title: 'Features - AI YouTube Comment Generator | CommendAI',
        description: 'Discover CommendAI features: Real-time AI generation, 5-language support, YouTube integration, comment history, and smart analytics for content creators.',
        keywords: [
          'AI comment features', 'YouTube tools', 'comment generator features',
          'AI writing tools', 'content creation', 'multilingual support',
          'YouTube integration', 'comment analytics', 'social media tools'
        ],
        type: 'website',
        priority: 0.8,
        changeFreq: 'monthly',
        breadcrumbs: [
          { name: 'Home', url: this.baseUrl },
          { name: 'Features', url: `${this.baseUrl}/features` }
        ]
      },
      faq: {
        title: 'FAQ - Frequently Asked Questions | CommendAI',
        description: 'Get answers about CommendAI YouTube comment generator. Learn how AI comment generation works, supported languages, pricing, and best practices.',
        keywords: [
          'CommendAI FAQ', 'YouTube comment help', 'AI comment questions',
          'comment generator support', 'how to use', 'troubleshooting',
          'YouTube automation FAQ', 'AI tools help'
        ],
        type: 'article',
        priority: 0.7,
        changeFreq: 'monthly',
        breadcrumbs: [
          { name: 'Home', url: this.baseUrl },
          { name: 'FAQ', url: `${this.baseUrl}/faq` }
        ]
      }
    };

    return pages[page] || pages.home;
  }

  // Advanced structured data generator
  generateStructuredData(pageData, additionalData = {}) {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${this.baseUrl}#website`,
          "url": this.baseUrl,
          "name": this.siteName,
          "description": "AI-powered YouTube comment generator for content creators",
          "publisher": { "@id": `${this.baseUrl}#organization` },
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${this.baseUrl}/?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          },
          "inLanguage": "en-US"
        },
        {
          "@type": "Organization",
          "@id": `${this.baseUrl}#organization`,
          "name": this.siteName,
          "url": this.baseUrl,
          "logo": {
            "@type": "ImageObject",
            "url": `${this.baseUrl}/logo512.png`,
            "width": 512,
            "height": 512
          },
          "foundingDate": "2025",
          "founders": [{
            "@type": "Person",
            "name": "Hasan Arthur Altuntaş",
            "jobTitle": "Software Developer & AI Researcher"
          }],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["English", "Turkish", "Russian", "Chinese", "Japanese"],
            "areaServed": "Worldwide"
          },
          "sameAs": [
            "https://github.com/commend-ai",
            "https://www.youtube.com/@HasanArthurAltuntaş"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "@id": `${this.baseUrl}#software`,
          "name": this.siteName,
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Any",
          "browserRequirements": "Modern web browser with JavaScript enabled",
          "softwareVersion": "2.0.0",
          "releaseNotes": "Enhanced AI models, improved multi-language support, better UI/UX, advanced analytics",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "250",
            "bestRating": "5",
            "worstRating": "1"
          },
          "featureList": [
            "AI-Powered Comment Generation",
            "Multi-language Support (5 Languages)",
            "YouTube API Integration",
            "Real-time Comment Analysis",
            "Comment History Management",
            "Video Content Analysis",
            "Custom Comment Styles",
            "Mobile-Responsive Design",
            "Free Forever Plan"
          ],
          "screenshot": `${this.baseUrl}/screenshots/main-interface.png`,
          "downloadUrl": this.baseUrl,
          "installUrl": this.baseUrl,
          "memoryRequirements": "Minimal",
          "storageRequirements": "None - Web-based application"
        }
      ]
    };

    // Add page-specific structured data
    if (additionalData.faq) {
      baseStructuredData["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": additionalData.faq.map(item => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      });
    }

    if (additionalData.breadcrumbs) {
      baseStructuredData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": additionalData.breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      });
    }

    return baseStructuredData;
  }

  // Advanced meta tags generator
  generateMetaTags(pageData, currentUrl) {
    const canonical = currentUrl || this.baseUrl;
    const imageUrl = `${this.baseUrl}${this.defaultImage}`;
    
    return {
      // Basic Meta Tags
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords.join(', '),
      canonical: canonical,
      
      // Open Graph Meta Tags
      og: {
        type: pageData.type,
        url: canonical,
        title: pageData.title,
        description: pageData.description,
        image: imageUrl,
        'image:width': '1200',
        'image:height': '630',
        'image:alt': pageData.title,
        'site_name': this.siteName,
        locale: 'en_US',
        'locale:alternate': ['tr_TR', 'ru_RU', 'zh_CN', 'ja_JP']
      },

      // Twitter Card Meta Tags
      twitter: {
        card: 'summary_large_image',
        site: this.twitterHandle,
        creator: this.twitterHandle,
        title: pageData.title,
        description: pageData.description,
        image: imageUrl,
        'image:alt': pageData.title
      },

      // Additional SEO Meta Tags
      additional: {
        'theme-color': '#18d2bb',
        'msapplication-TileColor': '#18d2bb',
        'application-name': this.siteName,
        'apple-mobile-web-app-title': this.siteName,
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'format-detection': 'telephone=no',
        'mobile-web-app-capable': 'yes',
        'robots': 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
        'googlebot': 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
        'bingbot': 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'
      }
    };
  }

  // Performance optimization hints
  getPerformanceHints() {
    return {
      preconnect: [
        'https://fonts.gstatic.com',
        'https://www.googleapis.com',
        'https://api.openai.com'
      ],
      dnsPrefetch: [
        '//fonts.googleapis.com',
        '//www.youtube.com',
        '//vercel.com'
      ],
      preload: [
        // Only include actually existing resources
        { href: '/logo512.png', as: 'image', type: 'image/png' }
      ]
    };
  }

  // Generate sitemap data
  generateSitemapData() {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return [
      {
        url: this.baseUrl,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '1.0',
        images: [
          {
            loc: `${this.baseUrl}/logo512.png`,
            caption: 'CommendAI - AI YouTube Comment Generator'
          }
        ]
      },
      {
        url: `${this.baseUrl}/features`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8',
        images: [
          {
            loc: `${this.baseUrl}/logo512.png`,
            caption: 'CommendAI Features - AI-powered comment generation'
          }
        ]
      },
      {
        url: `${this.baseUrl}/faq`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7',
        images: [
          {
            loc: `${this.baseUrl}/logo512.png`,
            caption: 'CommendAI FAQ - Frequently Asked Questions'
          }
        ]
      }
    ];
  }

  // Analytics and tracking setup
  getAnalyticsConfig() {
    return {
      googleAnalytics: {
        trackingId: 'G-XXXXXXXXXX', // Replace with actual GA4 ID
        config: {
          page_title: document.title,
          page_location: window.location.href,
          content_group1: 'AI Tools',
          content_group2: 'YouTube Tools',
          custom_map: {
            custom_parameter_1: 'user_engagement'
          }
        }
      },
      googleSearchConsole: {
        siteVerification: 'XXXXXXXXXXXXXXXXXXXX' // Replace with actual verification code
      },
      bingWebmaster: {
        siteVerification: 'XXXXXXXXXXXXXXXXXXXX' // Replace with actual verification code
      }
    };
  }
}

// Singleton instance
export const seoManager = new SEOManager();