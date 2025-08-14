// src/App.jsx

import React, { useState, useEffect } from "react";
import ContentTypeSelector from "./components/ContentTypeSelector";
import DraftInput from "./components/DraftInput";
import SimilaritySlider from "./components/SimilaritySlider";
import PolishButton from "./components/PolishButton";
import RevisedOutput from "./components/RevisedOutput";
import RevisionHistory from "./components/RevisionHistory";
import SessionHistory from "./components/SessionHistory";
import MeshGradientLoader from "./components/MeshGradientLoader";
import ChipSelector from "./components/ChipSelector";
import SmartContentDetector from "./components/SmartContentDetector";
import Footer, { ProTipsSection } from "./components/Footer";
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  const [input, setInput] = useState("");
  const [contentType, setContentType] = useState("other");
  const [similarity, setSimilarity] = useState(50);
  const [output, setOutput] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [threadId, setThreadId] = useState(() => {
    // First check URL params for bookmarked session
    const urlParams = new URLSearchParams(window.location.search);
    const urlThreadId = urlParams.get('thread');
    if (urlThreadId) {
      localStorage.setItem('clearConveyThreadId', urlThreadId);
      return urlThreadId;
    }
    // Otherwise initialize from localStorage if available
    return localStorage.getItem('clearConveyThreadId') || null;
  });
  const [sessionHistory, setSessionHistory] = useState(() => {
    // Initialize session history from localStorage if available
    const saved = localStorage.getItem('clearConveySessionHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedChips, setSelectedChips] = useState({
    single: {}, // { length: "longer", platform: "social", industry: "business", generation: "millennial" }
    multiple: {} // { tone: ["professional", "friendly"] }
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save threadId to localStorage and URL whenever it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem('clearConveyThreadId', threadId);
      // Update URL for bookmarking
      const url = new URL(window.location);
      url.searchParams.set('thread', threadId);
      window.history.replaceState({}, '', url);
    } else {
      localStorage.removeItem('clearConveyThreadId');
      // Remove from URL
      const url = new URL(window.location);
      url.searchParams.delete('thread');
      window.history.replaceState({}, '', url);
    }
  }, [threadId]);

  // Save session history to localStorage whenever it changes
  useEffect(() => {
    if (sessionHistory.length > 0) {
      localStorage.setItem('clearConveySessionHistory', JSON.stringify(sessionHistory));
    } else {
      localStorage.removeItem('clearConveySessionHistory');
    }
  }, [sessionHistory]);

  // Debug helper for chips - remove this later
  useEffect(() => {
  console.log('Chip State:', {
    single: selectedChips.single,
    multiple: selectedChips.multiple,
    flattened: { ...selectedChips.single, ...selectedChips.multiple }
  });
  }, [selectedChips]);

  // Helper function to calculate AI weights for chip selections
