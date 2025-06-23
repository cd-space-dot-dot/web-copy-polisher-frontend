import React, { useState, useEffect } from "react";

function getSimilarityLabel(value) {
  if (value <= 33) return "Very similar";
  if (value <= 66) return "Some changes";
  return "Very different";
}

export default function SimilaritySlider({ value, onChange }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Set initial value and add resize listener
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
        {isMobile ? getSimilarityLabel(value) : `${value}%`}
      </div>
    </div>
  );
}
