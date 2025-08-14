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
          className="btn-secondary"
          onClick={handleCopy}
        >
          {copied ? '✅ Copied!' : '📋 Copy Text'}
        </button>
        
        <button 
          className="btn-outline" 
          onClick={handleEditOriginal}
        >
          📝 Edit Original
        </button>
        
        {sessionHistoryCount > 0 && onViewHistory && (
          <button 
            className="btn-outline"
            onClick={onViewHistory}
          >
            📋 History ({sessionHistoryCount})
          </button>
        )}
      </div>
    </>
  );
}