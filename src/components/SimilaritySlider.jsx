// src/components/SimilaritySlider.jsx

import React from "react";

export default function SimilaritySlider({ value, onChange }) {
  return (
    <div className="similarity-slider-container">
      <div className="slider-description">
        <small>How different should it be?</small>
      </div>
      <div className="slider-wrapper">
        <span className="slider-label-left">More similar</span>
        <input
          type="range"
          className="similarity-slider"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          aria-label="Similarity"
        />
        <span className="slider-label-right">More different</span>
      </div>
      <div className="slider-value">
        {value}%
      </div>
    </div>
  );
}
