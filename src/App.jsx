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
  const [selectedChips, setSelectedChips] = useState({});

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToInput = () => document.querySelector('.draft-input')?.scrollIntoView({ behavior: 'smooth' });

  async function handleSubmit() {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: input, 
          contentType, 
          similarity,
          chips: selectedChips 
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
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: input, 
          contentType, 
          similarity,
          chips: selectedChips 
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
  
      {/* Step 1: Content Type Selection */}
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
            <SmartContentDetector 
              input={input}
              currentType={contentType}
              onTypeDetected={setContentType}
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
              <h3>✨ Your polished copy will appear here</h3>
              <p>Add your text and click "Polish My Copy" above!</p>
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
  
      {/* Scroll to top button */}
      <button 
        className={`scroll-to-top${showScrollButton ? '' : ' hidden'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ⬆️
      </button>
    </div>
  );
}
