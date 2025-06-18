// src/components/PolishButton.jsx

import React from "react";

export default function PolishButton({ handleSubmit, loading }) {
  return (
    <button
      className="btn-accent"
      onClick={handleSubmit}
      disabled={loading}
      style={{
        fontSize: 'var(--text-lg)',
        padding: 'var(--space-4) var(--space-8)',
        minWidth: '200px'
      }}
    >
      {loading ? (
        <>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Polishing...
        </>
      ) : (
        <>
          ✨ Polish My Copy
        </>
      )}
    </button>
  );
}