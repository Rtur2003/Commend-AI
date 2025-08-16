import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const ResultDisplay = ({
  generatedComment,
  handlePostComment, copyToClipboard,
  isLoading, isPosting
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="result-area">
      <div className="result-area-header">
        <h3>{t('resultTitle')}</h3>
        <p className="readonly-notice">{t('resultReadonlyNotice')}</p>
      </div>
      <textarea
        value={generatedComment}
        placeholder={t('resultPlaceholder')}
        readOnly
        className="readonly-textarea"
      />
      <div className="action-buttons">
        <button onClick={handlePostComment} disabled={isPosting || isLoading || !generatedComment} className="post-button">
          {isPosting ? t('buttonPosting') : t('buttonPostToYoutube')}
        </button>
        <button onClick={copyToClipboard} className="copy-button" disabled={!generatedComment}>
          {t('buttonCopyText')}
        </button>
      </div>
    </div>
  );
};

export default ResultDisplay;