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
      label: "Adapt it for", 
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
      label: "Tone",
      chips: [
        { value: "professional", label: "👔 Professional" },
        { value: "friendly", label: "😊 Friendly" },
        { value: "clear", label: "💡 Clear" },
        { value: "persuasive", label: "🎯 Persuasive" },
        { value: "neutral", label: "⚪ Neutral" },
        { value: "direct", label: "➡️ Direct" },
        { value: "welcoming", label: "🤗 Welcoming" },
        { value: "trustworthy", label: "🛡️ Trustworthy" },
        { value: "confident", label: "💪 Confident" },
        { value: "casual", label: "💬 Casual" },
        { value: "informative", label: "📚 Informative" },
        { value: "empathetic", label: "❤️ Empathetic" },
        { value: "urgent", label: "⚡️ Urgent" },
        { value: "enthused", label: "🎉 Enthusiastic" },
        { value: "inspiring", label: "✨ Inspiring" },
        { value: "authoritative", label: "👑 Authoritative" },
        { value: "gentle", label: "🕊️ Gentle" },
        { value: "serious", label: "🎯 Serious" },
        { value: "playful", label: "😄 Playful" },
        { value: "humble", label: "🙏 Humble" },
        { value: "diplomatic", label: "🤝 Diplomatic" },
        { value: "exclusive", label: "💎 Exclusive" },
        { value: "open", label: "🌟 Open" },
        { value: "caring", label: "👨‍👩‍👧‍👦 Caring" },
        { value: "academic", label: "🎓 Academic" },
        { value: "matter-of-fact", label: "📄 Matter-of-fact" },
        { value: "emphatic", label: "‼️ Very Emphatic" }
      ]
    },
    {
      id: "generation",
      label: "Sounds like",
      chips: [
        { value: "boomer", label: "Baby Boomer" },
        { value: "genx", label: "Gen X" },
        { value: "millennial", label: "Millennial" },
        { value: "genz", label: "Gen Z" }
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