import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/main.css';

function App() {
  const [pageLanguage, setPageLanguage] = useState('en');

  return (
    <div className="app-layout">
      <Header pageLanguage={pageLanguage} setPageLanguage={setPageLanguage} />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<HomePage pageLanguage={pageLanguage} />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;