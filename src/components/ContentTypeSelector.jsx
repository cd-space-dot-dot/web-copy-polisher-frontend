// src/components/ContentTypeSelector.jsx

import React from "react";

export default function ContentTypeSelector({ selectedType, onTypeChange }) {
  const types = [
    { value: "webpage", label: "Web Page" },
    { value: "blog", label: "Blog Post" },
    { value: "email", label: "Email" },
    { value: "other", label: "Other" },
  ];
  return (
    <div className="radio-group" role="radiogroup" aria-label="Content type">
      {types.map((type) => (
        <label key={type.value} className={`radio-option${selectedType === type.value ? ' selected' : ''}`}>
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
