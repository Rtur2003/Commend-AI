import React, { useState, useEffect, useRef } from 'react';
import { getActiveAds } from '../services/api';

const AdBanner = ({ position = 'left' }) => {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showOverflowWarning, setShowOverflowWarning] = useState(false);
  const contentRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const activeAds = await getActiveAds();
        // Filter ads based on exact position match
        const filteredAds = activeAds.filter(ad => ad.position === position);
        
        setAds(filteredAds);
      } catch (error) {
        console.error(`❌ AdBanner (${position}) - Reklam yüklenemedi:`, error);
        setAds([]);
      }
    };

    fetchAds();
  }, [position]);

  // Content overflow detection
  useEffect(() => {
    if (contentRef.current && ads.length > 0) {
      const checkOverflow = () => {
        const element = contentRef.current;
        const container = element.parentElement;
        
        if (!container) return;
        
        const isOverflowing = element.scrollHeight > container.clientHeight || 
                            element.scrollWidth > container.clientWidth;
        
        setShowOverflowWarning(isOverflowing);
        
        if (isOverflowing) {
          console.warn(`⚠️ Ad content overflow detected in ${position} position:`, {
            containerSize: { width: container.clientWidth, height: container.clientHeight },
            contentSize: { width: element.scrollWidth, height: element.scrollHeight }
          });
        }
      };
      
      // Check after content loads
      const timer = setTimeout(checkOverflow, 100);
      return () => clearTimeout(timer);
    }
  }, [currentAdIndex, ads, position]);

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

  // Hide sidebar ads on mobile, only show bottom ads
  if (!ads.length || !isVisible || (isMobile && (position === 'left' || position === 'right'))) {
    return null;
  }

  const currentAd = ads[currentAdIndex];

  // Different styles for different positions
  const getAdStyles = () => {
    if (position === 'bottom') {
      return {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isMobile ? 'calc(100% - 40px)' : '600px',
        maxWidth: '90vw',
        height: '100px',
        zIndex: 90
      };
    }
    
    // Left and Right sidebar ads
    return {
      position: 'fixed',
      left: position === 'left' ? '20px' : 'auto',
      right: position === 'right' ? '20px' : 'auto',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '280px',
      height: '600px',
      zIndex: 90
    };
  };

  const getContainerStyles = () => {
    if (position === 'bottom') {
      return {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, #18D2BB, #14B8A6)',
        borderRadius: '12px',
        padding: '15px 20px',
        boxShadow: '0 8px 25px rgba(24, 210, 187, 0.3)',
        position: 'relative',
        color: '#ffffff',
        cursor: currentAd.link_url ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        overflow: 'hidden' // Prevent content overflow
      };
    }
    
    // Sidebar styles
    return {
      height: '100%',
      width: '100%',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      border: '2px solid #18D2BB',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 15px 40px rgba(24, 210, 187, 0.2)',
      position: 'relative',
      color: '#ffffff',
      cursor: currentAd.link_url ? 'pointer' : 'default',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: 'hidden' // Prevent content overflow
    };
  };

  return (
    <div style={getAdStyles()}>
      <div style={getContainerStyles()}>
        {showOverflowWarning && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            right: '10px',
            background: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '12px',
            textAlign: 'center',
            zIndex: 100,
            fontWeight: 'bold'
          }}>
            ⚠️ Warning: This ad content is not suitable for this site - Content exceeds allowed dimensions
          </div>
        )}
        
        <div 
          ref={contentRef}
          key={currentAdIndex}
          onClick={() => handleAdClick(currentAd)}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: position === 'bottom' ? 'row' : 'column',
            justifyContent: position === 'bottom' ? 'flex-start' : 'center',
            alignItems: position === 'bottom' ? 'center' : 'center',
            textAlign: position === 'bottom' ? 'left' : 'center',
            fontSize: position === 'bottom' ? '14px' : '16px',
            lineHeight: '1.5',
            opacity: showOverflowWarning ? 0.3 : 1,
            transition: 'opacity 0.3s ease',
            gap: position === 'bottom' ? '15px' : '0',
            overflow: 'hidden',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          dangerouslySetInnerHTML={{ __html: currentAd.content }}
        />
        
        {/* Reklam göstergesi */}
        <div style={{
          position: 'absolute',
          bottom: position === 'bottom' ? '8px' : '15px',
          left: position === 'bottom' ? '15px' : '20px',
          right: position === 'bottom' ? '15px' : '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{
            fontSize: position === 'bottom' ? '10px' : '12px',
            color: '#999',
            background: 'rgba(0, 0, 0, 0.5)',
            padding: position === 'bottom' ? '2px 6px' : '4px 8px',
            borderRadius: '6px'
          }}>Reklam</span>
          {ads.length > 1 && (
            <div style={{display: 'flex', gap: '5px'}}>
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAdIndex(index)}
                  style={{
                    width: position === 'bottom' ? '6px' : '8px',
                    height: position === 'bottom' ? '6px' : '8px',
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
            top: position === 'bottom' ? '8px' : '10px',
            right: position === 'bottom' ? '8px' : '10px',
            width: position === 'bottom' ? '24px' : '30px',
            height: position === 'bottom' ? '24px' : '30px',
            border: 'none',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            cursor: 'pointer',
            fontSize: position === 'bottom' ? '12px' : '16px',
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