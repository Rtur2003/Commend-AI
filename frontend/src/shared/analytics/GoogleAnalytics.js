/**
 * Google Analytics 4 Integration
 * Professional analytics tracking for CommendAI
 * Author: Hasan Arthur Altuntaş
 */

// Configuration
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Don't load analytics if no tracking ID is provided
if (!process.env.REACT_APP_GA_TRACKING_ID) {
  console.warn('Google Analytics tracking ID not found. Please add REACT_APP_GA_TRACKING_ID to your environment variables.');
}
const GA_DEBUG_MODE = process.env.NODE_ENV === 'development';

// Initialize Google Analytics
export const initGA = () => {
  // Only load in production or when explicitly enabled
  if (GA_DEBUG_MODE && !process.env.REACT_APP_GA_DEBUG) {
    console.log('Google Analytics disabled in development mode');
    return;
  }

  // Load gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, {
    // Privacy-friendly settings
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    
    // Performance settings
    send_page_view: false, // We'll send manually
    
    // Content grouping
    content_group1: 'AI Tools',
    content_group2: 'YouTube Tools',
    content_group3: 'Free Tools',
    
    // Custom dimensions
    custom_map: {
      custom_parameter_1: 'user_type',
      custom_parameter_2: 'feature_usage',
      custom_parameter_3: 'language_preference'
    }
  });

  console.log('Google Analytics initialized:', GA_TRACKING_ID);
};

// Track page views
export const trackPageView = (url, title, additionalData = {}) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('config', GA_TRACKING_ID, {
    page_title: title,
    page_location: url,
    ...additionalData
  });

  // Also send as event for better tracking
  window.gtag('event', 'page_view', {
    page_title: title,
    page_location: url,
    page_referrer: document.referrer,
    ...additionalData
  });
};

// Track custom events
export const trackEvent = (action, category = 'General', label = '', value = 0, additionalData = {}) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalData
  });
};

// Specific event trackers for CommendAI

// Comment generation tracking
export const trackCommentGeneration = (language, success, videoUrl = '', commentLength = 0) => {
  trackEvent('generate_comment', 'AI_Features', language, commentLength, {
    language: language,
    success: success,
    video_platform: 'youtube',
    comment_length: commentLength,
    has_video_url: !!videoUrl
  });
};

// Comment posting tracking
export const trackCommentPost = (language, success, method = 'manual') => {
  trackEvent('post_comment', 'User_Actions', language, success ? 1 : 0, {
    language: language,
    success: success,
    posting_method: method, // 'manual' or 'direct'
    conversion: success
  });
};

// Feature usage tracking
export const trackFeatureUsage = (feature, action = 'use', additionalData = {}) => {
  trackEvent('feature_usage', 'Features', `${feature}_${action}`, 1, {
    feature_name: feature,
    action_type: action,
    timestamp: new Date().toISOString(),
    ...additionalData
  });
};

// User engagement tracking
export const trackUserEngagement = (engagementType, duration = 0) => {
  trackEvent('user_engagement', 'Engagement', engagementType, duration, {
    engagement_type: engagementType,
    duration_seconds: duration,
    session_id: getSessionId()
  });
};

// Error tracking
export const trackError = (errorType, errorMessage, errorLocation = '') => {
  trackEvent('error', 'Errors', errorType, 0, {
    error_type: errorType,
    error_message: errorMessage,
    error_location: errorLocation,
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });
};

// Performance tracking
export const trackPerformance = (metric, value, additionalData = {}) => {
  trackEvent('performance', 'Web_Vitals', metric, value, {
    metric_name: metric,
    metric_value: value,
    ...additionalData
  });
};

// Language preference tracking
export const trackLanguageChange = (fromLanguage, toLanguage) => {
  trackEvent('language_change', 'Localization', `${fromLanguage}_to_${toLanguage}`, 1, {
    from_language: fromLanguage,
    to_language: toLanguage,
    user_preference: toLanguage
  });
};

// Admin panel tracking
export const trackAdminAction = (action, details = '') => {
  trackEvent('admin_action', 'Admin', action, 1, {
    admin_action: action,
    action_details: details,
    timestamp: new Date().toISOString()
  });
};

// Conversion tracking
export const trackConversion = (conversionType, value = 0) => {
  trackEvent('conversion', 'Conversions', conversionType, value, {
    conversion_type: conversionType,
    conversion_value: value,
    conversion_currency: 'USD' // Even though free, for tracking
  });
};

// Session management
let sessionId = null;
const getSessionId = () => {
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return sessionId;
};

// Enhanced ecommerce tracking (for future monetization)
export const trackPurchase = (transactionId, items = [], value = 0) => {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'USD',
    items: items.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      quantity: item.quantity || 1,
      price: item.price || 0
    }))
  });
};

// Real-time data tracking
export const trackRealTimeData = () => {
  // Track active users and real-time metrics
  if (typeof window.gtag !== 'function') return;

  const startTime = Date.now();
  
  // Track session duration
  const trackSessionDuration = () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    trackUserEngagement('session_duration', duration);
  };

  // Track when user leaves
  window.addEventListener('beforeunload', trackSessionDuration);
  
  // Track engagement every 30 seconds for active users
  let engagementTimer = setInterval(() => {
    trackUserEngagement('active_session', 30);
  }, 30000);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(engagementTimer);
  });
};

// Initialize real-time tracking when analytics loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trackRealTimeData);
} else {
  trackRealTimeData();
}

const analyticsExports = {
  initGA,
  trackPageView,
  trackEvent,
  trackCommentGeneration,
  trackCommentPost,
  trackFeatureUsage,
  trackUserEngagement,
  trackError,
  trackPerformance,
  trackLanguageChange,
  trackAdminAction,
  trackConversion,
  trackPurchase
};

export default analyticsExports;