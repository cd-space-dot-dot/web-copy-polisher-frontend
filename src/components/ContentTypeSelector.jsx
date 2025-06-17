// src/components/ContentTypeSelector.jsx

import React from "react";

export default function ContentTypeSelector() {
  return (
    <div className="content-type-selector">
      <label className="radio-group-item">
        <input type="radio" name="contentType" value="headline" />
        <strong>Headline</strong>
      </label>

      <label className="radio-group-item">
        <input type="radio" name="contentType" value="cta" />
        <strong>Social Media</strong>
      </label>

      <label className="radio-group-item">
        <input type="radio" name="contentType" value="description" />
        <strong>Product/Service</strong>
      </label>

      <label className="radio-group-item">
        <input type="radio" name="contentType" value="trust" />
        <strong>About</strong>
      </label>

      <label className="radio-group-item">
        <input type="radio" name="contentType" value="other" />
        <strong>Other</strong>
      </label>
    </div>
  );
}