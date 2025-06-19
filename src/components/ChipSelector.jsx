// src/components/ChipSelector.jsx

import React, { useEffect, useRef, useState } from "react";

export default function ChipSelector({ selectedChips, onChipsChange }) {
  const chipGroupRefs = useRef({});
  const [toneLimitMessage, setToneLimitMessage] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      Object.keys(chipGroupRefs.current).forEach(categoryId => {
        const chipGroup = chipGroupRefs.current[categoryId];
        const wrapper = chipGroup?.parentElement;
        
        if (chipGroup && wrapper) {
          const hasOverflow = chipGroup.scrollWidth > chipGroup.clientWidth;
          const isScrolledToEnd = chipGroup.scrollLeft >= (chipGroup.scrollWidth - chipGroup.clientWidth - 5);
          
          wrapper.classList.toggle('has-overflow', hasOverflow);
          wrapper.classList.toggle('scrolled-end', isScrolledToEnd);
        }
      });
    };

    // Check on mount and resize
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    
    // Add scroll listeners to each chip group
    Object.values(chipGroupRefs.current).forEach(chipGroup => {
      if (chipGroup) {
        chipGroup.addEventListener('scroll', checkScrollability);
      }
    });

    return () => {
      window.removeEventListener('resize', checkScrollability);
      Object.values(chipGroupRefs.current).forEach(chipGroup => {
        if (chipGroup) {
          chipGroup.removeEventListener('scroll', checkScrollability);
        }
      });
    };
  }, []);

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
          <div className="chip-category-label-wrapper">
            <label className="chip-category-label">{category.label}</label>
            {category.id === 'tone' && (
              <div className="tone-counter">
                <span className="tone-count">
                  {(selectedChips.tone || []).length}/5
                </span>
                {toneLimitMessage && (
                  <span className="tone-limit-message">
                    Maximum 5 tones allowed
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="chip-group-wrapper">
            <div 
              ref={el => chipGroupRefs.current[category.id] = el}
              className="chip-group" 
              role="group" 
              aria-labelledby={`${category.id}-label`}
            >
              {category.chips.map((chip) => {
                const isSelected = category.id === 'tone' 
                  ? (selectedChips.tone || []).includes(chip.value)
                  : selectedChips[category.id] === chip.value;
                  
                return (
                  <button
                    key={chip.value}
                    type="button"
                    className={`chip ${isSelected ? 'chip--selected' : ''}`}
                    onClick={() => handleChipClick(category.id, chip.value)}
                    aria-pressed={isSelected}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}