import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// api.js'den tüm admin ve veri fonksiyonlarını import ediyoruz
import { getHistory, getAds, createAd, deleteAd, toggleAdStatus, adminLogin, adminLogout, checkAdminAuth } from '../services/api';
import '../styles/main.css';

// --- GİRİŞ BAŞARILI OLDUĞUNDA GÖSTERİLECEK PANEL ---
const AdminDashboard = ({ history, ads, fetchAdsData, handleLogout }) => {
  const [newAdContent, setNewAdContent] = useState('');
  const [newAdLink, setNewAdLink] = useState('');

  const handleCreateAd = async (e) => {
    e.preventDefault();
    await createAd({ content: newAdContent, link_url: newAdLink });
    setNewAdContent('');
    setNewAdLink('');
    fetchAdsData(); // Listeyi yenile
  };
  
  const handleDeleteAd = async (adId) => {
    if (window.confirm('Bu reklamı silmek istediğinizden emin misiniz?')) {
      await deleteAd(adId);
      fetchAdsData(); // Listeyi yenile
    }
  };

  const handleToggleAd = async (adId) => {
    await toggleAdStatus(adId);
    fetchAdsData(); // Listeyi yenile
  };

  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Admin Dashboard</h2>
      <p>Hoş geldiniz Admin! Buradan uygulamayı yönetebilirsiniz.</p>
      <button onClick={handleLogout} className="post-button" style={{marginBottom: '30px'}}>Çıkış Yap</button>
      <hr />
      <h3>İstatistikler</h3>
      <p>Veritabanındaki Toplam Gönderilmiş Yorum Sayısı: <strong>{history.length}</strong></p>
      <hr />
      <h3>Reklam Yönetimi</h3>
      <form onSubmit={handleCreateAd} className="ad-form">
        <h4>Yeni Reklam Ekle</h4>
        <div className="form-group">
          <label>Reklam İçeriği (HTML/Text)</label>
          <textarea value={newAdContent} onChange={(e) => setNewAdContent(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Reklam Linki (URL)</label>
          <input type="url" value={newAdLink} onChange={(e) => setNewAdLink(e.target.value)} />
        </div>
        <button type="submit">Reklamı Oluştur</button>
      </form>
      <div className="ad-list">
        <h4>Mevcut Reklamlar ({ads.length})</h4>
        {ads.map(ad => (
          <div key={ad.id} className={`ad-item ${ad.is_active ? 'active' : 'inactive'}`}>
            <div className="ad-content" dangerouslySetInnerHTML={{ __html: ad.content }}></div>
            <div className="ad-actions">
              <span className="ad-status">{ad.is_active ? 'Aktif' : 'Pasif'}</span>
              <button onClick={() => handleToggleAd(ad.id)}>Durumu Değiştir</button>
              <button onClick={() => handleDeleteAd(ad.id)} className="delete-button">Sil</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- ANA ADMİN SAYFASI (GİRİŞ MANTIĞINI YÖNETİR) ---
const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [ads, setAds] = useState([]);

  const fetchAllAdminData = async () => {
    try {
        const historyData = await getHistory();
        const adsData = await getAds();
        setHistory(historyData);
        setAds(adsData);
    } catch(e) {
        console.error("Failed to fetch admin data", e);
        setError("Could not load admin data. Your session may have expired. Please log in again.");
        setIsLoggedIn(false); // Oturum geçerli değilse çıkış yap
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await checkAdminAuth();
        if (authStatus.is_admin) {
          setIsLoggedIn(true);
          fetchAllAdminData();
        }
      } catch(e) {
        console.error("Auth check failed", e);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(password);
      setIsLoggedIn(true);
      setError('');
      fetchAllAdminData();
    } catch (err) {
      setError('Geçersiz şifre.');
    }
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsLoggedIn(false);
    setHistory([]);
    setAds([]);
  };

  if (isLoggedIn) {
    return <AdminDashboard history={history} ads={ads} fetchAdsData={() => getAds().then(setAds)} handleLogout={handleLogout} />;
  }

  return (
    <motion.div
      className="login-form"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p className="login-error">{error}</p>}
      </form>
    </motion.div>
  );
};

export default AdminPage;