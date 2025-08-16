import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../../contexts/LanguageContext';

const EnhancedSEOHead = ({ 
  title,
  description,
  keywords = [],
  image = '/logo192.png',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'CommendAI',
  section,
  tags = [],
  noindex = false,
  nofollow = false
}) => {
  const { currentLanguage } = useLanguage();
  // const { t } = useLanguage(); // TODO: Add translations if needed
  
  const defaultTitle = 'CommendAI - AI YouTube Comment Generator | Free Online Tool';
  const defaultDescription = 'Generate engaging YouTube comments with AI. Free, fast, and supports multiple languages. Boost your YouTube engagement with smart comment suggestions.';
  const defaultKeywords = [
    'YouTube comment generator',
    'AI comment generator', 
    'YouTube engagement',
    'social media automation',
    'content creation tools',
    'YouTube marketing',
    'AI writing assistant',
    'comment suggestions',
    'YouTube growth tools',
    'free online tools'
  ];

  const siteUrl = 'https://commend-ai.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullTitle = title ? `${title} | CommendAI` : defaultTitle;
  const fullDescription = description || defaultDescription;
  const fullKeywords = [...defaultKeywords, ...keywords].join(', ');

  // Enhanced structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        "url": siteUrl,
        "name": "CommendAI",
        "description": "AI-powered YouTube comment generator",
        "publisher": {
          "@id": `${siteUrl}#organization`
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": currentLanguage === 'turkish' ? 'tr-TR' : 'en-US'
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}#organization`,
        "name": "CommendAI",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo512.png`,
          "width": 512,
          "height": 512
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "availableLanguage": ["English", "Turkish", "Russian", "Chinese", "Japanese"]
        },
        "sameAs": [
          "https://github.com/commend-ai"
        ]
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}#software`,
        "name": "CommendAI",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "150",
          "bestRating": "5",
          "worstRating": "1"
        },
        "featureList": [
          "AI Comment Generation",
          "Multi-language Support", 
          "YouTube Integration",
          "Real-time Comments",
          "Comment History",
          "Video Analysis",
          "Custom Comment Styles"
        ],
        "screenshot": `${siteUrl}/screenshots/main-interface.png`,
        "softwareVersion": "2.0.0",
        "releaseNotes": "Enhanced AI models, improved multi-language support, better UI/UX"
      },
      {
        "@type": "WebPage",
        "@id": fullUrl,
        "url": fullUrl,
        "name": fullTitle,
        "description": fullDescription,
        "isPartOf": {
          "@id": `${siteUrl}#website`
        },
        "about": {
          "@id": `${siteUrl}#software`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${siteUrl}${image}`,
          "width": 1200,
          "height": 630
        },
        "datePublished": publishedTime,
        "dateModified": modifiedTime || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "@id": `${siteUrl}#organization`
        },
        "inLanguage": currentLanguage === 'turkish' ? 'tr-TR' : 'en-US',
        "potentialAction": {
          "@type": "ReadAction",
          "target": [fullUrl]
        }
      }
    ]
  };

  // Breadcrumb structured data
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      }
    ]
  };

  if (section) {
    breadcrumbData.itemListElement.push({
      "@type": "ListItem", 
      "position": 2,
      "name": section,
      "item": fullUrl
    });
  }

  // FAQ structured data for main page
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is CommendAI?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CommendAI is an AI-powered tool that generates engaging YouTube comments automatically. It analyzes video content and creates relevant, natural-sounding comments to boost engagement."
        }
      },
      {
        "@type": "Question", 
        "name": "Is CommendAI free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, CommendAI is completely free to use. You can generate unlimited comments for any YouTube video without any cost."
        }
      },
      {
        "@type": "Question",
        "name": "What languages does CommendAI support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "CommendAI supports 5 languages: English, Turkish, Russian, Chinese, and Japanese. You can generate comments in any of these languages."
        }
      },
      {
        "@type": "Question",
        "name": "How does the AI comment generation work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our AI analyzes the YouTube video content, title, description, and existing comments to generate contextually relevant and engaging comments that match the video's tone and topic."
        }
      }
    ]
  };

  const robotsContent = noindex || nofollow 
    ? `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`
    : 'index,follow';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Language and Regional */}
      <html lang={currentLanguage === 'turkish' ? 'tr' : 'en'} />
      <meta httpEquiv="content-language" content={currentLanguage === 'turkish' ? 'tr-TR' : 'en-US'} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content="CommendAI" />
      <meta property="og:locale" content={currentLanguage === 'turkish' ? 'tr_TR' : 'en_US'} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:creator" content="@CommendAI" />
      <meta name="twitter:site" content="@CommendAI" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#18d2bb" />
      <meta name="msapplication-TileColor" content="#18d2bb" />
      <meta name="application-name" content="CommendAI" />
      <meta name="apple-mobile-web-app-title" content="CommendAI" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
      {!section && (
        <script type="application/ld+json">
          {JSON.stringify(faqData)}
        </script>
      )}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.youtube.com" />
      <link rel="dns-prefetch" href="//api.openai.com" />
      
      {/* Preconnect for Critical Resources */}
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Performance Hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default EnhancedSEOHead;