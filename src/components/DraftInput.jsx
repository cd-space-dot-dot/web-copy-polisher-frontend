// src/components/DraftInput.jsx

import React from "react";

export default function DraftInput({ input, setInput }) {
  return (
    <div>
      <textarea
        className="draft-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Paste your draft copy here... 

For example:
• Headlines: 'Get Our Amazing Product Today!'
• Descriptions: 'Our revolutionary software helps...'
• CTAs: 'Sign up now for free!'
• Trust content: 'Founded in 2020, we serve...'

The more context you provide, the better we can polish your copy!"
        rows={8}
      />
      <div className="character-counter">
        <span>{input.length} characters</span>
        {input.length > 0 && (
          <span className="ready-indicator">
            ✓ Ready to polish
          </span>
        )}
      </div>
    </div>
  );
}