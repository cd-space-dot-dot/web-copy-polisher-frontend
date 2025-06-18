// src/components/DraftInput.jsx

import React from "react";

export default function DraftInput({ input, setInput }) {
  return (
    <textarea
      className="draft-input"
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder="Paste or write your copy here..."
      rows={7}
      aria-label="Draft text input"
    />
  );
}
