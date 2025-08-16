/**
 * Professional SEO Component
 * Advanced SEO optimization with performance and analytics integration
 * Author: Hasan Arthur Altuntaş
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { seoManager } from '../../seo/SEOManager';
import { useLanguage } from '../../../contexts/LanguageContext';

const ProfessionalSEO = ({ 
  page = 'home',
  customTitle,
  customDescription,
  customKeywords = [],
  customImage,
  noindex = false,
  nofollow = false,
  canonicalUrl,
  additionalStructuredData = {}
}) => {
  const { currentLanguage } = useLanguage();

  // Get SEO data for the page
  const pageData = seoManager.generateSEOData(page);
  const currentUrl = canonicalUrl || `${seoManager.baseUrl}${window.location.pathname}`;
  
  // Override with custom data if provided
  const finalPageData = {
    ...pageData,
    title: customTitle || pageData.title,
    description: customDescription || pageData.description,
    keywords: [...pageData.keywords, ...customKeywords]
  };

  // Generate all meta tags
  const metaTags = seoManager.generateMetaTags(finalPageData, currentUrl);
  const structuredData = seoManager.generateStructuredData(finalPageData, {
    breadcrumbs: pageData.breadcrumbs,
    ...additionalStructuredData
  });
  const performanceHints = seoManager.getPerformanceHints();

  // Handle robots meta tag
  const robotsContent = noindex || nofollow 
    ? `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`
    : metaTags.additional.robots;

  // Analytics tracking
  useEffect(() => {
    // Track page view for analytics
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX', {
        page_title: finalPageData.title,
        page_location: currentUrl,
        content_group1: 'AI Tools',
        content_group2: 'YouTube Tools'
      });
    }

    // Track user engagement
    const trackEngagement = () => {
      if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
        window.gtag('event', 'page_engagement', {
          engagement_time_msec: 1000,
          page_title: finalPageData.title
        });
      }
    };

    const timer = setTimeout(trackEngagement, 10000); // Track after 10 seconds
    return () => clearTimeout(timer);
  }, [currentUrl, finalPageData.title]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalPageData.title}</title>
      <meta name="description" content={finalPageData.description} />
      <meta name="keywords" content={finalPageData.keywords.join(', ')} />
      <meta name="author" content="Hasan Arthur Altuntaş" />
      <meta name="creator" content="CommendAI Team" />
      <meta name="publisher" content="CommendAI" />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={metaTags.additional.googlebot} />
      <meta name="bingbot" content={metaTags.additional.bingbot} />
      <link rel="canonical" href={currentUrl} />

      {/* Language and Internationalization */}
      <html lang={currentLanguage === 'turkish' ? 'tr' : 'en'} />
      <meta httpEquiv="content-language" content={currentLanguage === 'turkish' ? 'tr-TR' : 'en-US'} />
      <link rel="alternate" hrefLang="en" href={`${seoManager.baseUrl}${window.location.pathname}`} />
      <link rel="alternate" hrefLang="tr" href={`${seoManager.baseUrl}/tr${window.location.pathname}`} />
      <link rel="alternate" hrefLang="x-default" href={`${seoManager.baseUrl}${window.location.pathname}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metaTags.og.type} />
      <meta property="og:url" content={metaTags.og.url} />
      <meta property="og:title" content={metaTags.og.title} />
      <meta property="og:description" content={metaTags.og.description} />
      <meta property="og:image" content={customImage || metaTags.og.image} />
      <meta property="og:image:secure_url" content={customImage || metaTags.og.image} />
      <meta property="og:image:width" content={metaTags.og['image:width']} />
      <meta property="og:image:height" content={metaTags.og['image:height']} />
      <meta property="og:image:alt" content={metaTags.og['image:alt']} />
      <meta property="og:site_name" content={metaTags.og.site_name} />
      <meta property="og:locale" content={metaTags.og.locale} />
      {metaTags.og['locale:alternate'].map((locale, index) => (
        <meta key={index} property="og:locale:alternate" content={locale} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content={metaTags.twitter.card} />
      <meta name="twitter:site" content={metaTags.twitter.site} />
      <meta name="twitter:creator" content={metaTags.twitter.creator} />
      <meta name="twitter:title" content={metaTags.twitter.title} />
      <meta name="twitter:description" content={metaTags.twitter.description} />
      <meta name="twitter:image" content={customImage || metaTags.twitter.image} />
      <meta name="twitter:image:alt" content={metaTags.twitter['image:alt']} />

      {/* Additional Meta Tags for Enhanced SEO */}
      <meta name="theme-color" content={metaTags.additional['theme-color']} />
      <meta name="msapplication-TileColor" content={metaTags.additional['msapplication-TileColor']} />
      <meta name="application-name" content={metaTags.additional['application-name']} />
      <meta name="apple-mobile-web-app-title" content={metaTags.additional['apple-mobile-web-app-title']} />
      <meta name="apple-mobile-web-app-capable" content={metaTags.additional['apple-mobile-web-app-capable']} />
      <meta name="apple-mobile-web-app-status-bar-style" content={metaTags.additional['apple-mobile-web-app-status-bar-style']} />
      <meta name="format-detection" content={metaTags.additional['format-detection']} />
      <meta name="mobile-web-app-capable" content={metaTags.additional['mobile-web-app-capable']} />

      {/* Performance and Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Permissions-Policy" content="geolocation=(), microphone=(), camera=()" />

      {/* DNS Prefetch for Performance */}
      {performanceHints.dnsPrefetch.map((domain, index) => (
        <link key={index} rel="dns-prefetch" href={domain} />
      ))}

      {/* Preconnect for Critical Resources */}
      {performanceHints.preconnect.map((url, index) => (
        <link key={index} rel="preconnect" href={url} crossOrigin="anonymous" />
      ))}

      {/* Preload Critical Resources */}
      {performanceHints.preload.map((resource, index) => (
        <link 
          key={index} 
          rel="preload" 
          href={resource.href} 
          as={resource.as} 
          type={resource.type}
          crossOrigin="anonymous"
        />
      ))}

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData, null, 0)}
      </script>

      {/* Google Analytics 4 */}
      {process.env.REACT_APP_GA_TRACKING_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.REACT_APP_GA_TRACKING_ID}', {
                page_title: '${finalPageData.title}',
                page_location: '${currentUrl}',
                content_group1: 'AI Tools',
                content_group2: 'YouTube Tools',
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </script>
        </>
      )}

      {/* Microsoft Clarity (Alternative to Hotjar) */}
      {process.env.REACT_APP_CLARITY_TRACKING_ID && (
        <script>
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.REACT_APP_CLARITY_TRACKING_ID}");
          `}
        </script>
      )}

      {/* Verification Meta Tags */}
      {process.env.REACT_APP_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.REACT_APP_GOOGLE_SITE_VERIFICATION} />
      )}
      {process.env.REACT_APP_BING_SITE_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.REACT_APP_BING_SITE_VERIFICATION} />
      )}
      {process.env.REACT_APP_YANDEX_VERIFICATION && (
        <meta name="yandex-verification" content={process.env.REACT_APP_YANDEX_VERIFICATION} />
      )}

      {/* Rich Snippets Enhancement */}
      <meta name="rating" content="4.9" />
      <meta name="price" content="Free" />
      <meta name="availability" content="available" />
      
      {/* Performance Monitoring */}
      {process.env.REACT_APP_ENABLE_PERFORMANCE_TRACKING === 'true' && (
        <script>
          {`
            // Performance monitoring
            window.addEventListener('load', function() {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').catch(function() {
                  // Service worker registration failed - ignore silently
                });
              }
              
              // Track Core Web Vitals
              if (typeof window.gtag !== 'undefined') {
                try {
                  const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                      if (entry.entryType === 'largest-contentful-paint') {
                        window.gtag('event', 'LCP', {
                          value: Math.round(entry.startTime),
                          event_category: 'Web Vitals'
                        });
                      }
                    }
                  });
                  observer.observe({entryTypes: ['largest-contentful-paint']});
                } catch (e) {
                  // Performance observation failed - ignore silently
                }
              }
            });
          `}
        </script>
      )}
    </Helmet>
  );
};

export default ProfessionalSEO;