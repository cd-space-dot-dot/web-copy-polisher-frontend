// src/components/SimilaritySlider.jsx

import React from "react";

export default function SimilaritySlider({ value, onChange }) {
  return (
    <div className="similarity-slider-container">
      <div className="slider-wrapper">
        <span className="slider-label-left">Keep Original</span>
        <input
          type="range"
          className="similarity-slider"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          aria-label="Similarity"
        />
        <span className="slider-label-right">Polish More</span>
      </div>
      <div className="slider-value">
        {value}%
      </div>
      <div className="slider-description">
        <small>How much do you want to keep the original tone/style?</small>
      </div>
    </div>
  );
}
