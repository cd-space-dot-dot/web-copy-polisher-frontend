// src/components/ChipSelector.jsx

import React from "react";

export default function ChipSelector({ selectedChips, onChipsChange }) {
  const chipCategories = [
    {
      id: "length",
      label: "Length",
      chips: [
        { value: "longer", label: "Longer" },
        { value: "shorter", label: "Shorter" }
      ]
    },
    {
      id: "platform",
      label: "Platform",
      chips: [
        { value: "social", label: "Social Media" },
        { value: "email", label: "Email" },
        { value: "webpage", label: "Web Page" },
        { value: "blog", label: "Blog Post" }
      ]
    },
    {
      id: "industry",
      label: "Industry Vibe",
      chips: [
        { value: "ecommerce", label: "E-commerce" },
        { value: "social-impact", label: "Social Impact" },
        { value: "sports", label: "Sports & Fitness" },
        { value: "business", label: "Business" }
      ]
    },
    {
      id: "tone",
      label: "Personality",
      chips: [
        { value: "welcoming", label: "Welcoming" },
        { value: "clear", label: "Clear" },
        { value: "gentle", label: "Gentle" },
        { value: "humble", label: "Humble" },
        { value: "enthused", label: "Enthusiastic" },
        { value: "diplomatic", label: "Diplomatic" }
      ]
    },
    {
      id: "generation",
      label: "Target Generation",
      chips: [
        { value: "boomer", label: "Boomers ('40s-'60s)" },
        { value: "genx", label: "Gen X ('70s-'80s)" },
        { value: "millennial", label: "Millennials ('90s-'00s)" },
        { value: "genz", label: "Gen Z ('10s-'20s)" }
      ]
    }
  ];

  const handleChipClick = (categoryId, chipValue) => {
    const newChips = { ...selectedChips };
    
    // Toggle chip - if already selected in this category, remove it
    if (newChips[categoryId] === chipValue) {
      delete newChips[categoryId];
    } else {
      newChips[categoryId] = chipValue;
    }
    
    onChipsChange(newChips);
  };

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