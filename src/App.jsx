// src/App.jsx

import React, { useState, useEffect } from "react";
import ContentTypeSelector from "./components/ContentTypeSelector";
import DraftInput from "./components/DraftInput";
import SimilaritySlider from "./components/SimilaritySlider";
import PolishButton from "./components/PolishButton";
import RevisedOutput from "./components/RevisedOutput";
import RevisionHistory from "./components/RevisionHistory";
import MeshGradientLoader from "./components/MeshGradientLoader";
import ChipSelector from "./components/ChipSelector";
import SmartContentDetector from "./components/SmartContentDetector";
import Footer, { ProTipsSection } from "./components/Footer";

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
  const [selectedChips, setSelectedChips] = useState({
    single: {}, // { length: "longer", platform: "social", industry: "business", generation: "millennial" }
    multiple: {} // { tone: ["professional", "friendly"] }
  });

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              onTypeChange={setContentType}
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
        <div className="container-base container--output revised-output">
          <MeshGradientLoader loading={loading} />
          {output ? (
            <RevisedOutput 
              output={output}
              analysis={analysis}
              originalInput={input}
              metadata={metadata}
              onNewRevision={handleNewRevision}
            />
          ) : (
            <div className="output-placeholder">
              <h3>✨ Your polished writing will appear here</h3>
              <p>Add your text and click "Polish My Writing" above!</p>
              {input.length === 0 && (
                <div className="scroll-up-hint" onClick={scrollToTop}>
                  ⬆️ Add your text first
                </div>
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
              onChipsChange={setSelectedChips}
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