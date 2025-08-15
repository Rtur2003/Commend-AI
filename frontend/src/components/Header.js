import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">CommendAI</Link>
        <span className="author-badge">by Hasan Arthur Altuntaş</span>
      </div>
      <nav className="main-nav">
        <Link to="/">Home</Link>
        {/* Admin linki burada gizli kalacak, ama isterseniz gelecekte giriş yapınca gösterebiliriz */}
      </nav>
    </header>
  );
};

export default Header;