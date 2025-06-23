import React, { useState, useEffect } from "react";

function getSimilarityLabel(value) {
  if (value <= 33) return "Very similar";
  if (value <= 66) return "Some changes";
  return "Very different";
}

export default function SimilaritySlider({ value, onChange }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="similarity-slider-container">
      <div className="slider-description">
        <h3>How different should it be?</h3>
      </div>
      <div className="slider-wrapper">
        {!isMobile && (
          <span className="slider-label-left">More similar</span>
        )}
        <input
          type="range"
          className="similarity-slider"
          min={0}
          max={100}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          aria-label="Similarity"
        />
        {!isMobile && (
          <span className="slider-label-right">More different</span>
        )}
      </div>
      <div className="slider-value">
        {isMobile ? <small>{getSimilarityLabel(value)}</small> : `${value}%`}
      </div>
    </div>
  );
}
