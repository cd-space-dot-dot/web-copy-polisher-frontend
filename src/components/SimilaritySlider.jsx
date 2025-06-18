// src/components/SimilaritySlider.jsx

import React from "react";

export default function SimilaritySlider({ value, onChange }) {
  // Label and color logic
  const getSliderLabel = (val) => {
    if (val < 30) return "Conservative changes";
    if (val > 70) return "Creative rewrite";
    return "Moderate improvements";
  };

  const getSliderColor = (val) => {
    if (val < 30) return "var(--success-dark)";
    if (val > 70) return "var(--accent-dark)";
    return "var(--primary-dark)";
  };

  // Descriptive feedback
  const getDescription = (val) => {
    if (val < 30) return "Minimal changes: fix grammar, improve clarity.";
    if (val > 70) return "Bold rewrite: creative and significant changes.";
    return "Balanced: moderate improvements.";
  };

  return (
    <div className="similarity-slider-container">
      <label htmlFor="similarity-slider">
        <h3>How much should we change it?</h3>
      </label>
      <div className="slider-value" style={{ color: getSliderColor(value) }}>
        {getSliderLabel(value)} ({value}%)
      </div>
      <div className="slider-wrapper">
        <span className="slider-label-left">Keep it similar</span>
        <input
          id="similarity-slider"
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="similarity-slider"
          aria-label="Similarity"
        />
        <span className="slider-label-right">Make it different</span>
      </div>
      <div className="slider-description">
        <small>{getDescription(value)}</small>
      </div>
    </div>
  );
}
