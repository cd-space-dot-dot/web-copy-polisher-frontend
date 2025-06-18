// src/components/SimilaritySlider.jsx

import React from "react";

export default function SimilaritySlider({ value, onChange }) {
  const getSliderLabel = (val) => {
    if (val < 30) return "Conservative changes";
    if (val > 70) return "Creative rewrite";
    return "Moderate improvements";
  };

  const getSliderColor = (val) => {
    if (val < 30) return "var(--success)";
    if (val > 70) return "var(--accent)";
    return "var(--primary)";
  };

  return (
    <div className="similarity-slider-container">
        <label htmlFor="similarity-slider">
          <h3>How much should we change it?</h3>
        </label>
        
        <span className="slider-value" style={{ color: getSliderColor(value) }}>
          {getSliderLabel(value)}
        </span>
      
      <div className="slider-wrapper">
        <span className="slider-label-left">Keep it similar</span>
        <input 
          id="similarity-slider"
          type="range" 
          min="0" 
          max="100" 
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="similarity-slider"
          style={{
            background: `linear-gradient(to right, var(--success) 0%, var(--primary) 50%, var(--accent) 100%)`
          }}
        />
        <span className="slider-label-right">Make it different</span>
      </div>
      
      <div className="slider-description">
        <small>
          {value < 30 && "Minimal changes - fix grammar, improve clarity"}
          {value >= 30 && value <= 70 && "Balanced approach - moderate improvements"}
          {value > 70 && "Bold rewrite - creative and significant changes"}
        </small>
      </div>
    </div>
  );
}