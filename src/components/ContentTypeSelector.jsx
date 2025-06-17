// src/components/ContentTypeSelector.jsx
import React from "react";

export default function ContentTypeSelector({ selectedType, onTypeChange }) {
  return (
    <div className="content-type-selector">
      <label className="radio-group-item">
        <input 
          type="radio" 
          name="contentType" 
          value="headline"
          checked={selectedType === "headline"}
          onChange={(e) => onTypeChange(e.target.value)}
        />
        <strong>Headline</strong>
      </label>

      <label className="radio-group-item">
        <input 
          type="radio" 
          name="contentType" 
          value="social"
          checked={selectedType === "social"}
          onChange={(e) => onTypeChange(e.target.value)}
        />
        <strong>Social Media</strong>
      </label>

      <label className="radio-group-item">
        <input 
          type="radio" 
          name="contentType" 
          value="product"
          checked={selectedType === "product"}
          onChange={(e) => onTypeChange(e.target.value)}
        />
        <strong>Product/Service</strong>
      </label>

      <label className="radio-group-item">
        <input 
          type="radio" 
          name="contentType" 
          value="about"
          checked={selectedType === "about"}
          onChange={(e) => onTypeChange(e.target.value)}
        />
        <strong>About</strong>
      </label>

      <label className="radio-group-item">
        <input 
          type="radio" 
          name="contentType" 
          value="other"
          checked={selectedType === "other"}
          onChange={(e) => onTypeChange(e.target.value)}
        />
        <strong>Other</strong>
      </label>
    </div>
  );
}