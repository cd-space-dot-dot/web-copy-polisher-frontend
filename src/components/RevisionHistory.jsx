// src/components/RevisionHistory.jsx

import React from "react";

export default function RevisionHistory({ history, onRestore }) {
  return (
    <ul className="revision-history">
      {history.map((rev, idx) => (
        <li className="revision-item" key={idx}>
          <div className="revision-content">
            <div className="revision-header">
              <span className="revision-number">Rev {idx + 1}</span>
              <span className="revision-timestamp">{rev.timestamp}</span>
            </div>
            <div className="revision-text">{rev.revisedOutput}</div>
          </div>
          <div className="revision-actions">
            <button className="btn-outline" onClick={() => onRestore(rev)}>
              Restore
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
