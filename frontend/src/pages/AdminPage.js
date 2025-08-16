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
      
      // Başarı mesajı göster
      setError(''); // Önceki hataları temizle
      alert(editingId ? 'Reklam başarıyla güncellendi!' : 'Yeni reklam başarıyla oluşturuldu!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'İşlem başarısız oldu');
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
    bottom: ads.filter(ad => ad.position === 'bottom'),
    'sidebar-left': ads.filter(ad => ad.position === 'sidebar-left'),
    'sidebar-right': ads.filter(ad => ad.position === 'sidebar-right'),
    'fixed-top': ads.filter(ad => ad.position === 'fixed-top'),
    'fixed-bottom': ads.filter(ad => ad.position === 'fixed-bottom')
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
                    const itemDate = new Date(item.posted_at);
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
          <div style={{
            display: 'block', 
            padding: '30px',
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            border: '1px solid #333',
            margin: '20px 0'
          }}>
            <form 
              onSubmit={handleSubmit}
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #121212, #1a1a1a)',
                padding: '30px',
                borderRadius: '15px',
                border: '1px solid #333',
                marginBottom: '30px'
              }}
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

              <div style={{display: 'grid', gap: '20px', marginBottom: '25px'}}>
                <div style={{marginBottom: '20px'}}>
                  <label style={{color: '#18D2BB', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>🎨 Reklam İçeriği (HTML/Text)</label>
                  <textarea 
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Reklam içeriğinizi buraya yazın..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #333',
                      backgroundColor: '#2a2a2a',
                      color: '#ffffff',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{marginBottom: '20px'}}>
                  <label style={{color: '#18D2BB', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>🔗 Reklam Linki (URL)</label>
                  <input 
                    type="url"
                    name="link_url"
                    value={formData.link_url}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #333',
                      backgroundColor: '#2a2a2a',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{marginBottom: '20px'}}>
                  <label style={{color: '#18D2BB', fontWeight: 'bold', marginBottom: '8px', display: 'block'}}>📍 Pozisyon</label>
                  <select 
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #333',
                      backgroundColor: '#2a2a2a',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                  >
                    <optgroup label="📱 Mobil Pozisyonlar">
                      <option value="top">📱 Üst Kısım (Mobil)</option>
                      <option value="bottom">📱 Alt Kısım (Mobil)</option>
                    </optgroup>
                    <optgroup label="💻 Desktop Pozisyonlar">
                      <option value="left">💻 Sol Taraf (Desktop)</option>
                      <option value="right">💻 Sağ Taraf (Desktop)</option>
                      <option value="sidebar-left">💻 Sol Kenar Çubuğu</option>
                      <option value="sidebar-right">💻 Sağ Kenar Çubuğu</option>
                    </optgroup>
                    <optgroup label="🔥 Sabit Pozisyonlar">
                      <option value="fixed-top">🔥 Sabit Üst (Tüm Cihazlar)</option>
                      <option value="fixed-bottom">🔥 Sabit Alt (Tüm Cihazlar)</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #18D2BB, #20E4C7)',
                  color: '#121212',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  opacity: isLoading ? 0.6 : 1
                }}
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
            </form>

            <div style={{marginTop: '30px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h4 style={{margin: 0, color: '#18D2BB', fontSize: '1.3rem'}}>📋 Mevcut Reklamlar ({ads.length})</h4>
                {ads.length > 0 && (
                  <div style={{display: 'flex', gap: '15px'}}>
                    <span style={{padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(46, 125, 50, 0.2)', color: '#4CAF50'}}>{activeAdsCount} Aktif</span>
                    <span style={{padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: 'rgba(170, 170, 170, 0.2)', color: '#999'}}>{inactiveAdsCount} Pasif</span>
                  </div>
                )}
              </div>
              
              {ads.length === 0 ? (
                <div style={{textAlign: 'center', padding: '60px 20px', color: '#999'}}>
                  <div style={{fontSize: '4rem', marginBottom: '20px', opacity: 0.5}}>📭</div>
                  <h3 style={{margin: '0 0 10px 0', color: '#ffffff'}}>Henüz reklam yok</h3>
                  <p style={{margin: 0, opacity: 0.8}}>İlk reklamınızı oluşturmak için yukarıdaki formu kullanın.</p>
                </div>
              ) : (
                <div style={{display: 'grid', gap: '20px'}}>
                  {Object.entries(adsByPosition).map(([position, positionAds]) => (
                    positionAds.length > 0 && (
                      <div key={position} style={{marginBottom: '30px'}}>
                        <h5 style={{color: '#18D2BB', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                          {position === 'left' && '⬅️ Sol Taraf Reklamları'}
                          {position === 'right' && '➡️ Sağ Taraf Reklamları'}
                          {position === 'top' && '🔼 Üst Reklamlar (Mobile)'}
                          {position === 'bottom' && '🔽 Alt Reklamlar (Mobile)'}
                          {position === 'sidebar-left' && '📋 Sol Kenar Çubuğu'}
                          {position === 'sidebar-right' && '📋 Sağ Kenar Çubuğu'}
                          {position === 'fixed-top' && '🔥 Sabit Üst Reklamlar'}
                          {position === 'fixed-bottom' && '🔥 Sabit Alt Reklamlar'}
                          <span style={{background: '#121212', color: '#999', padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem'}}>({positionAds.length})</span>
                        </h5>
                        {positionAds.map((ad) => (
                          <div 
                            key={ad.id} 
                            style={{
                              background: 'linear-gradient(135deg, #2a2a2a, #333)',
                              borderRadius: '15px',
                              padding: '20px',
                              border: `2px solid ${ad.is_active ? '#4CAF50' : '#999'}`,
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              opacity: ad.is_active ? 1 : 0.7,
                              boxShadow: ad.is_active ? '0 0 20px rgba(46, 125, 50, 0.2)' : 'none'
                            }}
                          >
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
                              <div style={{background: '#121212', color: '#999', padding: '5px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold'}}>#{ad.id}</div>
                              <div style={{
                                padding: '5px 12px', 
                                borderRadius: '20px', 
                                fontSize: '0.8rem', 
                                fontWeight: 'bold',
                                background: ad.is_active ? 'rgba(46, 125, 50, 0.2)' : 'rgba(211, 47, 47, 0.2)',
                                color: ad.is_active ? '#4CAF50' : '#f44336'
                              }}>
                                {ad.is_active ? '🟢 Aktif' : '🔴 Pasif'}
                              </div>
                            </div>
                            
                            <div style={{
                              background: '#121212', 
                              padding: '15px', 
                              borderRadius: '8px', 
                              margin: '15px 0', 
                              border: '1px solid #333',
                              color: '#ffffff'
                            }} dangerouslySetInnerHTML={{ __html: ad.content }} />
                            
                            {ad.link_url && (
                              <div style={{margin: '10px 0', fontSize: '0.9rem', color: '#999'}}>
                                🔗 <a href={ad.link_url} target="_blank" rel="noopener noreferrer" style={{color: '#18D2BB', textDecoration: 'none'}}>
                                  {ad.link_url.length > 40 ? ad.link_url.substring(0, 40) + '...' : ad.link_url}
                                </a>
                              </div>
                            )}
                            
                            <div style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
                              <button 
                                onClick={() => handleEdit(ad)}
                                style={{
                                  background: '#18D2BB',
                                  color: '#121212',
                                  border: 'none',
                                  padding: '10px 15px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  transition: 'all 0.3s ease',
                                  flex: 1
                                }}
                              >
                                ✏️ Düzenle
                              </button>
                              <button 
                                onClick={() => handleToggle(ad.id)}
                                style={{
                                  background: ad.is_active ? 'rgba(211, 47, 47, 0.8)' : 'rgba(46, 125, 50, 0.8)',
                                  color: 'white',
                                  border: 'none',
                                  padding: '10px 15px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  transition: 'all 0.3s ease',
                                  flex: 1
                                }}
                              >
                                {ad.is_active ? '⏸️ Pasif Yap' : '▶️ Aktif Yap'}
                              </button>
                              <button 
                                onClick={() => handleDelete(ad.id)} 
                                style={{
                                  background: '#f44336',
                                  color: 'white',
                                  border: 'none',
                                  padding: '10px 15px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: 'bold',
                                  transition: 'all 0.3s ease',
                                  flex: 1
                                }}
                              >
                                🗑️ Sil
                              </button>
                            </div>
                          </div>
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
      // API response structure ini kontrol et
      if (Array.isArray(adsData)) {
        setAds(adsData);
      } else if (adsData && Array.isArray(adsData.ads)) {
        setAds(adsData.ads);
      } else if (adsData && Array.isArray(adsData.data)) {
        setAds(adsData.data);
      } else {
        setAds([]);
      }
    } catch (e) {
      setAds([]);
      setError("Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.");
    }
  };  
  const fetchAllAdminData = async () => {
    try {
      const [historyData, adsData] = await Promise.all([
        getHistory(),
        getAds()
      ]);
      
      setHistory(historyData || []);
      
      // API response structure ini kontrol et (ads için)
      if (Array.isArray(adsData)) {
        setAds(adsData);
      } else if (adsData && Array.isArray(adsData.ads)) {
        setAds(adsData.ads);
      } else if (adsData && Array.isArray(adsData.data)) {
        setAds(adsData.data);
      } else {
        setAds([]);
      }
    } catch(e) {
      setHistory([]);
      setAds([]);
      setError("Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.");
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
        // Auth check failed silently
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
      setError('Giriş başarısız. Lütfen şifrenizi kontrol edin.');
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