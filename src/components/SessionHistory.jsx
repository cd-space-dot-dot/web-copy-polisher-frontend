import React, { useState } from 'react';

export default function SessionHistory({ history, threadId, onClearSession }) {
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

  // Build version structure - original input + progressive outputs
  const buildVersions = (history) => {
    if (history.length === 0) return [];
    
    const versions = [];
    const originalInput = history[0].inputText;
    
    // Add original version
    versions.push({
      type: 'original',
      content: originalInput,
      timestamp: history[0].timestamp,
      metadata: {
        contentType: history[0].contentType,
        socialPlatform: history[0].socialPlatform,
        similarity: history[0].similarity
      }
    });
    
    // Add each output version
    history.forEach((entry, index) => {
      versions.push({
        type: 'version',
        versionNumber: index + 1,
        content: entry.outputText,
        timestamp: entry.timestamp,
        requestType: entry.requestType,
        metadata: {
          contentType: entry.contentType,
          socialPlatform: entry.socialPlatform,
          similarity: entry.similarity
        }
      });
    });
    
    return versions;
  };

  const versions = buildVersions(history);

  return (
    <>
      <div className="session-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>📋 Session History ({history.length} {history.length === 1 ? 'version' : 'versions'})</h3>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="session-content">
          {threadId && (
            <div className="thread-info">
              <span>Thread ID: {threadId}</span>
              {onClearSession && (
                <button 
                  className="btn-outline btn-sm" 
                  onClick={onClearSession}
                  style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  🗑️ Clear Session
                </button>
              )}
            </div>
          )}
          
          <div className="version-list">
            {versions.map((version, index) => (
              <div key={index} className={`version-entry ${version.type}`}>
                <div className="version-header">
                  {version.type === 'original' ? (
                    <div className="version-label">
                      <span className="version-badge original">Original</span>
                      <span className="version-time">{formatTime(version.timestamp)}</span>
                    </div>
                  ) : (
                    <div className="version-label">
                      <span className="version-badge version">Version {version.versionNumber}</span>
                      <span className="version-time">{formatTime(version.timestamp)}</span>
                      <span className="request-type">
                        {version.requestType === 'initial' ? 'First submission' : 'Refinement'}
                        {version.requestType !== 'initial' && version.versionNumber > 1 && (
                          <span className="refinement-note">from v{version.versionNumber - 1}</span>
                        )}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="version-content">
                  <p>{version.content}</p>
                </div>
                
                <div className="version-meta">
                  <span>Type: {version.metadata.contentType}</span>
                  {version.metadata.socialPlatform && <span>Platform: {version.metadata.socialPlatform}</span>}
                  <span>Similarity: {version.metadata.similarity}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}