import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHistory, getAds, createAd, deleteAd, toggleAdStatus, updateAd, adminLogin, adminLogout, checkAdminAuth } from '../services/api';
import '../styles/main.css';

const AdminDashboard = ({ history, ads, fetchAdsData, handleLogout }) => {
  const [formData, setFormData] = useState({
    content: '',
    link_url: '',
    position: 'left'
  });
  const [activeTab, setActiveTab] = useState('stats');
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingId) {
        await updateAd(editingId, formData);
      } else {
        await createAd(formData);
      }
      resetForm();
      await fetchAdsData();
    } catch (err) {
      setError(err.message || 'İşlem başarısız oldu');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ content: '', link_url: '', position: 'left' });
    setEditingId(null);
    setError('');
  };

  const handleEdit = (ad) => {
    setFormData({
      content: ad.content,
      link_url: ad.link_url || '',
      position: ad.position || 'left'
    });
    setEditingId(ad.id);
    setActiveTab('ads'); // Otomatik olarak reklam sekmesine geçiş yapar
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu reklamı silmek istediğinize emin misiniz?')) {
      try {
        await deleteAd(id);
        await fetchAdsData();
      } catch (err) {
        setError('Silme işlemi başarısız oldu');
      }
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleAdStatus(id);
      await fetchAdsData();
    } catch (err) {
      setError('Durum değiştirilemedi');
    }
  };

  const activeAdsCount = ads.filter(ad => ad.is_active).length;
  const inactiveAdsCount = ads.filter(ad => !ad.is_active).length;

  const adsByPosition = {
    left: ads.filter(ad => ad.position === 'left'),
    right: ads.filter(ad => ad.position === 'right'),
    top: ads.filter(ad => ad.position === 'top'),
    bottom: ads.filter(ad => ad.position === 'bottom')
  };
  return (
    <motion.div
      className="admin-dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-header">
        <div className="admin-title">
          <h2>🛠️ Admin Dashboard</h2>
          <p className="welcome-text">Hoş geldiniz Admin! Uygulamayı buradan yönetebilirsiniz.</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <span>🚪</span> Çıkış Yap
        </button>
      </div>

      <div className="stats-grid">
        {[
          { icon: '📊', value: history.length, label: 'Toplam Yorum' },
          { icon: '📢', value: ads.length, label: 'Toplam Reklam' },
          { icon: '✅', value: activeAdsCount, label: 'Aktif Reklam', active: true },
          { icon: '⏸️', value: inactiveAdsCount, label: 'Pasif Reklam', inactive: true }
        ].map((stat, index) => (
          <motion.div 
            key={stat.label}
            className={`stat-card ${stat.active ? 'active' : ''} ${stat.inactive ? 'inactive' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 İstatistikler
        </button>
        <button 
          className={`tab-button ${activeTab === 'ads' ? 'active' : ''}`}
          onClick={() => setActiveTab('ads')}
        >
          📢 Reklam Yönetimi
        </button>
      </div>

      <motion.div 
        className="tab-content"
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'stats' && (
          <div className="stats-section">
            <h3>📈 Detaylı İstatistikler</h3>
            <div className="stats-details">
              <div className="stats-item">
                <span className="stats-label">Veritabanındaki Toplam Yorum:</span>
                <span className="stats-value">{history.length}</span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Son 24 Saatteki Yorumlar:</span>
                <span className="stats-value">
                  {history.filter(item => {
                    const itemDate = new Date(item.created_at);
                    const now = new Date();
                    return (now - itemDate) <= (24 * 60 * 60 * 1000);
                  }).length}
                </span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Aktif Reklam Oranı:</span>
                <span className="stats-value">
                  {ads.length > 0 ? Math.round((activeAdsCount / ads.length) * 100) : 0}%
                </span>
              </div>
              <div className="stats-item">
                <span className="stats-label">Reklam Dağılımı:</span>
                <div className="position-stats">
                  {Object.entries(adsByPosition).map(([position, ads]) => (
                    <div key={position} className="position-stat">
                      <span className="position-label">{position}:</span>
                      <span className="position-value">{ads.length} ({ads.filter(a => a.is_active).length} aktif)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          <div className="ads-section">
            <motion.form 
              onSubmit={handleSubmit}
              className="ad-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="form-header">
                <h4>{editingId ? `✏️ Reklam #${editingId} Düzenleniyor` : '➕ Yeni Reklam Ekle'}</h4>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="cancel-button"
                  >
                    İptal
                  </button>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>🎨 Reklam İçeriği (HTML/Text)</label>
                  <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Reklam içeriğinizi buraya yazın..."
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>🔗 Reklam Linki (URL)</label>
                  <input 
                    type="url"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="form-group">
                  <label>📍 Pozisyon</label>
                  <select 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="position-select"
                  >
                    <option value="left">Sol Taraf (Desktop)</option>
                    <option value="right">Sağ Taraf (Desktop)</option>
                    <option value="top">Üst Kısım (Mobile)</option>
                    <option value="bottom">Alt Kısım (Mobile)</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                className="create-ad-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    {editingId ? 'Güncelleniyor...' : 'Oluşturuluyor...'}
                  </>
                ) : (
                  editingId ? '💾 Değişiklikleri Kaydet' : '✨ Reklamı Oluştur'
                )}
              </button>
            </motion.form>

            <div className="ad-list">
              <div className="section-header">
                <h4>📋 Mevcut Reklamlar ({ads.length})</h4>
                {ads.length > 0 && (
                  <div className="quick-stats">
                    <span className="quick-stat active">{activeAdsCount} Aktif</span>
                    <span className="quick-stat inactive">{inactiveAdsCount} Pasif</span>
                  </div>
                )}
              </div>
              
              {ads.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>Henüz reklam yok</h3>
                  <p>İlk reklamınızı oluşturmak için yukarıdaki formu kullanın.</p>
                </div>
              ) : (
                <div className="ads-grid">
                  {Object.entries(adsByPosition).map(([position, positionAds]) => (
                    positionAds.length > 0 && (
                      <div key={position} className="position-group">
                        <h5 className="position-title">
                          {position === 'left' && '⬅️ Sol Taraf Reklamları'}
                          {position === 'right' && '➡️ Sağ Taraf Reklamları'}
                          {position === 'top' && '🔼 Üst Reklamlar (Mobile)'}
                          {position === 'bottom' && '🔽 Alt Reklamlar (Mobile)'}
                          <span className="position-count">({positionAds.length})</span>
                        </h5>
                        {positionAds.map((ad) => (
                          <motion.div 
                            key={ad.id} 
                            className={`ad-item ${ad.is_active ? 'active' : 'inactive'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="ad-header">
                              <div className="ad-id">#{ad.id}</div>
                              <div className={`ad-status-badge ${ad.is_active ? 'active' : 'inactive'}`}>
                                {ad.is_active ? '🟢 Aktif' : '🔴 Pasif'}
                              </div>
                            </div>
                            
                            <div className="ad-content" dangerouslySetInnerHTML={{ __html: ad.content }} />
                            
                            {ad.link_url && (
                              <div className="ad-link">
                                🔗 <a href={ad.link_url} target="_blank" rel="noopener noreferrer">
                                  {ad.link_url.length > 40 ? ad.link_url.substring(0, 40) + '...' : ad.link_url}
                                </a>
                              </div>
                            )}
                            
                            <div className="ad-actions">
                              <button 
                                onClick={() => handleEdit(ad)}
                                className="edit-button"
                              >
                                ✏️ Düzenle
                              </button>
                              <button 
                                onClick={() => handleToggle(ad.id)}
                                className={`toggle-button ${ad.is_active ? 'active' : 'inactive'}`}
                              >
                                {ad.is_active ? '⏸️ Pasif Yap' : '▶️ Aktif Yap'}
                              </button>
                              <button 
                                onClick={() => handleDelete(ad.id)} 
                                className="delete-button"
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [ads, setAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const fetchAdsOnly = async () => {
    try {
      const adsData = await getAds();
      setAds(adsData); // Artık 'setAds' fonksiyonuna erişebilir
    } catch (e) {
      console.error("Reklamlar yüklenemedi:", e);
      setError("Reklamlar yüklenirken bir hata oluştu."); // 'setError' fonksiyonuna da erişebilir
    }
  };  
  const fetchAllAdminData = async () => {
    try {
      const [historyData, adsData] = await Promise.all([
        getHistory(),
        getAds()
      ]);
      setHistory(historyData);
      setAds(adsData);
    } catch(e) {
      console.error("Yönetici verileri yüklenemedi:", e);
      setError("Veriler yüklenirken hata oluştu. Lütfen tekrar deneyin.");
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const authStatus = await checkAdminAuth();
        if (authStatus.is_admin) {
          setIsLoggedIn(true);
          await fetchAllAdminData();
        }
      } catch(e) {
        console.error("Yetki kontrolü başarısız:", e);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuthStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await adminLogin(password);
      setIsLoggedIn(true);
      await fetchAllAdminData();
    } catch (err) {
      setError('Geçersiz şifre. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await adminLogout();
    } finally {
      setIsLoggedIn(false);
      setHistory([]);
      setAds([]);
    }
  };

  if (!authChecked) {
    return (
      <div className="loading-fullscreen">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (isLoggedIn) {
   return (
    <AdminDashboard 
      history={history} 
      ads={ads} 
      fetchAdsData={fetchAdsOnly} // <-- Artık doğru ve daha verimli
      handleLogout={handleLogout} 
    />
  );
  }

  return (
    <div className="login-container">
      <motion.div
        className="login-form"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="login-header">
          <h2>🔐 Admin Girişi</h2>
          <p>Yönetim paneline erişmek için şifrenizi girin</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="password">🔑 Şifre</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Admin şifrenizi girin..."
              required 
            />
          </div>
          <button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Giriş Yapılıyor...
              </>
            ) : (
              '🚀 Giriş Yap'
            )}
          </button>
          {error && (
            <motion.p 
              className="login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ❌ {error}
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default AdminPage;