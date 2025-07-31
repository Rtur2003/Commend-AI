import React, { useState } from 'react';

const HistoryPanel = ({ history, handleUseHistoryItem }) => {
  const [showHistory, setShowHistory] = useState(false);

  // Gönderilmiş yorumları en üste alacak şekilde sırala
  const sortedHistory = [...history].sort((a, b) => {
    if (a.posted_at && !b.posted_at) return -1;
    if (!a.posted_at && b.posted_at) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="history-panel">
      <button onClick={() => setShowHistory(!showHistory)} className="toggle-history-button">
        {showHistory ? 'Hide History' : 'Show History'} ({history.length})
      </button>
      {showHistory && (
        <div>
          <h3 style={{ marginTop: '20px' }}>Comment History</h3>
          {sortedHistory.length > 0 ? sortedHistory.map(item => (
            <div key={item.id} className="history-item">
              <p>{item.text}</p>
              <div className="history-meta">
                <span>
                  {new Date(item.created_at).toLocaleString()}
                  {item.posted_at && <span className="posted-badge"> ✅ Posted</span>}
                </span>
                <button onClick={() => handleUseHistoryItem(item.text)} className="use-button">Use This</button>
              </div>
            </div>
          )) : <p>No history yet. Post a comment to see it here!</p>}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;