import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/main.css'; // Stil dosyamızı import ediyoruz

function App() {
  // State for the backend connection message
  const [backendMessage, setBackendMessage] = useState("Connecting to backend...");

  // States for our form inputs
  const [videoUrl, setVideoUrl] = useState('');
  const [commentStyle, setCommentStyle] = useState('friendly_peer');

  // State for the generated comment and loading status
  const [generatedComment, setGeneratedComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // useEffect for the initial backend connection test
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/test')
      .then(response => {
        setBackendMessage(response.data.message);
      })
      .catch(error => {
        console.error("Error connecting to backend!", error);
        setBackendMessage("Error: Could not connect to backend.");
      });
  }, []);

  const handleGenerateComment = (e) => {
    e.preventDefault(); 
    setIsLoading(true); // Yükleme durumunu başlat
    setGeneratedComment(''); // Eski yorumu temizle

    // Backend'e POST isteği gönderiyoruz
    axios.post('http://127.0.0.1:5000/api/generate_comment', {
      video_url: videoUrl,
      comment_style: commentStyle
    })
    .then(response => {
      // Başarılı olursa, gelen yorumu state'e kaydet
      setGeneratedComment(response.data.generated_text);
    })
    .catch(error => {
      // Hata olursa, hatayı göster
      console.error("Yorum üretilirken hata oluştu!", error);
      setGeneratedComment("Bir hata oluştu. Lütfen backend terminalini kontrol edin.");
    })
    .finally(() => {
      // Her durumda yükleme durumunu bitir
      setIsLoading(false);
    });
  };

  return (
    <div className="container">
      <header>
        <h1>CommendAI</h1>
        <p className="backend-status">{backendMessage}</p>
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
            <label htmlFor="commentStyle">Comment Style</label>
            <select
              id="commentStyle"
              value={commentStyle}
              onChange={(e) => setCommentStyle(e.target.value)}
            >
              <option value="friendly_peer">Friendly Peer</option>
              <option value="respectful_analyst">Respectful Analyst</option>
              <option value="visionary_fan">Visionary Fan</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Comment'}
          </button>
        </form>

        <div className="result-area">
          <textarea
            value={generatedComment}
            readOnly
            placeholder="Generated comment will appear here..."
          />
        </div>
      </main>
    </div>
  );
}

export default App;