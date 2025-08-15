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
        // Filter ads based on position
        const filteredAds = activeAds.filter(ad => {
          // For mobile positions, show only on mobile devices
          if (ad.position === 'top' || ad.position === 'bottom') {
            return window.innerWidth <= 768 || position === ad.position;
          }
          // For desktop positions, show only on desktop
          if (ad.position === 'left' || ad.position === 'right' || 
              ad.position === 'sidebar-left' || ad.position === 'sidebar-right') {
            return window.innerWidth > 768 || position === ad.position;
          }
          // For fixed positions, show on all devices if position matches
          if (ad.position === 'fixed-top' || ad.position === 'fixed-bottom') {
            return position === ad.position;
          }
          // Default: match exact position
          return ad.position === position;
        });
        setAds(filteredAds);
      } catch (error) {
        console.error('Failed to load ads:', error);
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

  if (!ads.length || !isVisible) return null;

  const currentAd = ads[currentAdIndex];

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