// src/components/ChipSelector.jsx

import React, { useEffect, useRef, useState } from "react";

export default function ChipSelector({ selectedChips, onChipsChange }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const chipGroupRefs = useRef({});

  // Define which categories allow multiple selections
  const MULTIPLE_SELECTION_CATEGORIES = ['tone'];

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

  // Calculate exponential fade opacity and AI weight
  const calculateFadeProperties = (categoryId, chipValue, selectionIndex) => {
    if (!MULTIPLE_SELECTION_CATEGORIES.includes(categoryId) || selectionIndex === -1) {
      return { opacity: 1, aiWeight: 1 };
    }

    let opacity;
    if (selectionIndex <= 1) {
      opacity = 1; // First 2 selections stay full opacity
    } else if (selectionIndex === 2) {
      opacity = 0.9; // 3rd selection barely fades
    } else {
      opacity = Math.max(0.05, Math.pow(0.6, selectionIndex - 2) * 0.9);
    }

    let aiWeight;
    if (selectionIndex === 0) {
      aiWeight = 1; // First selection full weight
    } else if (selectionIndex === 1) {
      aiWeight = 0.8; // Second selection strong
    } else if (selectionIndex === 2) {
      aiWeight = 0.6; // Third selection moderate
    } else {
      aiWeight = Math.max(0.05, 0.4 * Math.pow(0.7, selectionIndex - 3));
    }

    return { opacity, aiWeight };
  };

  const handleChipClick = (categoryId, chipValue) => {
    if (MULTIPLE_SELECTION_CATEGORIES.includes(categoryId)) {
      // Handle multiple selection categories (like tone)
      const currentSelections = (selectedChips.multiple && selectedChips.multiple[categoryId]) || [];
      
      if (currentSelections.includes(chipValue)) {
        // Remove if already selected
        const newSelections = currentSelections.filter(item => item !== chipValue);
        onChipsChange({
          ...selectedChips,
          multiple: {
            ...selectedChips.multiple,
            [categoryId]: newSelections.length > 0 ? newSelections : undefined
          }
        });
      } else {
        // Add new selection
        onChipsChange({
          ...selectedChips,
          multiple: {
            ...selectedChips.multiple,
            [categoryId]: [...currentSelections, chipValue]
          }
        });
      }
    } else {
      // Handle single selection categories (length, platform, industry, generation)
      const currentSelection = (selectedChips.single && selectedChips.single[categoryId]);
      
      onChipsChange({
        ...selectedChips,
        single: {
          ...selectedChips.single,
          [categoryId]: currentSelection === chipValue ? undefined : chipValue
        }
      });
    }
  };

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
      label: "Industry",
      chips: [
        { value: "ecommerce", label: "🛒 E-comm" },
        { value: "social-impact", label: "🌍 Social Impact" },
        { value: "business", label: "💼 Business" },
        { value: "sports", label: "⚽ Sports" },
        { value: "sports", label: "🩻 Health" }
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
      label: "Vibe",
      chips: [
        { value: "boomer", label: "Baby Boomer" },
        { value: "genx", label: "Gen X" },
        { value: "millennial", label: "Millennial" },
        { value: "genz", label: "Gen Z" }
      ]
    }
  ];
  
  const toggleExpandCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  return (
    <div className="chip-selector-wrapper">
      <div className="chip-selector-container">
        <div className="chip-selector">
          {chipCategories.map((category) => {
            const isMultipleCategory = MULTIPLE_SELECTION_CATEGORIES.includes(category.id);
            const selectedCount = isMultipleCategory 
              ? (selectedChips.multiple && selectedChips.multiple[category.id] || []).length 
              : 0;

            // --- More Button Logic Start ---
            const isExpanded = expandedCategories[category.id];
            const maxVisible = 5;
            const chipsToShow = isExpanded ? category.chips : category.chips.slice(0, maxVisible);
            // --- More Button Logic End ---

            return (
              <div key={category.id} className="chip-category">
                <div className="chip-category-label-wrapper">
                  <label className="chip-category-label">{category.label}</label>
                  {isMultipleCategory && selectedCount > 0 && (
                    <div className="selection-counter">
                      <span className="selection-count">
                        {selectedCount} selected
                      </span>
                      {selectedCount === 2 && (
                        <span className="tone-message tone-message--good">
                          Nice mix of tones!
                        </span>
                      )}
                      {selectedCount >= 3 && selectedCount <= 4 && (
                        <span className="tone-message tone-message--ok">
                          Good variety
                        </span>
                      )}
                      {selectedCount === 5 && (
                        <span className="tone-message tone-message--warning">
                          That's a lot...
                        </span>
                      )}
                      {selectedCount >= 6 && selectedCount <= 7 && (
                        <span className="tone-message tone-message--warning">
                          Fewer tones = better results
                        </span>
                      )}
                      {selectedCount >= 8 && (
                        <span className="tone-message tone-message--error">
                          Way too many! Pick your favs
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
                    {/* --- More Button Logic Start --- */}
                    {chipsToShow.map((chip) => {
                      let isSelected, selectionIndex, fadeProps;
                      
                      if (isMultipleCategory) {
                        const currentSelections = (selectedChips.multiple && selectedChips.multiple[category.id]) || [];
                        isSelected = currentSelections.includes(chip.value);
                        selectionIndex = currentSelections.indexOf(chip.value);
                        fadeProps = calculateFadeProperties(category.id, chip.value, selectionIndex);
                      } else {
                        isSelected = (selectedChips.single && selectedChips.single[category.id]) === chip.value;
                        fadeProps = { opacity: 1, aiWeight: 1 };
                      }
                      
                      return (
                        <button
                          key={chip.value}
                          type="button"
                          className={`chip ${isSelected ? 'chip--selected' : ''}`}
                          onClick={() => handleChipClick(category.id, chip.value)}
                          aria-pressed={isSelected}
                          style={isSelected ? {
                            '--fade-opacity': fadeProps.opacity,
                            transition: 'all 0.3s ease-out'
                          } : {}}
                          data-ai-weight={isSelected ? fadeProps.aiWeight : 0}
                          title={isSelected && isMultipleCategory ? 
                            `Selection #${selectionIndex + 1} - AI weight: ${Math.round(fadeProps.aiWeight * 100)}%` : 
                            undefined}
                        >
                          {chip.label}
                        </button>
                      );
                    })}
                    {/* More/Show Less Button */}
                    {category.chips.length > maxVisible && !isExpanded && (
                      <button
                        className="chip chip--more"
                        type="button"
                        onClick={() => toggleExpandCategory(category.id)}
                        aria-label="Show more chips"
                      >
                        +{category.chips.length - maxVisible} more…
                      </button>
                    )}
                    {category.chips.length > maxVisible && isExpanded && (
                      <button
                        className="chip chip--more"
                        type="button"
                        onClick={() => toggleExpandCategory(category.id)}
                        aria-label="Show fewer chips"
                      >
                        Show less
                      </button>
                    )}
                    {/* --- More Button Logic End --- */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
