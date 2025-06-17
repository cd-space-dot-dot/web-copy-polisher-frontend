// src/components/ChangeAnalysis.jsx
// This will only return "shorter" if word count math shows output is shorter; would need to set up analysis functionality for the others to show up

import React from "react";

export default function ChangeAnalysis({ analysis, originalText, revisedText }) {
  if (!analysis || !analysis.changes) {
    return (
      <div className="change-analysis">
        <div className="analysis-header">
          <h4>📊 Change Analysis</h4>
        </div>
        <p className="no-analysis">Analysis not available</p>
      </div>
    );
  }

  const getChangeTypeIcon = (type) => {
    const icons = {
      tone: "🎵",
      clarity: "💡", 
      grammar: "📝",
      structure: "🏗️",
      engagement: "🎯",
      conciseness: "✂️"
    };
    return icons[type] || "✨";
  };

  const getChangeTypeColor = (type) => {
    const colors = {
      tone: "var(--secondary)",
      clarity: "var(--primary)",
      grammar: "var(--success)",
      structure: "var(--accent)",
      engagement: "var(--accent)",
      conciseness: "var(--primary)"
    };
    return colors[type] || "var(--text-secondary)";
  };

  return (
    <div className="change-analysis">
      <div className="analysis-header">
        <h4>📊 What We Changed</h4>
      </div>
      
      {analysis.rationale && (
        <div className="analysis-summary">
          <p><strong>Overall Strategy:</strong> {analysis.rationale}</p>
        </div>
      )}

      <div className="changes-list">
        {analysis.changes.map((change, index) => (
          <div key={index} className="change-item">
            <div className="change-header">
              <span 
                className="change-type-icon"
                style={{ color: getChangeTypeColor(change.type) }}
              >
                {getChangeTypeIcon(change.type)}
              </span>
              <span className="change-type">{change.type}</span>
              <span className="change-description">{change.description}</span>
            </div>
            
            {change.before && change.after && (
              <div className="change-comparison">
                <div className="before-after">
                  <div className="before">
                    <label>Before:</label>
                    <span>"{change.before}"</span>
                  </div>
                  <div className="after">
                    <label>After:</label>
                    <span>"{change.after}"</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {analysis.metrics && (
        <div className="analysis-metrics">
          <h5>📈 Improvements</h5>
          <div className="metrics-grid">
            {analysis.metrics.readabilityImprovement && (
              <div className="metric-item">
                <span className="metric-icon">👁️</span>
                <span>Better readability</span>
              </div>
            )}
            {analysis.metrics.lengthReduction && (
              <div className="metric-item">
                <span className="metric-icon">✂️</span>
                <span>{analysis.metrics.lengthReduction}% shorter</span>
              </div>
            )}
            {analysis.metrics.keywordOptimization && (
              <div className="metric-item">
                <span className="metric-icon">🎯</span>
                <span>Keywords optimized</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}