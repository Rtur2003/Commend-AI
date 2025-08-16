import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getActiveAds } from '../services/api';

const AdBanner = ({ position = 'top' }) => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await getActiveAds();
        console.log(`🔍 AdBanner (${position}) - API'dan gelen reklamlar:`, activeAds);
        
        // Filter ads based on exact position match
        const filteredAds = activeAds.filter(ad => ad.position === position);
        
        console.log(`🎯 AdBanner (${position}) - Filtrelenmiş reklamlar:`, filteredAds);
        
        if (filteredAds.length > 0) {
          setAds(filteredAds);
        } else if (activeAds.length === 0) {
          // API'dan hiç reklam gelmiyorsa test reklamları göster
          console.warn(`⚠️ AdBanner (${position}) - API'dan reklam gelmedi, test reklamı gösteriliyor...`);
          const testAds = [
            {
              id: `test-${position}`,
              content: `🧪 Test Reklamı (${position}) - Backend'de henüz aktif reklam yok!<br><small>Admin panelinden reklam ekleyebilirsiniz.</small>`,
              link_url: '/admin',
              position: position
            }
          ];
          setAds(testAds);
        } else {
          setAds([]);
        }
      } catch (error) {
        console.error(`❌ AdBanner (${position}) - Reklam yüklenemedi:`, error);
        console.warn(`🧪 AdBanner (${position}) - Backend bağlanamıyor, test reklamı gösteriliyor...`);
        
        // Backend bağlanamıyorsa test reklamları göster
        const testAds = [
          {
            id: `test-error-${position}`,
            content: `🔌 Test Reklamı (${position}) - Backend bağlantısı yok!<br><small>Geliştirme modunda test reklamı gösteriliyor.</small>`,
            link_url: '#',
            position: position
          }
        ];
        setAds(testAds);
      }
    };

    fetchAds();
  }, [position]);

  // Reklamları döngüsel olarak değiştir
  useEffect(() => {
    if (ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
      }, 5000); // 5 saniyede bir değiştir

      return () => clearInterval(interval);
    }
  }, [ads.length]);

  const handleAdClick = (ad) => {
    if (ad.link_url) {
      window.open(ad.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!ads.length || !isVisible) {
    console.log(`❌ AdBanner (${position}) - Render edilmiyor:`, {ads: ads.length, isVisible});
    return null;
  }

  const currentAd = ads[currentAdIndex];
  console.log(`✅ AdBanner (${position}) - Render ediliyor:`, currentAd);

  return (
    <div 
      style={{
        position: 'fixed',
        left: position === 'sidebar-left' ? '20px' : 'auto',
        right: position === 'sidebar-right' ? '20px' : 'auto', 
        top: '50%',
        transform: 'translateY(-50%)',
        width: '280px',
        height: '400px',
        zIndex: 90
      }}
    >
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '350px',
          background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
          border: '2px solid #18D2BB',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 15px 40px rgba(24, 210, 187, 0.2)',
          position: 'relative',
          color: '#ffffff',
          cursor: currentAd.link_url ? 'pointer' : 'default'
        }}>
          <div 
            key={currentAdIndex}
            onClick={() => handleAdClick(currentAd)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
              fontSize: '16px',
              lineHeight: '1.5',
              opacity: 1,
              transition: 'opacity 0.3s ease'
            }}
            dangerouslySetInnerHTML={{ __html: currentAd.content }}
          />
          
          {/* Reklam göstergesi */}
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '12px',
              color: '#999',
              background: 'rgba(0, 0, 0, 0.5)',
              padding: '4px 8px',
              borderRadius: '8px'
            }}>Reklam</span>
            {ads.length > 1 && (
              <div style={{display: 'flex', gap: '5px'}}>
                {ads.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdIndex(index)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      border: 'none',
                      background: index === currentAdIndex ? '#18D2BB' : 'rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Kapatma butonu */}
          <button 
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '30px',
              height: '30px',
              border: 'none',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.5)',
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(244, 67, 54, 0.8)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.5)'}
          >
            ✕
          </button>
        </div>
      </div>
  );
};

export default AdBanner;