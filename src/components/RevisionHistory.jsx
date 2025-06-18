// src/components/RevisionHistory.jsx

import React, { useState } from "react";

export default function RevisionHistory({ history, onRestore }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <div className="revision-history-empty">
        <div className="revision-history-empty-icon">📝</div>
        <p>Your revision history will appear here</p>
        <small>Each time you polish your copy, we'll save it here for easy access</small>
      </div>
    );
  }

  return (
    <ul className="revision-history">
      {history.map((revision, index) => (
        <li key={revision.id || index} className="revision-item">
          <div className="revision-content">
            <div className="revision-header">
              <span className="revision-number">
                Rev {history.length - index}
              </span>
              <span className="revision-timestamp">
                {formatTimestamp(revision.timestamp)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className="revision-type-badge">
                {revision.contentType}
              </span>
              <span className="similarity-badge">
                Similarity: {revision.similarity}%
              </span>
            </div>
            <div className="revision-text">
              {revision.revisedOutput}
            </div>
            {revision.analysis?.changes && revision.analysis.changes.length > 0 && (
              <div className="revision-changes-summary">
                <strong>Changes made:</strong> {revision.analysis.changes.map(c => c.type).join(', ')}
              </div>
            )}
          </div>
          <div className="revision-actions">
            <button
              className="btn-outline"
              onClick={() => handleCopy(revision.revisedOutput, revision.id)}
            >
              {copiedId === revision.id ? '✅ Copied' : '📋 Copy'}
            </button>
            <button
              className="btn-secondary"
              onClick={() => onRestore && onRestore(revision)}
            >
              🔄 Restore
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
