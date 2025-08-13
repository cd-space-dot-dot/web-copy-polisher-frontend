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
          // Check if we're in a wrapping mode (large desktop)
          const isLargeDesktop = window.innerWidth >= 1200;
          
          if (isLargeDesktop) {
            // On large desktop, chips wrap so no scroll indicators needed
            wrapper.classList.remove('has-overflow', 'scrolled-end');
          } else {
            // On mobile/medium desktop, check for horizontal overflow
            const hasOverflow = chipGroup.scrollWidth > chipGroup.clientWidth;
            const isScrolledToEnd = chipGroup.scrollLeft >= (chipGroup.scrollWidth - chipGroup.clientWidth - 5);
            
            wrapper.classList.toggle('has-overflow', hasOverflow);
            wrapper.classList.toggle('scrolled-end', isScrolledToEnd);
          }
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
      // Handle single selection categories (length, content-type, industry, generation)
      const currentSelection = (selectedChips.single && selectedChips.single[categoryId]);
      
      // If deselecting social media, also clear social platform
      if (categoryId === 'content-type' && currentSelection === 'social' && chipValue !== 'social') {
        onChipsChange({
          ...selectedChips,
          single: {
            ...selectedChips.single,
            [categoryId]: currentSelection === chipValue ? undefined : chipValue,
            'social-platform': undefined
          }
        });
      } else {
        onChipsChange({
          ...selectedChips,
          single: {
            ...selectedChips.single,
            [categoryId]: currentSelection === chipValue ? undefined : chipValue
          }
        });
      }
    }
  };

  const handleSocialPlatformClick = (platformValue) => {
    const currentPlatform = selectedChips.single && selectedChips.single['social-platform'];
    
    onChipsChange({
      ...selectedChips,
      single: {
        ...selectedChips.single,
        'social-platform': currentPlatform === platformValue ? undefined : platformValue
      }
    });
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
      id: "content-type",
      label: "Content Type", 
      chips: [
        { value: "webpage", label: "🌐 Web Page" },
        { value: "social", label: "📱 Social Media", subOptions: [
          { value: "instagram", label: "💕 Instagram" },
          { value: "linkedin", label: "👔 LinkedIn" },
          { value: "twitter", label: "🐦 X (Twitter)" },
          { value: "facebook", label: "👍 Facebook" },
          { value: "tiktok", label: "🎬 TikTok" },
          { value: "youtube-description", label: "📝 YouTube Description" },
          { value: "youtube-comment", label: "💬 YouTube Comment" },
          { value: "threads", label: "🪡 Threads" },
          { value: "bluesky", label: "☁️ Bluesky" },
          { value: "reddit", label: "🔴 Reddit" },
          { value: "product-description", label: "🏷️ Product Description" }
        ]},
        { value: "blog", label: "📝 Blog" },
        { value: "slack", label: "#️⃣ Slack" },
        { value: "email", label: "📧 Email" },
      ]
    },
    {
      id: "industry",
      label: "Industry",
      chips: [
        { value: "business", label: "💼 Business" },
        { value: "tech", label: "💻 Tech" },
        { value: "marketing", label: "📢 Marketing" },
        { value: "ecommerce", label: "🛒 E-commerce" },
        { value: "education", label: "🎓 Education" },
        { value: "health", label: "🩻 Health" },
        { value: "finance", label: "💰 Finance" },
        { value: "saas", label: "💾 SaaS" },
        { value: "consulting", label: "💡 Consulting" },
        { value: "real-estate", label: "🏠 Real Estate" },
        { value: "food", label: "🍕 Food & Dining" },
        { value: "travel", label: "✈️ Travel" },
        { value: "legal", label: "⚖️ Legal" },
        { value: "nonprofit", label: "🤝 Nonprofit" },
        { value: "journalism", label: "📰 Journalism" },
        { value: "data-analytics", label: "📊 Data Analytics" },
        { value: "therapy", label: "🧠 Mental Health" },
        { value: "ux-design", label: "🎨 Design" },
        { value: "creator-economy", label: "🎥 Creator Economy" },
        { value: "social-impact", label: "🌍 Social Impact" },
        { value: "sports", label: "⚽ Sports" },
        { value: "podcasting", label: "🎙️ Podcasting" },
        { value: "gaming", label: "🎮 Gaming" },
        { value: "crypto-web3", label: "⛓️ Web3" },
        { value: "entertainment", label: "🎬 Entertainment" }
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
        { value: "unbothered", label: "🤷🏽 Unbothered" },
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
        <div className="chip-selector-description">
            <h3>How should it sound?</h3>
        </div>
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
                        <div key={chip.value} className="chip-with-suboptions">
                          <button
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
                          
                          {/* Show sub-options if this chip is selected and has sub-options */}
                          {isSelected && chip.subOptions && (
                            <div className="chip-suboptions">
                              <div className="chip-suboptions-label">Choose platform:</div>
                              <div className="chip-suboptions-group">
                                {chip.subOptions.map((subOption) => {
                                  const isSubSelected = (selectedChips.single && selectedChips.single['social-platform']) === subOption.value;
                                  return (
                                    <button
                                      key={subOption.value}
                                      type="button"
                                      className={`chip chip--sub ${isSubSelected ? 'chip--selected' : ''}`}
                                      onClick={() => handleSocialPlatformClick(subOption.value)}
                                      aria-pressed={isSubSelected}
                                    >
                                      {subOption.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
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