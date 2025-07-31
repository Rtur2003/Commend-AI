import React from 'react';

const ResultDisplay = ({
  generatedComment, setGeneratedComment,
  originalComment,
  handlePostComment, copyToClipboard,
  isLoading, isPosting
}) => {
  return (
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
  );
};

export default ResultDisplay;