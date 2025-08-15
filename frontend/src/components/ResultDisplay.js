import React from 'react';

const ResultDisplay = ({
  generatedComment,
  handlePostComment, copyToClipboard,
  isLoading, isPosting
}) => {
  return (
    <div className="result-area">
      <div className="result-area-header">
        <h3>Generated Comment</h3>
        <p className="readonly-notice">Bu yorum AI tarafından oluşturulmuştur ve düzenlenemez.</p>
      </div>
      <textarea
        value={generatedComment}
        placeholder="Generated comment will appear here..."
        readOnly
        className="readonly-textarea"
      />
      <div className="action-buttons">
        <button onClick={handlePostComment} disabled={isPosting || isLoading || !generatedComment} className="post-button">
          {isPosting ? 'Posting...' : 'Post to YouTube'}
        </button>
        <button onClick={copyToClipboard} className="copy-button" disabled={!generatedComment}>Copy Text</button>
      </div>
    </div>
  );
};

export default ResultDisplay;