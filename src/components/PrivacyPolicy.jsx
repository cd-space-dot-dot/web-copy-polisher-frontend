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
            <h4>What We Store Locally (On Your Device)</h4>
            <ul>
              <li><strong>Session History:</strong> Your original text and AI revisions from your current session</li>
              <li><strong>Thread ID:</strong> A unique identifier for your writing session (like "thread_abc123")</li>
              <li><strong>Storage Location:</strong> Your browser's localStorage only - never sent anywhere</li>
              <li><strong>Your Control:</strong> Click "Clear Session" anytime or clear your browser data</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h4>What We Log (For Service Improvement)</h4>
            <ul>
              <li><strong>Input & Output Text:</strong> What you submit and what our AI generates</li>
              <li><strong>Settings Used:</strong> Content type, similarity level, style preferences</li>
              <li><strong>Purpose:</strong> Improving our prompts and AI responses only</li>
              <li><strong>Anonymized:</strong> No personal information, names, or account data collected</li>
            </ul>
          </div>

          <div className="privacy-section">
            <h4>What We Don't Do</h4>
            <ul>
              <li>❌ No tracking cookies or analytics</li>
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