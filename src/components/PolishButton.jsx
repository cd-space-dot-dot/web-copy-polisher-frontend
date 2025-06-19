// src/components/PolishButton.jsx

import React from "react";

export default function PolishButton({ handleSubmit, loading, disabled }) {
  return (
    <button 
      type="button" 
      className="btn-primary"
      onClick={handleSubmit}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading ? "Polishing..." : "Polish My Copy"}
    </button>
  );
}
