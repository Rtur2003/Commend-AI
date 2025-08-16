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
    <AnimatePresence>
      <motion.div 
        className={`ad-banner ad-banner-${position}`}
        initial={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: position === 'top' ? -50 : 50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="ad-banner-container">
          <motion.div 
            key={currentAdIndex}
            className={`ad-content ${currentAd.link_url ? 'clickable' : ''}`}
            onClick={() => handleAdClick(currentAd)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            dangerouslySetInnerHTML={{ __html: currentAd.content }}
          />
          
          {/* Reklam göstergesi */}
          <div className="ad-indicators">
            <span className="ad-label">Reklam</span>
            {ads.length > 1 && (
              <div className="ad-dots">
                {ads.map((_, index) => (
                  <button
                    key={index}
                    className={`ad-dot ${index === currentAdIndex ? 'active' : ''}`}
                    onClick={() => setCurrentAdIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Kapatma butonu */}
          <button className="ad-close" onClick={handleClose}>
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdBanner;