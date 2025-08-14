import React, { useState } from 'react';

export default function SessionHistory({ history, threads, currentThreadId, onClearSession, onUseAsOriginal }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!history || history.length === 0) {
    return null;
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Map content type values to their display labels (DRY - matches ContentTypeSelector)
  const getContentTypeLabel = (value) => {
    const typeMap = {
      "webpage": "Web Page",
      "social": "Social Media", 
      "blog": "Blog Post",
      "slack": "Slack",
      "email": "Email",
      "other": "Other"
    };
    return typeMap[value] || value;
  };

  // Map social platform values to their display labels (DRY - matches ChipSelector)
  const getSocialPlatformLabel = (value) => {
    const platformMap = {
      "instagram": "Instagram",
      "linkedin": "LinkedIn",
      "twitter": "X (Twitter)",
      "facebook": "Facebook", 
      "tiktok": "TikTok",
      "youtube-description": "YouTube Description",
      "youtube-comment": "YouTube Comment",
      "threads": "Threads",
      "bluesky": "Bluesky",
      "reddit": "Reddit",
      "product-description": "Product Description"
    };
    return platformMap[value] || value;
  };

  // Build thread structure with proper separation
  const buildThreadStructure = (threads) => {
    if (!threads || threads.length === 0) return [];
    
    return threads.map(thread => {
      const versions = [];
      
      // Add original text as first entry
      versions.push({
        type: 'original',
        content: thread.originalText,
        timestamp: thread.startTime,
        threadId: thread.threadId
      });
      
      // Add polished versions
      thread.versions.forEach((version, index) => {
        versions.push({
          type: 'version',
          versionNumber: index + 1,
          content: version.outputText,
          timestamp: version.timestamp,
          threadId: thread.threadId,
          metadata: {
            contentType: version.contentType,
            socialPlatform: version.socialPlatform,
            similarity: version.similarity
          }
        });
      });
      
      return {
        threadId: thread.threadId,
        originalText: thread.originalText,
        startTime: thread.startTime,
        versions
      };
    });
  };

  const threadStructure = buildThreadStructure(threads);
  const totalVersions = threadStructure.reduce((total, thread) => total + thread.versions.length - 1, 0); // -1 to exclude original

  return (
    <>
      <div className="session-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>📋 Session History ({totalVersions} {totalVersions === 1 ? 'version' : 'versions'} across {threadStructure.length} {threadStructure.length === 1 ? 'thread' : 'threads'})</h3>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="session-content">
          {threadStructure.length > 0 && (
            <div className="thread-info">
              <span>Active Threads: {threadStructure.length}</span>
              {currentThreadId && <span> | Current: {currentThreadId.slice(-8)}</span>}
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
          
          <div className="thread-list">
            {threadStructure.map((thread, threadIndex) => (
              <div key={thread.threadId} className="thread-group">
                <div className="thread-separator">
                  <h4>Thread {threadIndex + 1} - {formatTime(thread.startTime)}</h4>
                  <span className="thread-id">{thread.threadId.slice(-8)}</span>
                </div>
                
                <div className="version-list">
                  {thread.versions.map((version, versionIndex) => {
                    const globalIndex = `${threadIndex}-${versionIndex}`;
                    return (
                      <div key={globalIndex} className={`version-entry ${version.type}`}>
                        <div className="version-header">
                          <div className="version-label">
                            <div className="version-main">
                              <span className={`version-badge ${version.type}`}>
                                {version.type === 'original' ? 'Original' : `Version ${version.versionNumber}`}
                              </span>
                              <span className="version-time">{formatTime(version.timestamp)}</span>
                            </div>
                            {version.metadata && (
                              <div className="version-meta-inline">
                                <span>Type: {getContentTypeLabel(version.metadata.contentType)}</span>
                                {version.metadata.socialPlatform && <span>Platform: {getSocialPlatformLabel(version.metadata.socialPlatform)}</span>}
                                <span>Similarity: {version.metadata.similarity}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="version-content">
                          <div className="version-text-container">
                            <p>{version.content}</p>
                            <div className="version-actions">
                              <button 
                                className="copy-version-btn"
                                onClick={() => handleCopy(version.content, globalIndex)}
                                title="Copy text"
                              >
                                {copiedIndex === globalIndex ? '✅' : '📋'}
                              </button>
                              <button 
                                className="use-as-original-btn"
                                onClick={() => onUseAsOriginal && onUseAsOriginal(version.content)}
                                title="Use as original"
                              >
                                ↗️
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}