import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const { currentLanguage, availableLanguages, t, changeLanguage } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">{t('siteTitle')}</Link>
        <span className="author-badge">{t('authorBy')}</span>
      </div>
      <nav className="main-nav">
        <Link to="/">{t('homeNav')}</Link>
        <div 
          className={`language-selector ${isDropdownOpen ? 'open' : ''}`}
          ref={dropdownRef}
        >
          <button 
            className="lang-button"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
            aria-label={t('ariaLanguageSelector')}
          >
            {currentLang.flag} {currentLang.name}
          </button>
          <div className="lang-dropdown">
            {availableLanguages.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={currentLanguage === lang.code ? 'active' : ''}
                aria-label={`${t('ariaSwitchTo')} ${lang.name}`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;