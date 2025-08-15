import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import { generateComment, postCommentToYouTube, getHistory } from '../services/api';
import CommentForm from '../components/CommentForm';
import ResultDisplay from '../components/ResultDisplay';
import HistoryPanel from '../components/HistoryPanel';
import { motion } from 'framer-motion';
import AdBanner from '../components/AdBanner';  

function HomePage() {
  // --- STATE MANAGEMENT ---
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('Turkish');
  const [generatedComment, setGeneratedComment] = useState('');
  const [originalComment, setOriginalComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to generate a new comment.');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  
  
  // --- LOGIC / FUNCTIONS ---
  const fetchHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history!", error);
      setError("Could not load comment history.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerateComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedComment('');
    setOriginalComment('');
    setStatusMessage('🧠 AI is thinking... Please wait.');
    setError(null);

    try {
      const response = await generateComment(videoUrl, language);
      
      // Backend'den gelen response'u kontrol et
      if (response.status === 'warning') {
        setStatusMessage(`⚠️ ${response.message}`);
        setError(`Bu videoya daha önce yorum gönderilmiş. Yeni yorum oluşturabilirsiniz ancak gönderilemez.`);
        
        // Yorum generate edilmemişse hiçbir şey yapma
        if (!response.generated_text) {
          return;
        }
      }
      
      const commentText = response.generated_text || response;
      setGeneratedComment(commentText);
      setOriginalComment(commentText);
      
      if (response.status !== 'warning') {
        setStatusMessage('✅ Comment generated! You can edit it before posting.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unknown error occurred.";
      setError(errorMessage);
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!generatedComment.trim()) return;
    setIsPosting(true);
    setStatusMessage('🚀 Posting comment to YouTube...');
    setError(null);

    try {
      await postCommentToYouTube(videoUrl, generatedComment);
      alert('Yorum başarıyla gönderildi!');
      setStatusMessage('✅ Comment posted successfully! Ready for the next one.');
      setGeneratedComment('');
      setOriginalComment('');
      fetchHistory(); // Geçmişi yenile
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unknown error occurred.";
      setError(errorMessage);
      setStatusMessage('');
    } finally {
      setIsPosting(false);
    }
  };
  
  const copyToClipboard = () => {
    if (!generatedComment) return;
    navigator.clipboard.writeText(generatedComment);
    setStatusMessage('📋 Copied to clipboard!');
  };

  const handleUseHistoryItem = (text) => {
    setGeneratedComment(text);
    setOriginalComment(text);
    setStatusMessage('📋 Comment loaded from history. You can edit and post.');
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
          <div className="error-box">
            <button onClick={() => setError(null)} className="dismiss">×</button>
            <strong>Error:</strong> {error}
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

        

        {originalComment && (
          <ResultDisplay
            generatedComment={generatedComment}
            setGeneratedComment={setGeneratedComment}
            originalComment={originalComment}
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