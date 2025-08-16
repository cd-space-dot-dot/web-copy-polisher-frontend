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
  const [feedbackGiven, setFeedbackGiven] = useState(false);

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

  const handleFeedback = async (isPositive) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: isPositive ? 'positive' : 'negative',
          output,
          originalInput,
          metadata
        }),
      });
      
      if (response.ok) {
        setFeedbackGiven(true);
        setTimeout(() => setFeedbackGiven(false), 3000);
      }
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  return (
    <>
      <h3>✨ Polished Writing</h3>
      
      <div className="output-container">
        <div className="output-content">
          <div className="revised-text">{output}</div>
          
          <div className="output-bottom-row">
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
            
            <div className="output-actions-inline">
              {!feedbackGiven ? (
                <>
                  <button 
                    className="btn-ghost output-action-btn feedback-btn"
                    onClick={() => handleFeedback(true)}
                    title="This output is good"
                    aria-label="Give positive feedback"
                  >
                    👍
                  </button>
                  <button 
                    className="btn-ghost output-action-btn feedback-btn"
                    onClick={() => handleFeedback(false)}
                    title="This output needs improvement"
                    aria-label="Give negative feedback"
                  >
                    👎
                  </button>
                </>
              ) : (
                <span className="feedback-thanks">Thanks for the feedback!</span>
              )}
              
              <button 
                className="btn-ghost output-action-btn"
                onClick={handleCopy}
                title="Copy polished text to clipboard"
                aria-label="Copy polished text to clipboard"
              >
                {copied ? '✅ Copied!' : '📋 Copy Text'}
              </button>
              
              {sessionHistoryCount > 0 && onViewHistory && (
                <button 
                  className="btn-ghost output-action-btn"
                  onClick={onViewHistory}
                  title={`View session history with ${sessionHistoryCount} versions`}
                  aria-label={`View session history with ${sessionHistoryCount} versions`}
                >
                  📋 History ({sessionHistoryCount})
                </button>
              )}
              
              <button 
                className="btn-teal output-action-btn" 
                onClick={handleEditOriginal}
                title="Edit the original text input"
                aria-label="Edit the original text input"
              >
                📝 Edit Original
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}