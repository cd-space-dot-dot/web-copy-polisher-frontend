import React, { useState } from 'react';

export default function SessionHistory({ history, threadId }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!history || history.length === 0) {
    return null;
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="session-history">
      <div className="session-history-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>📋 Session History ({history.length} {history.length === 1 ? 'revision' : 'revisions'})</h3>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="session-history-content">
          {threadId && (
            <div className="thread-info">
              <small>Thread ID: {threadId}</small>
            </div>
          )}
          
          <div className="history-list">
            {history.map((entry, index) => (
              <div key={index} className="history-entry">
                <div className="history-entry-header">
                  <span className="entry-number">#{index + 1}</span>
                  <span className="entry-time">{formatTime(entry.timestamp)}</span>
                  <span className="entry-type">{entry.requestType}</span>
                </div>
                
                <div className="history-entry-content">
                  <div className="history-input">
                    <strong>Input:</strong>
                    <p>{entry.inputText}</p>
                  </div>
                  
                  <div className="history-output">
                    <strong>Output:</strong>
                    <p>{entry.outputText}</p>
                  </div>
                  
                  <div className="history-meta">
                    <span>Type: {entry.contentType}</span>
                    {entry.socialPlatform && <span>Platform: {entry.socialPlatform}</span>}
                    <span>Similarity: {entry.similarity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style jsx>{`
        .session-history {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }
        
        .session-history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .session-history-header h3 {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }
        
        .toggle-icon {
          color: #666;
          font-size: 0.9rem;
        }
        
        .session-history-content {
          margin-top: 1rem;
        }
        
        .thread-info {
          background: #e9ecef;
          padding: 0.5rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .thread-info small {
          color: #666;
          font-family: monospace;
        }
        
        .history-list {
          max-height: 400px;
          overflow-y: auto;
        }
        
        .history-entry {
          background: white;
          border-radius: 6px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-left: 3px solid #007bff;
        }
        
        .history-entry-header {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }
        
        .entry-number {
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: bold;
        }
        
        .entry-time {
          color: #666;
        }
        
        .entry-type {
          background: #28a745;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          text-transform: capitalize;
        }
        
        .history-entry-content > div {
          margin-bottom: 0.75rem;
        }
        
        .history-input strong,
        .history-output strong {
          display: block;
          color: #333;
          margin-bottom: 0.25rem;
          font-size: 0.9rem;
        }
        
        .history-input p,
        .history-output p {
          margin: 0;
          background: #f8f9fa;
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .history-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .history-entry-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .history-meta {
            flex-direction: column;
            gap: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}