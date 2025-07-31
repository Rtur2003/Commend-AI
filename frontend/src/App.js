import React, { useState, useEffect } from 'react';
import './styles/main.css';
import { generateComment, postCommentToYouTube, getHistory } from './services/api';

// Yükleme animasyonu için basit bir component
const Spinner = () => <div className="spinner"></div>;

function App() {
  // Form girdileri için state'ler
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('Turkish');
  
  // Sonuç ve durumlar için state'ler
  const [generatedComment, setGeneratedComment] = useState('');
  const [originalComment, setOriginalComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to generate a new comment.');
  const [error, setError] = useState(null); // Hata mesajları için yeni state
  
  // Geçmiş paneli için state'ler
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Geçmişi getiren fonksiyon
  const fetchHistory = async () => {
    try {
      const historyData = await getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history!", error);
      setError("Could not load comment history.");
    }
  };

  // Sayfa ilk yüklendiğinde geçmişi çekmek için
  useEffect(() => {
    fetchHistory();
  }, []);

  // Yorum üretme fonksiyonu
  const handleGenerateComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedComment('');
    setOriginalComment('');
    setStatusMessage('🧠 AI is thinking... Please wait.');
    setError(null); // Yeni işlem başlarken eski hatayı temizle

    try {
      const commentText = await generateComment(videoUrl, language);
      setGeneratedComment(commentText);
      setOriginalComment(commentText);
      setStatusMessage('✅ Comment generated! You can edit it before posting.');
      fetchHistory();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unknown error occurred.";
      setError(errorMessage); // Hatayı özel state'e yaz
      setStatusMessage(''); // Durum mesajını temizle
    } finally {
      setIsLoading(false);
    }
  };

  // Yorumu gönderme fonksiyonu
  const handlePostComment = async () => {
    if (!generatedComment.trim()) return;
    setIsPosting(true);
    setStatusMessage('🚀 Posting comment to YouTube...');
    setError(null); // Yeni işlem başlarken eski hatayı temizle

    try {
      await postCommentToYouTube(videoUrl, generatedComment);
      alert('Yorum başarıyla gönderildi!');
      setStatusMessage('✅ Comment posted successfully! Ready for the next one.');
      setGeneratedComment('');
      setOriginalComment('');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An unknown error occurred.";
      setError(errorMessage); // Hatayı özel state'e yaz
      setStatusMessage('');
    } finally {
      setIsPosting(false);
    }
  };
  
  // Yorum metnini panoya kopyalayan fonksiyon
  const copyToClipboard = () => {
    if (!generatedComment) return;
    navigator.clipboard.writeText(generatedComment);
    setStatusMessage('📋 Copied to clipboard!');
  };

  // Geçmişten bir yorumu ana metin kutusuna yükleyen fonksiyon
  const handleUseHistoryItem = (text) => {
    setGeneratedComment(text);
    setOriginalComment(text);
    setStatusMessage('📋 Comment loaded from history. You can edit and post.');
    setError(null);
  };

  return (
    <div className="container">
      <header>
        <h1>CommendAI</h1>
        {/* Hata yoksa durum mesajını göster */}
        {!error && <p className="status-message">{statusMessage}</p>}
        
        {/* Hata varsa, hata kutusunu göster */}
        {error && (
          <div className="error-box">
            <button onClick={() => setError(null)} className="dismiss">&times;</button>
            <strong>Error:</strong> {error}
          </div>
        )}
      </header>

      <main>
        <form onSubmit={handleGenerateComment} className="comment-form">
          <div className="form-group">
            <label htmlFor="videoUrl">YouTube Video URL</label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">Comment Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="Turkish">Türkçe</option>
              <option value="English">English</option>
              <option value="Russian">Русский</option>
              <option value="Chinese">中文</option>
              <option value="Japanese">日本語</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading || isPosting}>
            {isLoading && <Spinner />}
            {isLoading ? 'Generating...' : 'Generate Comment'}
          </button>
        </form>

        {originalComment && (
          <div className="result-area">
            <div className="result-area-header">
              <h3>Generated Comment</h3>
              {generatedComment !== originalComment && (
                <button onClick={() => setGeneratedComment(originalComment)} className="copy-button">Reset to Original</button>
              )}
            </div>
            <textarea
              value={generatedComment}
              onChange={(e) => setGeneratedComment(e.target.value)}
              placeholder="Generated comment will appear here..."
            />
            <div className="action-buttons">
              <button onClick={handlePostComment} disabled={isPosting || isLoading} className="post-button">
                {isPosting ? 'Posting...' : 'Post to YouTube'}
              </button>
              <button onClick={copyToClipboard} className="copy-button">Copy Text</button>
            </div>
          </div>
        )}

        <div className="history-panel">
          <button onClick={() => setShowHistory(!showHistory)} className="toggle-history-button">
            {showHistory ? 'Hide History' : 'Show History'} ({history.length})
          </button>
          {showHistory && (
            <div>
              <h3 style={{marginTop: '20px'}}>Comment History</h3>
              {history.length > 0 ? history.map(item => (
                <div key={item.id} className="history-item">
                  <p>{item.text}</p>
                  <div className="history-meta">
                    <span>
                      {new Date(item.created_at).toLocaleString()}
                      {/* Eğer yorum gönderilmişse bir etiket göster */}
                      {item.posted_at && <span className="posted-badge"> ✅ Posted</span>}
                    </span>
                    <button onClick={() => handleUseHistoryItem(item.text)} className="use-button">Use This</button>
                  </div>
                </div>
              )) : <p>No history yet. Generate a comment to see it here!</p>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;