import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Önceki App.js kodumuz
import AdminPage from './pages/AdminPage'; // Yeni admin sayfamız
import './styles/main.css';

function App() {
  return (
    <div>
      {/* İsteğe bağlı olarak basit bir navigasyon menüsü ekleyebiliriz */}
      <nav className="main-nav">
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;