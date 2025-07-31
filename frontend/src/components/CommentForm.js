import React from 'react';
import Spinner from './Spinner';

const CommentForm = ({ 
  videoUrl, setVideoUrl, 
  language, setLanguage, 
  handleGenerateComment, 
  isLoading, isPosting 
}) => {
  return (
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
  );
};

export default CommentForm;