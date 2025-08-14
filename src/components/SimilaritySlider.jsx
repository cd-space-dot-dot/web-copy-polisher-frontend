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

  // Calculate dynamic font weights based on slider value
  // Value ranges from 0-100, where 0 = most similar, 100 = most different
  const calculateLeftWeight = (sliderValue) => {
    // "More similar" gets heavier as slider moves left (toward 0)
    // Range: 400 (default) to 600 (bold)
    const weight = 400 + ((100 - sliderValue) / 100) * 200;
    return Math.round(weight);
  };

  const calculateRightWeight = (sliderValue) => {
    // "More different" gets heavier as slider moves right (toward 100)
    // Range: 400 (default) to 600 (bold)
    const weight = 400 + (sliderValue / 100) * 200;
    return Math.round(weight);
  };

  const leftWeight = calculateLeftWeight(value);
  const rightWeight = calculateRightWeight(value);

  return (
    <div className="similarity-slider-container">
      <div className="slider-description">
        <h3>How different should it be?</h3>
      </div>
      <div className="slider-wrapper">
        {!isMobile && (
          <span 
            className="slider-label-left"
            style={{ fontWeight: leftWeight }}
          >
            More similar
          </span>
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
          <span 
            className="slider-label-right"
            style={{ fontWeight: rightWeight }}
          >
            More different
          </span>
        )}
      </div>
      <div className="slider-value">
        {isMobile ? <small>{getSimilarityLabel(value)}</small> : `${value}%`}
      </div>
    </div>
  );
}
