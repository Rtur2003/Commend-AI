import React from 'react';
import Spinner from './Spinner';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

const CommentForm = ({ 
  videoUrl, setVideoUrl, 
  language, setLanguage, 
  handleGenerateComment, 
  isLoading, isPosting 
}) => {
  const { t } = useLanguage();
  
  return (
    <form onSubmit={handleGenerateComment} className="comment-form">
      <div className="form-group">
        <label htmlFor="videoUrl">{t('formVideoUrl')}</label>
        <input
          type="url"
          id="videoUrl"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={t('formVideoUrlPlaceholder')}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="language">{t('formCommentLanguage')}</label>
        <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="Turkish">{t('languages.Turkish')}</option>
          <option value="English">{t('languages.English')}</option>
          <option value="Russian">{t('languages.Russian')}</option>
          <option value="Chinese">{t('languages.Chinese')}</option>
          <option value="Japanese">{t('languages.Japanese')}</option>
        </select>
      </div>
      
      <motion.button
        type="submit"
        disabled={isLoading || isPosting}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading && <Spinner />}
        {isLoading ? t('formGenerating') : t('formGenerateButton')}
      </motion.button>
    </form>
  );
};

export default CommentForm;