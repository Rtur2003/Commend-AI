import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import { generateComment, postCommentToYouTube, getHistory } from '../services/api';
import CommentForm from '../components/CommentForm';
import ResultDisplay from '../components/ResultDisplay';
import HistoryPanel from '../components/HistoryPanel';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';  

function HomePage({ pageLanguage }) {
  // --- STATE MANAGEMENT ---
  const [videoUrl, setVideoUrl] = useState('');
  // Sayfa dili ile yorum dili eşleştirmesi
  const languageMapping = {
    'en': 'English',
    'tr': 'Turkish', 
    'ru': 'Russian',
    'zh': 'Chinese',
    'ja': 'Japanese'
  };
  
  const [language, setLanguage] = useState(languageMapping[pageLanguage] || 'English');
  const [generatedComment, setGeneratedComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Yeni yorum oluşturmaya hazır.');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  
  
  // --- LOGIC / FUNCTIONS ---
  const fetchHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history!", error);
      setError("Yorum geçmişi yüklenemedi.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Sayfa dili değiştiğinde yorum dilini güncelle
  useEffect(() => {
    setLanguage(languageMapping[pageLanguage] || 'English');
  }, [pageLanguage]);

  const handleGenerateComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedComment('');
    setStatusMessage('🧠 AI yorum oluşturuyor... Lütfen bekleyin.');
    setError(null);

    try {
      const response = await generateComment(videoUrl, language);
      
      // Backend'den gelen response'u kontrol et
      if (response.status === 'warning') {
        setStatusMessage('⚠️ Uyarı: Duplicate video tespit edildi');
        setError(response.message);
        
        // Yorum generate edilmemişse hiçbir şey yapma
        if (!response.generated_text) {
          return;
        }
      }
      
      const commentText = response.generated_text || response;
      setGeneratedComment(commentText);
      
      if (response.status !== 'warning') {
        setStatusMessage('✅ Yorum başarıyla oluşturuldu! YouTube\'a gönderebilirsiniz.');
      }
    } catch (err) {
      // Hata mesajını kullanıcı dostu şekilde göster
      const errorData = err.response?.data;
      let errorMessage = "Bilinmeyen bir hata oluştu.";
      
      if (errorData?.user_friendly && errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.message) {
        errorMessage = `Bağlantı hatası: ${err.message}`;
      }
      
      setError(errorMessage);
      setStatusMessage('❌ Yorum oluşturulamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!generatedComment.trim()) return;
    setIsPosting(true);
    setStatusMessage('🚀 Yorum YouTube\'a gönderiliyor...');
    setError(null);

    try {
      await postCommentToYouTube(videoUrl, generatedComment);
      alert('🎉 Yorum başarıyla YouTube\'a gönderildi!');
      setStatusMessage('✅ Yorum gönderildi! Yeni video için hazır.');
      setGeneratedComment('');
      fetchHistory(); // Geçmişi yenile
    } catch (err) {
      // Hata mesajını kullanıcı dostu şekilde göster
      const errorData = err.response?.data;
      let errorMessage = "Yorum gönderilirken bilinmeyen bir hata oluştu.";
      
      if (errorData?.user_friendly && errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (err.message) {
        errorMessage = `Bağlantı hatası: ${err.message}`;
      }
      
      setError(errorMessage);
      setStatusMessage('❌ Yorum gönderilemedi');
    } finally {
      setIsPosting(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!generatedComment) return;
    navigator.clipboard.writeText(generatedComment);
    setStatusMessage('📋 Panoya kopyalandı!');
  };

  const handleUseHistoryItem = (text) => {
    setGeneratedComment(text);
    setStatusMessage('📋 Geçmişten yorum yüklendi. Gönderime hazır.');
    setError(null);
  };

  // --- RENDER ---
  return (
    <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }} // Başlangıç durumu: görünmez ve 20px aşağıda
        animate={{ opacity: 1, y: 0 }}  // Bitiş durumu: görünür ve normal pozisyonunda
        transition={{ duration: 0.6 }}   // Animasyon süresi
        >
      <header>
        <h1>CommendAI</h1>
        {!error && <p className="status-message">{statusMessage}</p>}
        {error && (
          <div className="error-message">
            <button onClick={() => setError(null)} className="dismiss">×</button>
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
  );
}

export default HomePage;