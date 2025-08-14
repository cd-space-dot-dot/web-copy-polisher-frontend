import React, { useState } from 'react';

export default function SessionHistory({ history, threads, currentThreadId, onClearSession, onUseAsOriginal, hasEverInteracted }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [urlCopied, setUrlCopied] = useState(false);

  // Show placeholder if user has interacted but no history
  if (!history || history.length === 0) {
    if (!hasEverInteracted) {
      return null;
    }
    
    return (
      <>
        <div className="session-header" onClick={() => setIsExpanded(!isExpanded)}>
          <h3>📋 Session History</h3>
          <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
        </div>
        
        {isExpanded && (
          <div className="session-content">
            <div className="history-placeholder">
              <h4>✨ Your session history will appear here</h4>
              <p>After you polish some text, you'll see your original and polished versions here for easy comparison and reuse.</p>
              <div className="placeholder-features">
                <span>📋 Copy any version</span>
                <span>↗️ Use as new original</span>
                <span>🗂️ Organized by threads</span>
              </div>
            </div>
          </div>
        )}
      </>
    );
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

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
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

  // Format chip selections for display
  const formatChipSelections = (chipSelections) => {
    if (!chipSelections) return [];
    const chips = [];
    
    // Add single selections
    if (chipSelections.single) {
      Object.entries(chipSelections.single).forEach(([category, value]) => {
        if (value && category !== 'content-type' && category !== 'social-platform') {
          chips.push(`${category}: ${value}`);
        }
      });
    }
    
    // Add multiple selections (like tone)
    if (chipSelections.multiple) {
      Object.entries(chipSelections.multiple).forEach(([category, values]) => {
        if (values && values.length > 0) {
          chips.push(`${category}: ${values.join(', ')}`);
        }
      });
    }
    
    return chips;
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
            similarity: version.similarity,
            chipSelections: version.chipSelections,
            wordCount: version.wordCount
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
              <div className="thread-info-main">
                <div className="thread-stats">
                  <span className="threads-count">Active Threads: {threadStructure.length}</span>
                  {currentThreadId && <span className="current-thread">Current: {currentThreadId.slice(-8)}</span>}
                </div>
                <button 
                  className="permalink-hint" 
                  onClick={handleCopyUrl}
                  title="Copy session URL to clipboard"
                  aria-label="Copy session URL to clipboard"
                >
                  {urlCopied ? '✅ URL Copied!' : '🔗 Copy Session URL'}
                </button>
              </div>
              {onClearSession && (
                <button 
                  className="btn-outline btn-sm" 
                  onClick={onClearSession}
                  title="Clear all session history and threads"
                  aria-label="Clear all session history and threads"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
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
                  <h4>Thread {threadIndex + 1}</h4>
                  <div className="thread-metadata">
                    <span className="thread-time">{formatTime(thread.startTime)}</span>
                    <span className="thread-id">{thread.threadId.slice(-8)}</span>
                  </div>
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
                                {version.metadata.wordCount && (
                                  <span className="word-count-meta">
                                    {version.metadata.wordCount.original} → {version.metadata.wordCount.revised} words
                                    {version.metadata.wordCount.revised < version.metadata.wordCount.original && (
                                      <span className="improvement-indicator"> ✓ Shorter</span>
                                    )}
                                  </span>
                                )}
                                {version.metadata.chipSelections && formatChipSelections(version.metadata.chipSelections).map((chip, chipIndex) => (
                                  <span key={chipIndex} className="chip-meta">{chip}</span>
                                ))}
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
                                title="Copy text to clipboard"
                                aria-label="Copy text to clipboard"
                              >
                                {copiedIndex === globalIndex ? '✅' : '📋'}
                              </button>
                              <button 
                                className="use-as-original-btn"
                                onClick={() => onUseAsOriginal && onUseAsOriginal(version.content)}
                                title="Use this text as new original input"
                                aria-label="Use this text as new original input"
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