const calculateChipWeights = (chipState) => {
  const MULTIPLE_SELECTION_CATEGORIES = ['tone'];
  const result = {};

  // Handle single selections (full weight)
  if (chipState.single) {
    Object.entries(chipState.single).forEach(([category, value]) => {
      if (value) {
        result[category] = { value, weight: 1 };
      }
    });
  }

  // Chips - Handle multiple selections with exponential weights
  if (chipState.multiple) {
    Object.entries(chipState.multiple).forEach(([category, selections]) => {
      if (selections && selections.length > 0) {
        result[category] = selections.map((value, index) => {
          // Same exponential formula as ChipSelector
          let weight;
          if (index === 0) {
            weight = 1; // First selection full weight
          } else if (index === 1) {
            weight = 0.8; // Second selection strong
          } else if (index === 2) {
            weight = 0.6; // Third selection moderate
          } else {
            // Rapid drop: 0.4 * 0.7^(index-3)
            weight = Math.max(0.05, 0.4 * Math.pow(0.7, index - 3));
          }
          
          return { value, weight: Math.round(weight * 100) / 100 }; // Round to 2 decimal places
        });
      }
    });
  }

  return result;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToInput = () => document.querySelector('.draft-input')?.scrollIntoView({ behavior: 'smooth' });

  // Sync content type with content-type chips
  const syncContentTypeWithChips = (newContentType) => {
    setContentType(newContentType);
    
    // Map content type to content-type chip value
    const contentTypeChipValue = newContentType === 'other' ? undefined : newContentType;
    
    setSelectedChips(prev => ({
      ...prev,
      single: {
        ...prev.single,
        'content-type': contentTypeChipValue
      }
    }));
  };

  const syncChipsWithContentType = (newChipState) => {
    setSelectedChips(newChipState);
    
    // If content-type chip changed, sync with content type
    if (newChipState.single?.['content-type'] && newChipState.single['content-type'] !== contentType) {
      setContentType(newChipState.single['content-type']);
    } else if (!newChipState.single?.['content-type'] && contentType !== 'other') {
      setContentType('other');
    }
  };

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    
    // Helper function to calculate AI weights for chip selections
    const calculateChipWeights = (chipState) => {
      const MULTIPLE_SELECTION_CATEGORIES = ['tone'];
      const result = {};
  
      // Handle single selections (full weight)
      if (chipState.single) {
        Object.entries(chipState.single).forEach(([category, value]) => {
          if (value) {
            result[category] = { value, weight: 1 };
          }
        });
      }
  
      // Handle multiple selections with exponential weights
      if (chipState.multiple) {
        Object.entries(chipState.multiple).forEach(([category, selections]) => {
          if (selections && selections.length > 0) {
            result[category] = selections.map((value, index) => {
              // Same exponential formula as ChipSelector
              let weight;
              if (index === 0) {
                weight = 1; // First selection full weight
              } else if (index === 1) {
                weight = 0.8; // Second selection strong
              } else if (index === 2) {
                weight = 0.6; // Third selection moderate
              } else {
                // Rapid drop: 0.4 * 0.7^(index-3)
                weight = Math.max(0.05, 0.4 * Math.pow(0.7, index - 3));
              }
              
              return { value, weight: Math.round(weight * 100) / 100 }; // Round to 2 decimal places
            });
          }
        });
      }
  
      return result;
    };
  
    try {
      const chipWeights = calculateChipWeights(selectedChips);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: input, 
          contentType, 
          socialPlatform: selectedChips.single?.['social-platform'] || null,
          similarity,
          chips: {
            ...selectedChips.single,
            ...selectedChips.multiple
          },
          chipWeights: chipWeights
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOutput(data.revised);
      setAnalysis(data.analysis);
      setMetadata(data.metadata);
      
      // Capture threadId for session tracking
      if (data.threadId) {
        setThreadId(data.threadId);
        
        // Determine if this is a refinement of the current output or a new original
        const isRefinement = output && input === output;
        
        // Add to session history with thread tracking
        const historyEntry = {
          timestamp: new Date().toISOString(),
          inputText: isRefinement ? sessionHistory[sessionHistory.length - 1]?.inputText : input,
          outputText: data.revised,
          contentType,
          socialPlatform: selectedChips.single?.['social-platform'] || null,
          similarity,
          requestType: isRefinement ? 'refinement' : 'initial',
          threadId: data.threadId,
          originalText: isRefinement ? sessionHistory[sessionHistory.length - 1]?.originalText : input
        };
        setSessionHistory(prev => [...prev, historyEntry]);
      }
      
      if (data.revision) setRevisions(prev => [data.revision, ...prev.slice(0, 9)]);
      setTimeout(() => {
        document.querySelector('.revised-output')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error("Error during fetch:", err);
      setOutput("Sorry, there was an error. Please try again.");
      setAnalysis(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }

  const handlePolishAgain = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    
    // Helper function to calculate AI weights for chip selections
    const calculateChipWeights = (chipState) => {
      const MULTIPLE_SELECTION_CATEGORIES = ['tone'];
      const result = {};
  
      // Handle single selections (full weight)
      if (chipState.single) {
        Object.entries(chipState.single).forEach(([category, value]) => {
          if (value) {
            result[category] = { value, weight: 1 };
          }
        });
      }
  
      // Handle multiple selections with exponential weights
      if (chipState.multiple) {
        Object.entries(chipState.multiple).forEach(([category, selections]) => {
          if (selections && selections.length > 0) {
            result[category] = selections.map((value, index) => {
              let weight;
              if (index === 0) {
                weight = 1;
              } else if (index === 1) {
                weight = 0.8;
              } else if (index === 2) {
                weight = 0.6;
              } else {
                weight = Math.max(0.05, 0.4 * Math.pow(0.7, index - 3));
              }
              
              return { value, weight: Math.round(weight * 100) / 100 };
            });
          }
        });
      }
  
      return result;
    };
    
    try {
      const chipWeights = calculateChipWeights(selectedChips);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: input, 
          contentType, 
          socialPlatform: selectedChips.single?.['social-platform'] || null,
          similarity,
          threadId: threadId, // Include threadId for refinements
          chips: {
            ...selectedChips.single,
            ...selectedChips.multiple
          },
          chipWeights: chipWeights
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      setOutput(data.revised);
      setAnalysis(data.analysis);
      setMetadata(data.metadata);
      
      // Update session history for refinements
      if (data.threadId) {
        // This is always a refinement since it's triggered by "Polish Again"
        const historyEntry = {
          timestamp: new Date().toISOString(),
          inputText: input,
          outputText: data.revised,
          contentType,
          socialPlatform: selectedChips.single?.['social-platform'] || null,
          similarity,
          requestType: 'refinement'
        };
        setSessionHistory(prev => [...prev, historyEntry]);
      }
      
      if (data.revision) setRevisions(prev => [data.revision, ...prev.slice(0, 9)]);
      
      // Auto-scroll to output after a brief delay
      setTimeout(() => {
        const outputElement = document.querySelector('.revised-output, .container--output');
        if (outputElement) {
          outputElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200);
      
    } catch (err) {
      console.error("Error during polish again:", err);
      setOutput("Sorry, there was an error. Please try again.");
      setAnalysis(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRevision = (text) => {
    setInput(text);
    scrollToInput();
  };

  const handleRestoreRevision = (revision) => {
    setInput(revision.originalInput);
    setContentType(revision.contentType);
    setSimilarity(revision.similarity);
    setOutput(revision.revisedOutput);
    setAnalysis(revision.analysis);
    setMetadata({
      contentType: revision.contentType,
      similarity: revision.similarity,
      wordCount: {
        original: revision.originalInput.split(/\s+/).length,
        revised: revision.revisedOutput.split(/\s+/).length
      }
    });
    scrollToTop();
  };

  const clearSession = () => {
    setThreadId(null);
    setSessionHistory([]);
    localStorage.removeItem('clearConveyThreadId');
    localStorage.removeItem('clearConveySessionHistory');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✨ Clear Convey</h1>
        <p>Refine your web writing using proven principles</p>
      </header>
  
      {/* Step 1: Smart Content Detector */}
      <section className="section">
        <div className="container-base">
          <div className="card-header">
            <h2>Step 1: What kind of content is this?</h2>
          </div>
          <div className="card-content">
            <ContentTypeSelector 
              selectedType={contentType}
              onTypeChange={syncContentTypeWithChips}
            />
          </div>
        </div>
      </section>
  
      {/* Step 2: Input Section */}
      <section className="section">
        <div className="container-base container--input">
          <div className="card-header">
            <h2>Step 2: Paste your writing</h2>
          </div>
          <div className="card-content">
            <DraftInput input={input} setInput={setInput} />
          </div>
          <div className="action-row">
            <PolishButton 
              handleSubmit={handleSubmit} 
              loading={loading}
              disabled={!input.trim()}
            />
          </div>
        </div>
      </section>
  
      {/* Output Section */}
      <section className="section">
        <div className={`container-base container--output revised-output${output ? ' has-content' : ''}${loading ? ' loading' : ''}`}>
          <MeshGradientLoader loading={loading} />
          {output ? (
            <>
              <RevisedOutput 
                output={output}
                analysis={analysis}
                originalInput={input}
                metadata={metadata}
                onNewRevision={handleNewRevision}
                sessionHistoryCount={sessionHistory.length}
                onViewHistory={() => {
                  const historySection = document.querySelector('.session-header');
                  if (historySection) {
                    historySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Expand history if collapsed
                    const historyContent = document.querySelector('.session-content');
                    if (!historyContent) {
                      historySection.click();
                    }
                  }
                }}
              />
            </>
          ) : (
            <div className="output-placeholder">
              {loading ? (
                <>
                  <h3>✨ Polishing your writing...</h3>
                  <p>This usually takes just a few seconds</p>
                </>
              ) : (
                <>
                  <h3>✨ Your polished writing will appear here</h3>
                  <p>Add your text and click "Polish My Writing" above!</p>
                  <div className="scroll-hint-area">
                    {input.length === 0 && (
                      <div className="scroll-up-hint" onClick={scrollToTop}>
                        ⬆️ Add your text first
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </section>
  
      {/* Step 3: Refinement Options with Chips */}
      <section className="section">
        <div className="container-base">
          <div className="card-header">
            <h2>Step 3: Refine style</h2>
          </div>
          <div className="card-content">
            <SimilaritySlider 
              value={similarity}
              onChange={setSimilarity}
            />
            <ChipSelector 
              selectedChips={selectedChips}
              onChipsChange={syncChipsWithContentType}
            />
          </div>
          <div className="action-row">
            <PolishButton 
              handleSubmit={handleSubmit} 
              loading={loading}
              disabled={!input.trim()}
              variant="secondary"
              label="✨ Polish Again!"
              onPolishAgain={handlePolishAgain}
            />
          </div>
        </div>
      </section>
  
      {/* Session History Section */}
      {sessionHistory.length > 0 && (
        <section className="section">
          <div className="container-base">
            <SessionHistory 
              history={sessionHistory}
              threadId={threadId}
              onClearSession={clearSession}
            />
          </div>
        </section>
      )}

      {/* Revisions Section */}
      {revisions.length > 0 && (
        <section className="section">
          <div className="container-base container--revisions">
            <div className="card-header">
              <h3>📚 Revision History</h3>
              <p>Your last {revisions.length} revisions</p>
            </div>
            <div className="card-content">
              <RevisionHistory 
                history={revisions}
                onRestore={handleRestoreRevision}
              />
            </div>
          </div>
        </section>
      )}
  
      {/* Pro Tips Section */}
      <ProTipsSection />
  
      {/* Scroll to top button */}
      <button 
        className={`scroll-to-top${showScrollButton ? '' : ' hidden'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ⬆️
      </button>
  
      {/* Footer */}
      <Footer />
    </div>
  );
}