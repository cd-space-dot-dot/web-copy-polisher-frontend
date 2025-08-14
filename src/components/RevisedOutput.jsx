// src/components/RevisedOutput.jsx

import React, { useState } from "react";

export default function RevisedOutput({ 
  output, 
  analysis, 
  originalInput, 
  metadata, 
  onNewRevision,
  sessionHistoryCount = 0,
  onViewHistory,
  loading = false 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEditOriginal = () => {
    if (onNewRevision) {
      onNewRevision(originalInput);
      
      // Scroll to input area
      setTimeout(() => {
        const inputElement = document.querySelector('.draft-input');
        if (inputElement) {
          inputElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
          inputElement.focus();
        }
      }, 100);
    }
  };

  return (
    <>
      <h3>✨ Polished Writing</h3>
      <div className="revised-text">{output}</div>
      
      {metadata && (
        <div className="revision-metadata">
          <span className="word-count">
            {metadata.wordCount?.original} → {metadata.wordCount?.revised} words
            {metadata.wordCount?.revised < metadata.wordCount?.original && (
              <span className="improvement-indicator"> ✓ Shorter</span>
            )}
          </span>
        </div>
      )}
      
      <div className="action-row">
        <button 
          className="btn-ghost"
          onClick={handleCopy}
          title="Copy polished text to clipboard"
          aria-label="Copy polished text to clipboard"
        >
          {copied ? '✅ Copied!' : '📋 Copy Text'}
        </button>
        
        {sessionHistoryCount > 0 && onViewHistory && (
          <button 
            className="btn-ghost"
            onClick={onViewHistory}
            title={`View session history with ${sessionHistoryCount} versions`}
            aria-label={`View session history with ${sessionHistoryCount} versions`}
          >
            📋 History ({sessionHistoryCount})
          </button>
        )}
        
        <button 
          className="btn-teal" 
          onClick={handleEditOriginal}
          title="Edit the original text input"
          aria-label="Edit the original text input"
        >
          📝 Edit Original
        </button>
      </div>
    </>
  );
}