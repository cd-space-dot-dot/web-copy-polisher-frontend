// src/components/RevisedOutput.jsx

import React from "react";

export default function RevisedOutput({ output, analysis, originalInput, metadata, onNewRevision }) {
  return (
    <>
      <h3>✨ Polished Copy</h3>
      <div className="revised-text">{output}</div>
      {/* Optionally render analysis/metadata */}
      {/* <div className="analysis-summary">{JSON.stringify(analysis)}</div> */}
      <div className="action-row">
        <button className="btn-outline" onClick={() => onNewRevision(originalInput)}>
          Edit Original
        </button>
      </div>
    </>
  );
}
