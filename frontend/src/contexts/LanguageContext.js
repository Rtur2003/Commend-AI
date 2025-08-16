import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../locales/translations';

// Create Language Context
const LanguageContext = createContext();

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  // Default to English, but can be changed by user
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Get translation function
  const t = (key, fallback = key) => {
    return getTranslation(currentLanguage, key) || fallback;
  };
  
  // Available languages
  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];
  
  // Comment language mapping (for AI comment generation)
  const getCommentLanguage = (interfaceLanguage) => {
    const mapping = {
      'en': 'English',
      'tr': 'Turkish',
      'ru': 'Russian',
      'zh': 'Chinese',
      'ja': 'Japanese'
    };
    return mapping[interfaceLanguage] || 'English';
  };
  
  // Change language function
  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('commendai-language', languageCode);
  };
  
  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('commendai-language');
    if (savedLanguage && availableLanguages.find(lang => lang.code === savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.substr(0, 2);
      const supportedLang = availableLanguages.find(lang => lang.code === browserLang);
      if (supportedLang) {
        setCurrentLanguage(browserLang);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // Context value
  const value = {
    currentLanguage,
    availableLanguages,
    t, // Translation function
    changeLanguage,
    getCommentLanguage,
    translations: translations[currentLanguage]
  };
  
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};