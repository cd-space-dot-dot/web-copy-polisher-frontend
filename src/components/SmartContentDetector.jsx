// src/components/SmartContentDetector.jsx

import React, { useState, useEffect } from "react";

export default function SmartContentDetector({ input, onTypeDetected, currentType }) {
  const [detectedType, setDetectedType] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simple content detection logic (you could replace with AI later)
  const analyzeContent = (text) => {
    if (!text || text.length < 10) return null;

    const lowercaseText = text.toLowerCase();
    const wordCount = text.split(/\s+/).length;
    
    // Detection patterns
    const patterns = {
      social: {
        keywords: ['follow', 'like', 'share', 'hashtag', '#', '@', 'dm', 'story', 'post', 'viral', 'trending'],
        characteristics: () => wordCount < 50,
        confidence: 0
      },
      email: {
        keywords: ['subject', 'dear', 'sincerely', 'regards', 'unsubscribe', 'inbox', 'reply', 'forward'],
        characteristics: () => text.includes('\n\n') || wordCount > 100,
        confidence: 0
      },
      blog: {
        keywords: ['introduction', 'conclusion', 'paragraph', 'section', 'article', 'readers', 'subscribe'],
        characteristics: () => wordCount > 200,
        confidence: 0
      },
      webpage: {
        keywords: ['welcome', 'about us', 'services', 'contact', 'home', 'navigation', 'menu', 'learn more'],
        characteristics: () => wordCount < 150 && wordCount > 20,
        confidence: 0
      }
    };

    // Calculate confidence scores
    Object.keys(patterns).forEach(type => {
      const pattern = patterns[type];
      let score = 0;
      
      // Keyword matching
      const matchedKeywords = pattern.keywords.filter(keyword => 
        lowercaseText.includes(keyword)
      );
      score += matchedKeywords.length * 20;
      
      // Characteristic matching
      if (pattern.characteristics()) {
        score += 30;
      }
      
      // Length-based scoring
      if (type === 'social' && wordCount < 30) score += 25;
      if (type === 'email' && wordCount > 50 && wordCount < 300) score += 25;
      if (type === 'blog' && wordCount > 150) score += 25;
      if (type === 'webpage' && wordCount > 20 && wordCount < 100) score += 25;
      
      pattern.confidence = Math.min(score, 100);
    });

    // Find best match
    const bestMatch = Object.entries(patterns)
      .sort(([,a], [,b]) => b.confidence - a.confidence)[0];
    
    if (bestMatch[1].confidence > 40) {
      return {
        type: bestMatch[0],
        confidence: bestMatch[1].confidence
      };
    }
    
    return null;
  };

  useEffect(() => {
    if (!input || input.length < 10) {
      setDetectedType(null);
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    const timeout = setTimeout(() => {
      const result = analyzeContent(input);
      setDetectedType(result?.type || null);
      setConfidence(result?.confidence || 0);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [input]);

  const handleAcceptSuggestion = () => {
    if (detectedType && onTypeDetected) {
      onTypeDetected(detectedType);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      social: "Social Media",
      email: "Email", 
      blog: "Blog Post",
      webpage: "Web Page",
      other: "Other"
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type) => {
    const icons = {
      social: "📱",
      email: "📧",
      blog: "📝", 
      webpage: "🌐",
      other: "📄"
    };
    return icons[type] || "📄";
  };

  if (!input || input.length < 10) {
    return (
      <div className="smart-detector smart-detector--empty">
        <div className="smart-detector-icon">🤖</div>
        <div className="smart-detector-text">
          <div className="smart-detector-title">AI Content Detection</div>
          <div className="smart-detector-subtitle">Start typing to get smart suggestions...</div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="smart-detector smart-detector--analyzing">
        <div className="smart-detector-icon">
          <div className="analyzing-spinner">🤖</div>
        </div>
        <div className="smart-detector-text">
          <div className="smart-detector-title">Analyzing content...</div>
          <div className="smart-detector-subtitle">Looking for content patterns</div>
        </div>
      </div>
    );
  }

  if (!detectedType || confidence < 40) {
    return (
      <div className="smart-detector smart-detector--uncertain">
        <div className="smart-detector-icon">🤷‍♀️</div>
        <div className="smart-detector-text">
          <div className="smart-detector-title">Hmm, not sure about this one</div>
          <div className="smart-detector-subtitle">Please select manually above</div>
        </div>
      </div>
    );
  }

  const isAlreadySelected = currentType === detectedType;

  return (
    <div className={`smart-detector ${isAlreadySelected ? 'smart-detector--matched' : 'smart-detector--suggestion'}`}>
      <div className="smart-detector-icon">
        {isAlreadySelected ? '✅' : getTypeIcon(detectedType)}
      </div>
      <div className="smart-detector-text">
        <div className="smart-detector-title">
          {isAlreadySelected 
            ? `Perfect! This looks like ${getTypeLabel(detectedType)}`
            : `This looks like: ${getTypeLabel(detectedType)}`
          }
        </div>
        <div className="smart-detector-subtitle">
          {Math.round(confidence)}% confident
        </div>
      </div>
      {!isAlreadySelected && (
        <button 
          className="smart-detector-action"
          onClick={handleAcceptSuggestion}
          type="button"
        >
          Use This
        </button>
      )}
    </div>
  );
}