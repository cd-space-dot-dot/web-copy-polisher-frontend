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
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        padding: 'var(--space-8)'
      }}>
        <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>
          📝
        </div>
        <p>Your revision history will appear here</p>
        <small>Each time you polish your copy, we'll save it here for easy access</small>
      </div>
    );
  }

  return (
    <div className="revision-history">
      {history.map((revision, index) => (
        <div key={revision.id || index} className="revision-item">
          <div className="revision-content">
            <div className="revision-header">
              <div className="revision-number">
                Revision #{history.length - index}
              </div>
              <div className="revision-timestamp">
                {formatTimestamp(revision.timestamp)}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <span className="revision-type-badge">
                {revision.contentType}
              </span>
              <span style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-ui)'
              }}>
                Similarity: {revision.similarity}%
              </span>
            </div>
            
            <div className="revision-text">
              "{revision.revisedOutput}"
            </div>

            {revision.analysis?.changes && revision.analysis.changes.length > 0 && (
              <div style={{ 
                marginTop: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)'
              }}>
                <strong>Changes made:</strong> {revision.analysis.changes.map(c => c.type).join(', ')}
              </div>
            )}
          </div>
          
          <div className="revision-actions">
            <button 
              className="btn-outline"
              onClick={() => handleCopy(revision.revisedOutput, revision.id)}
              style={{ 
                fontSize: 'var(--text-xs)',
                padding: 'var(--space-2)',
                minHeight: 'auto',
                minWidth: '80px'
              }}
            >
              {copiedId === revision.id ? '✅ Copied' : '📋 Copy'}
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => onRestore && onRestore(revision)}
              style={{ 
                fontSize: 'var(--text-xs)',
                padding: 'var(--space-2)',
                minHeight: 'auto',
                minWidth: '80px'
              }}
            >
              🔄 Restore
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}