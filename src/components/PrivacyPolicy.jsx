import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function PrivacyPolicy() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button 
        className="privacy-link" 
        onClick={openModal}
      >
        Privacy & Data
      </button>
      
      {isModalOpen && createPortal(
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Privacy & Data</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
          <div className="privacy-section">
            <h4>What Is Stored Locally (On Your Device)</h4>
            <ul>
              <li><strong>Session History:</strong> Your original text and AI revisions from your current session</li>
              <li><strong>Thread ID:</strong> A unique identifier for your writing session (like "abc123")</li>
              <li><strong>Storage Location:</strong> Your browser's <a href="https://www.w3schools.com/html/html5_webstorage.asp">localStorage</a> only - never sent anywhere</li>
              <li><strong>Your Control:</strong> Click "Clear Session" anytime or clear your browser data</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h4>What We Log (On Our Device Or In the Cloud)</h4>
            <ul>
              <li><strong>Input & Output Text:</strong> What you submit and what the AI generates in response</li>
              <li><strong>Settings You Use:</strong> Like content type, similarity level, style requests</li>
              <li><strong>Web Traffic Analytics:</strong> <a href="https://vercel.com/docs/analytics">Basic analytics</a> from our server, which show information like the number of visits over a span of time, percent of visitors from different countries, and percent of users accessing via a mobile or desktop device</li>
              <li><strong>Purpose:</strong> Improving our prompts and AI responses</li>
              <li><strong>Anonymized:</strong> No personal information, names, or account data collected <strong>unless</strong> you share it while using Clear Convey</li>
              <li><strong>Agreement</strong>: When you use Clear Convey, what you input will be accessible by our team and partners who help (for example) build, maintain, improve or share this tool; this not a guarantee that anyone will see it, nor does it mean that we own the content. You are responsible for staying on the right side of copyright and the legal and ethical dimensions of intellectual property, and you retain ownership over owned content you input into the form</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h4>What We Don't Currently Do</h4>
            <ul>
              <li>❌ No tracking cookies</li>
              <li>❌ No advertising pixel</li>
              <li>❌ No Google Analytics</li>
              <li>❌ No selling or sharing your data</li>
              <li>❌ No email collection or marketing</li>
              <li>❌ No permanent user accounts or profiles</li>
            </ul>
          </div>

              <div className="privacy-note">
                <strong>Private browsing:</strong> If you use incognito/private mode, your session history won't persist between visits.
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}