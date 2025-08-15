import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import { generateComment, postCommentToYouTube, getHistory } from '../services/api';
import CommentForm from '../components/CommentForm';
import ResultDisplay from '../components/ResultDisplay';
import HistoryPanel from '../components/HistoryPanel';
import SEOHead from '../components/SEOHead';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';
import { useLanguage } from '../contexts/LanguageContext';

function HomePage() {
  const { currentLanguage, t, getCommentLanguage } = useLanguage();
  
  // --- STATE MANAGEMENT ---
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState(getCommentLanguage(currentLanguage));
  const [generatedComment, setGeneratedComment] = useState('');
  const [currentCommentId, setCurrentCommentId] = useState(null); // Generated comment ID
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(t('statusReady'));
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  
  
  // --- LOGIC / FUNCTIONS ---
  const fetchHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history!", error);
      setError(t('errorHistoryLoad'));
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Interface language değiştiğinde comment dilini güncelle
  useEffect(() => {
    setLanguage(getCommentLanguage(currentLanguage));
    setStatusMessage(t('statusReady'));
  }, [currentLanguage, getCommentLanguage, t]);

  const handleGenerateComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedComment('');
    setStatusMessage(t('statusGenerating'));
    setError(null);

    try {
      const response = await generateComment(videoUrl, language);
      
      // Response'un yapısını kontrol et - string mi object mi?
      if (typeof response === 'string') {
        // Eski format: sadece comment text'i döndürülmüş
        setGeneratedComment(response);
        setCurrentCommentId(null);
        setStatusMessage(t('statusGenerated'));
        return;
      }
      
      // Yeni format: object döndürülmüş
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response format from server');
      }
      
      // Backend'den gelen response'u kontrol et
      if (response.status === 'warning') {
        setStatusMessage(t('errorDuplicateDetected'));
        setError(response.message);
        
        // Yorum generate edilmemişse hiçbir şey yapma
        if (!response.generated_text) {
          return;
        }
      }
      
      const commentText = response.generated_text;
      const commentId = response.comment_id || null;
      
      if (commentText) {
        setGeneratedComment(commentText);
        setCurrentCommentId(commentId);
      }
      
      if (response.status !== 'warning') {
        setStatusMessage(t('statusGenerated'));
      }
    } catch (err) {
      // Hata mesajını kullanıcı dostu şekilde göster
      const errorData = err.response?.data;
      let errorMessage = t('errorUnknown');
      
      if (errorData?.user_friendly && errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.message) {
        errorMessage = `${t('errorConnection')} ${err.message}`;
      }
      
      setError(errorMessage);
      setStatusMessage(t('statusError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!generatedComment.trim()) return;
    setIsPosting(true);
    setStatusMessage(t('statusPosting'));
    setError(null);

    try {
      await postCommentToYouTube(videoUrl, generatedComment, currentCommentId);
      alert(t('successPosted'));
      setStatusMessage(t('statusPosted'));
      setGeneratedComment('');
      setCurrentCommentId(null); // Reset comment ID
      fetchHistory(); // Geçmişi yenile
    } catch (err) {
      // Hata mesajını kullanıcı dostu şekilde göster
      const errorData = err.response?.data;
      let errorMessage = t('errorPostUnknown');
      
      if (errorData?.user_friendly && errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.message) {
        errorMessage = `${t('errorConnection')} ${err.message}`;
      }
      
      setError(errorMessage);
      setStatusMessage(t('statusPostError'));
    } finally {
      setIsPosting(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!generatedComment) return;
    navigator.clipboard.writeText(generatedComment);
    setStatusMessage(t('statusCopied'));
  };

  const handleUseHistoryItem = (text) => {
    setGeneratedComment(text);
    setCurrentCommentId(null); // Clear comment ID when using history
    setStatusMessage(t('statusHistoryLoaded'));
    setError(null);
  };

  // --- RENDER ---
  return (
    <>
      <SEOHead />
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }} // Başlangıç durumu: görünmez ve 20px aşağıda
        animate={{ opacity: 1, y: 0 }}  // Bitiş durumu: görünür ve normal pozisyonunda
        transition={{ duration: 0.6 }}   // Animasyon süresi
        >
      <header>
        <h1>{t('pageTitle')}</h1>
        {!error && <p className="status-message">{statusMessage}</p>}
        {error && (
          <div className="error-message">
            <button 
              onClick={() => setError(null)} 
              className="dismiss"
              aria-label={t('ariaCloseError')}
            >×</button>
            <div>{error}</div>
          </div>
        )}
      </header>
      <AdBanner position="top" />
      <main>
        <CommentForm 
          videoUrl={videoUrl}
          setVideoUrl={setVideoUrl}
          language={language}
          setLanguage={setLanguage}
          handleGenerateComment={handleGenerateComment}
          isLoading={isLoading}
          isPosting={isPosting}
        />

        {generatedComment && (
          <ResultDisplay
            generatedComment={generatedComment}
            handlePostComment={handlePostComment}
            copyToClipboard={copyToClipboard}
            isLoading={isLoading}
            isPosting={isPosting}
          />
        )}
        
        <AdBanner position="bottom" />

        <HistoryPanel 
          history={history}
          handleUseHistoryItem={handleUseHistoryItem}
        />
      </main>
    </motion.div>
    </>
  );
}

export default HomePage;