import React from 'react';
import Spinner from './Spinner';
import { motion } from 'framer-motion'; // Framer Motion import edildi

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
      
      {/* Button etiketi motion.button olarak değiştirildi ve animasyon eklendi */}
      <motion.button
        type="submit"
        disabled={isLoading || isPosting}
        whileHover={{ scale: 1.03 }} // Üzerine gelince %3 büyür
        whileTap={{ scale: 0.98 }}   // Tıklanınca %2 küçülür
      >
        {isLoading && <Spinner />}
        {isLoading ? 'Generating...' : 'Generate Comment'}
      </motion.button>
    </form>
  );
};

export default CommentForm;