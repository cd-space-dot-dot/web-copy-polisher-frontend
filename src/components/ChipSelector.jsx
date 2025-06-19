// src/components/ChipSelector.jsx

import React from "react";

export default function ChipSelector({ selectedChips, onChipsChange }) {
  const chipCategories = [
    {
      id: "length",
      label: "Length",
      chips: [
        { value: "longer", label: "↗️ Longer" },
        { value: "shorter", label: "↙️ Shorter" }
      ]
    },
    {
      id: "platform",
      label: "Platform", 
      chips: [
        { value: "social", label: "📱 Social" },
        { value: "email", label: "📧 Email" },
        { value: "webpage", label: "🌐 Web Page" },
        { value: "blog", label: "📝 Blog" }
      ]
    },
    {
      id: "industry",
      label: "Industry Vibe",
      chips: [
        { value: "ecommerce", label: "🛒 E-comm" },
        { value: "social-impact", label: "🌍 Impact" },
        { value: "sports", label: "⚽ Sports" },
        { value: "business", label: "💼 Business" }
      ]
    },
    {
      id: "tone", 
      label: "Personality",
      chips: [
        { value: "welcoming", label: "🤗 Welcome" },
        { value: "clear", label: "💡 Clear" },
        { value: "gentle", label: "🕊️ Gentle" },
        { value: "humble", label: "🙏 Humble" },
        { value: "enthused", label: "🎉 Enthused" },
        { value: "diplomatic", label: "🤝 Diplomatic" }
      ]
    },
    {
      id: "generation",
      label: "Target Generation",
      chips: [
        { value: "boomer", label: "'60s" },
        { value: "genx", label: "'80s" },
        { value: "millennial", label: "'00s" },
        { value: "genz", label: "'20s" }
      ]
    }
  ];
  
  return (
    <div className="chip-selector">
      {chipCategories.map((category) => (
        <div key={category.id} className="chip-category">
          <label className="chip-category-label">{category.label}</label>
          <div className="chip-group" role="group" aria-labelledby={`${category.id}-label`}>
            {category.chips.map((chip) => (
              <button
                key={chip.value}
                type="button"
                className={`chip ${selectedChips[category.id] === chip.value ? 'chip--selected' : ''}`}
                onClick={() => handleChipClick(category.id, chip.value)}
                aria-pressed={selectedChips[category.id] === chip.value}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}