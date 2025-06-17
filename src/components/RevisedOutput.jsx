// src/components/RevisedOutput.jsx

import React, { useState } from "react";
import proTipsData from "../data/proTips.json";
import ChangeAnalysis from "./ChangeAnalysis";

export default function RevisedOutput({ 
  output, 
  analysis, 
  originalInput,
  metadata,
  onNewRevision 
}) {
  const [copied, setCopied] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const proTips = proTipsData.pro_tips;
  const currentTip = proTips[currentTipIndex];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleNewRevision = () => {
    if (onNewRevision) {
      onNewRevision(output); // Use current output as new input
    }
  };

  return (
    <div className="revised-output">
      <div className="card-header">
        <h2>✨ Polished Copy</h2>
        {metadata && (
          <div className="revision-metadata">
            <span className="content-type-badge">{metadata.contentType}</span>
            <span className="word-count">
              {metadata.wordCount?.original} → {metadata.wordCount?.revised} words
              {metadata.wordCount?.revised < metadata.wordCount?.original && (
                <span className="improvement-indicator"> ✓ Shorter</span>
              )}
            </span>
          </div>
        )}
      </div>
      
      <div className="revised-text">
        {output}
      </div>

      <div className="card-footer">
        <button 
          className="btn-secondary"
          onClick={handleCopy}
        >
          {copied ? '✅ Copied!' : '📋 Copy Text'}
        </button>
        
        {/* <button 
          className={`btn-outline ${showAnalysis ? 'active' : ''}`}
          onClick={() => setShowAnalysis(!showAnalysis)}
        >
          🔍 {showAnalysis ? 'Hide' : 'Show'} Changes
        </button> */}
        
        <button 
          className="btn-ghost"
          onClick={handleNewRevision}
        >
          🔄 Revise Again
        </button>
      </div>

      {showAnalysis && analysis && (
        <ChangeAnalysis 
          analysis={analysis}
          originalText={originalInput}
          revisedText={output}
        />
      )}
      
      <div className="pro-tip-container">
        {currentTip.snippet} <a 
          href={currentTip.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="tip-source"
        >
          Source
        </a>
        
        <button 
          className="tip-nav-btn"
          onClick={() => setCurrentTipIndex((prev) => 
            prev === 0 ? proTips.length - 1 : prev - 1
          )}
          aria-label="Previous tip"
        >
          ◀
        </button>
        
        <button 
          className="tip-nav-btn"
          onClick={() => setCurrentTipIndex((prev) => 
            (prev + 1) % proTips.length
          )}
          aria-label="Next tip"
        >
          ▶
        </button>
      </div>
    </div>
  );
}