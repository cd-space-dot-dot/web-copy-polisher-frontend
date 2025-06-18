// src/components/ContentTypeSelector.jsx

import React from "react";

export default function ContentTypeSelector({ selectedType, onTypeChange }) {
  // These are the values you had in your previous version plus the most common ones for web copy.
  const types = [
    { value: "headline", label: "Headline" },
    { value: "social", label: "Social Media" },
    { value: "product", label: "Product/Service" },
    { value: "about", label: "About" },
    { value: "other", label: "Other" },
  ];
  return (
    <div className="radio-group" role="radiogroup" aria-label="Content type">
      {types.map((type) => (
        <label
          key={type.value}
          className={`radio-option${selectedType === type.value ? " selected" : ""}`}
          htmlFor={`type-${type.value}`}
        >
          <input
            type="radio"
            name="content-type"
            id={`type-${type.value}`}
            value={type.value}
            checked={selectedType === type.value}
            onChange={() => onTypeChange(type.value)}
          />
          <span>{type.label}</span>
        </label>
      ))}
    </div>
  );
}
