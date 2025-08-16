import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import FeaturesPage from './pages/Features/FeaturesPage';
import FAQPage from './pages/FAQ/FAQPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import analytics from './shared/analytics/GoogleAnalytics';
import './styles/main.css';

function App() {
  // Initialize Google Analytics
  useEffect(() => {
    analytics.initGA();
  }, []);

  return (
    <HelmetProvider>
      <LanguageProvider>
        <div className="app-layout">
          <Header />
          <main className="app-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;