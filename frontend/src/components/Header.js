import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ pageLanguage, setPageLanguage }) => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  const currentLang = languages.find(lang => lang.code === pageLanguage) || languages[0];

  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">CommendAI</Link>
        <span className="author-badge">by Hasan Arthur Altuntaş</span>
      </div>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <div className="language-selector">
          <button className="lang-button">
            {currentLang.flag} {currentLang.name}
          </button>
          <div className="lang-dropdown">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => setPageLanguage(lang.code)}
                className={pageLanguage === lang.code ? 'active' : ''}
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