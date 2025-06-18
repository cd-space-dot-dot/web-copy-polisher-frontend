// src/components/MeshGradientLoader.jsx

import React from "react";

export default function MeshGradientLoader({ loading }) {
  return (
    <div className={`mesh-loader-overlay${loading ? " show" : ""}`}>
      <div className="mesh-gradient-blob mesh-blob-1"></div>
      <div className="mesh-gradient-blob mesh-blob-2"></div>
      <div className="mesh-gradient-blob mesh-blob-3"></div>
    </div>
  );
}
