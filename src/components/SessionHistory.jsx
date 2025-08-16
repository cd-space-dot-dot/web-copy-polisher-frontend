import React, { useState } from 'react';

export default function SessionHistory({ history, threads, currentThreadId, onClearSession, onUseAsOriginal, hasEverInteracted }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [urlCopied, setUrlCopied] = useState(null); // Store threadId of copied URL
  const [selectedOutputs, setSelectedOutputs] = useState(new Set());
  const [clipboardCopied, setClipboardCopied] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);

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

  const toggleOutputSelection = (globalIndex, text) => {
    const newSelected = new Set(selectedOutputs);
    if (newSelected.has(globalIndex)) {
      newSelected.delete(globalIndex);
    } else {
      // Store both index and text
      newSelected.add(globalIndex);
    }
    setSelectedOutputs(newSelected);
  };

  const copySelectedToClipboard = async () => {
    // Build array of selected texts in order
    const selectedTexts = [];
    threadStructure.forEach((thread, threadIndex) => {
      thread.versions.forEach((version, versionIndex) => {
        const globalIndex = `${threadIndex}-${versionIndex}`;
        if (selectedOutputs.has(globalIndex)) {
          selectedTexts.push(version.content);
        }
      });
    });
    
    if (selectedTexts.length > 0) {
      try {
        // Join with double line break
        const combinedText = selectedTexts.join('\n\n');
        await navigator.clipboard.writeText(combinedText);
        setClipboardCopied(true);
        setTimeout(() => setClipboardCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy selected texts: ', err);
      }
    }
  };

  const handleCopyThreadUrl = async (threadId) => {
    try {
      // Construct URL with specific thread ID
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('thread', threadId);
      await navigator.clipboard.writeText(url.toString());
      setUrlCopied(threadId);
      setTimeout(() => setUrlCopied(null), 2000);
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
        <div className="session-header-content">
          <h3>📋 Session History</h3>
          <h4 className="session-summary">({totalVersions} {totalVersions === 1 ? 'version' : 'versions'} across {threadStructure.length} {threadStructure.length === 1 ? 'thread' : 'threads'})</h4>
        </div>
        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>
      
      {isExpanded && (
        <div className="session-content">
          {threadStructure.length > 0 && (
            <div className="thread-info">
              <div className="thread-info-main">
                <div className="thread-stats">
                  <span className="threads-count">Active Threads: {threadStructure.length}</span>
                  {/* {currentThreadId && <span className="current-thread">Current: {currentThreadId.slice(-8)}</span>} */}
                </div>
              </div>
              <div className="thread-actions">
                <button 
                  className={`btn-outline btn-sm ${multiSelectMode ? 'active' : ''}`}
                  onClick={() => {
                    setMultiSelectMode(!multiSelectMode);
                    if (!multiSelectMode) {
                      setSelectedOutputs(new Set()); // Clear selections when exiting multi-select
                    }
                  }}
                  title={multiSelectMode ? "Exit multi-select mode" : "Enter multi-select mode"}
                  aria-label={multiSelectMode ? "Exit multi-select mode" : "Enter multi-select mode"}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                >
                  {multiSelectMode ? '✕ Exit Multi-Select' : '⊞ Copy Multiple'}
                </button>
                {selectedOutputs.size > 0 && (
                  <button 
                    className="btn-outline btn-sm" 
                    onClick={copySelectedToClipboard}
                    title={`Copy ${selectedOutputs.size} selected items to clipboard`}
                    aria-label="Copy selected items to clipboard"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  >
                    {clipboardCopied ? '✅ Copied!' : `📋 Copy ${selectedOutputs.size} Selected`}
                  </button>
                )}
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
            </div>
          )}
          
          <div className="thread-list">
            {threadStructure.map((thread, threadIndex) => (
              <div key={thread.threadId} className="thread-group">
                <div className="thread-separator">
                  <div className="thread-header">
                    <div className="thread-title-section">
                      <h4>Thread {threadIndex + 1}</h4>
                      {thread.threadSummary && (
                        <span className="thread-summary">{thread.threadSummary}</span>
                      )}
                    </div>
                    <button 
                      className="thread-copy-btn" 
                      onClick={() => handleCopyThreadUrl(thread.threadId)}
                      title="Copy Thread URL"
                      aria-label="Copy Thread URL"
                    >
                      {urlCopied === thread.threadId ? '✅ Copied!' : '🔗 Copy Thread URL'}
                    </button>
                  </div>
                  <div className="thread-metadata">
                    <span className="thread-time">{formatTime(thread.startTime)}</span>
                    {/* <span className="thread-id">{thread.threadId.slice(-8)}</span> */}
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
                              <div className="version-actions">
                                {multiSelectMode && (
                                  <button 
                                    className={`select-version-btn ${selectedOutputs.has(globalIndex) ? 'selected' : ''}`}
                                    onClick={() => toggleOutputSelection(globalIndex, version.content)}
                                    title="Select for multi-copy"
                                    aria-label="Select for multi-copy"
                                  >
                                    {selectedOutputs.has(globalIndex) ? '✓' : '+'}
                                  </button>
                                )}
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
                            {version.metadata && (
                              <div className="version-meta-inline">
                                <span>{getContentTypeLabel(version.metadata.contentType)}</span>
                                {version.metadata.contentType === 'social' && version.metadata.socialPlatform && (
                                  <span className="meta-refined">
                                    {getSocialPlatformLabel(version.metadata.socialPlatform)}
                                    {version.metadata.chipSelections?.single?.['post-count'] && ` x ${version.metadata.chipSelections.single['post-count']}`}
                                  </span>
                                )}
                                <span className="meta-refined">Similarity to Original: {version.metadata.similarity}%</span>
                                {version.metadata.wordCount && (
                                  <span className="word-count-meta meta-refined">
                                    {version.metadata.wordCount.original} → {version.metadata.wordCount.revised} words
                                  </span>
                                )}
                                {version.metadata.chipSelections && formatChipSelections(version.metadata.chipSelections).length > 0 && (
                                  <span className="refined-label">
                                    Refined: {formatChipSelections(version.metadata.chipSelections).map((chip, chipIndex) => (
                                      <span key={chipIndex} className="chip-meta">{chip}{chipIndex < formatChipSelections(version.metadata.chipSelections).length - 1 ? ', ' : ''}</span>
                                    ))}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="version-content">
                          <div className="version-text-container">
                            <p>{version.content}</p>
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