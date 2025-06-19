// src/components/PolishButton.jsx

import React from "react";

export default function PolishButton({ 
  handleSubmit, 
  loading, 
  disabled, 
  variant = "primary",
  label,
  onPolishAgain 
}) {
  
  const handleClick = () => {
    if (variant === "secondary" && onPolishAgain) {
      // This is the "Polish Again" button
      onPolishAgain();
    } else {
      // This is the regular "Polish My Copy" button
      handleSubmit();
    }
  };

  const getButtonText = () => {
    if (loading) {
      return variant === "secondary" ? "Polishing Again..." : "Polishing...";
    }
    if (label) {
      return label;
    }
    return variant === "secondary" ? "✨ Polish Again!" : "✨ Polish My Copy";
  };

  const getButtonClass = () => {
    const baseClass = variant === "secondary" ? "btn-accent" : "btn-primary";
    return `${baseClass} polish-btn`;
  };

  return (
    <button 
      type="button" 
      className={getButtonClass()}
      onClick={handleClick}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading && (
        <span className="spinner"></span>
      )}
      {getButtonText()}
    </button>
  );
}