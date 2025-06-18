// src/App.jsx

import React, { useState, useEffect } from "react";
import ContentTypeSelector from "./components/ContentTypeSelector";
import DraftInput from "./components/DraftInput";
import SimilaritySlider from "./components/SimilaritySlider";
import PolishButton from "./components/PolishButton";
import RevisedOutput from "./components/RevisedOutput";
import RevisionHistory from "./components/RevisionHistory";
import MeshGradientLoader from "./components/MeshGradientLoader";

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

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToInput = () => {
    document.querySelector('.draft-input')?.scrollIntoView({ behavior: 'smooth' });
  };

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
          similarity
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setOutput(data.revised);
      setAnalysis(data.analysis);
      setMetadata(data.metadata);
      
      // Add to revision history
      if (data.revision) {
        setRevisions(prev => [data.revision, ...prev.slice(0, 9)]); // Keep last 10
      }
      
      // Scroll to output
      setTimeout(() => {
        document.querySelector('.revised-output')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (err) {
      console.error("Error during fetch:", err);
      // Show user-friendly error
      setOutput("Sorry, there was an error. Please try again.");
      setAnalysis(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }

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
      
      {/* Input section */}
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2>Paste your writing</h2>
          </div>
          <div className="card-content">
            <DraftInput input={input} setInput={setInput} />
          </div>
          <div className="card-footer">
            <PolishButton 
              handleSubmit={handleSubmit} 
              loading={loading}
              disabled={!input.trim()}
            />
          </div>
        </div>
      </section>

      {/* Output section */}
        <div style={{ position: 'relative' }}>
        {/* <MeshGradientLoader loading={loading} /> */}
        {output ? (
          <RevisedOutput 
                output={output}
                analysis={analysis}
                originalInput={input}
                metadata={metadata}
                onNewRevision={handleNewRevision}
            />
          ) : (
          <section className="section">
            <div className="output-placeholder">
              <h3>✨ Your polished copy will appear here</h3>
              <p>Add your text and click "Polish My Copy" above!</p>
              {input.length === 0 && (
                <div className="scroll-up-hint" onClick={scrollToTop}>
                  ⬆️ Add your text first
                </div>
              )}
            </div>
          </section>
        )
        }
        </div>

      {/* Secondary input section */}              
      <section className="section">
        <div className="card">
          <div className="card-header">
            <h2>Refine more</h2>
          </div>
          <div className="card-content">
            <ContentTypeSelector 
              selectedType={contentType}
              onTypeChange={setContentType}
            />
          </div>
          <div className="card-header">
            <h2>Refine more</h2>
          </div>
          <div className="card-content">
            <SimilaritySlider 
              value={similarity}
              onChange={setSimilarity}
            />
          </div>
        </div>
      </section>

      {/* Revisions section */}
      {revisions.length > 0 && (
        <section className="section">
          <div className="card">
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
        className={`scroll-to-top ${showScrollButton ? '' : 'hidden'}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ⬆️
      </button>
    </div>
  );
}