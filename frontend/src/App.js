import React, { useState } from 'react';
import axios from 'axios';
import './styles/main.css';

// Yükleme animasyonu için basit bir component
const Spinner = () => <div className="spinner"></div>;

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [language, setLanguage] = useState('Turkish');
  const [generatedComment, setGeneratedComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Ready to generate a new comment.');

  const handleGenerateComment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedComment('');
    setStatusMessage('🧠 AI is thinking... Please wait.');

    axios.post('http://127.0.0.1:5000/api/generate_comment', {
      video_url: videoUrl,
      language: language,
      comment_style: 'default' // Şimdilik stil sabit
    })
    .then(response => {
      setGeneratedComment(response.data.generated_text);
      setStatusMessage('✅ Comment generated! You can edit it before posting.');
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      setStatusMessage(`❌ Error: ${errorMessage}`);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const handlePostComment = () => {
    if (!generatedComment.trim()) {
      alert("Cannot post an empty comment!");
      return;
    }
    setIsPosting(true);
    setStatusMessage('🚀 Posting comment to YouTube...');

    axios.post('http://127.0.0.1:5000/api/post_comment', {
      video_url: videoUrl,
      comment_text: generatedComment
    })
    .then(response => {
      alert('Yorum başarıyla gönderildi!');
      setStatusMessage('✅ Comment posted successfully! Ready for the next one.');
      setGeneratedComment('');
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      alert(`Error: Could not post comment! ${errorMessage}`);
      setStatusMessage(`❌ Failed to post comment. Please check the backend console.`);
    })
    .finally(() => {
      setIsPosting(false);
    });
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedComment);
    setStatusMessage('📋 Copied to clipboard!');
  };

  return (
    <div className="container">
      <header>
        <h1>CommendAI</h1>
        <p className="status-message">{statusMessage}</p>
      </header>

      <main>
        <form onSubmit={handleGenerateComment} className="comment-form">
          <div className="form-group">
            <label htmlFor="videoUrl">YouTube Video URL</label>
            <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required />
          </div>
          <div className="form-group">
            <label htmlFor="language">Comment Language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="Turkish">Türkçe</option>
              <option value="English">English</option>
              <option value="Russian">Русский</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading || isPosting}>
            {isLoading && <Spinner />}
            {isLoading ? 'Generating...' : 'Generate Comment'}
          </button>
        </form>

        {generatedComment && (
          <div className="result-area">
            <div className="result-area-header">
              <h3>Generated Comment</h3>
            </div>
            <textarea value={generatedComment} onChange={(e) => setGeneratedComment(e.target.value)} />
            <div className="action-buttons">
              <button onClick={handlePostComment} disabled={isPosting || isLoading} className="post-button">
                {isPosting ? 'Posting...' : 'Post to YouTube'}
              </button>
              <button onClick={copyToClipboard} className="copy-button">Copy Text</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;