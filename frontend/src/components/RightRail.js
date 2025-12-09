import React, { useState } from 'react';

function RightRail({ pathway }) {
  const [activeTab, setActiveTab] = useState('guidelines');

  if (!pathway) {
    return (
      <div className="right-rail">
        <div>Loading evidence panel...</div>
      </div>
    );
  }

  return (
    <div className="right-rail">
      <div className="rail-title">Evidence Panel</div>
      
      <div className="tabs">
        <div
          className={`tab ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
        >
          Guideline Basis
        </div>
        <div
          className={`tab ${activeTab === 'trials' ? 'active' : ''}`}
          onClick={() => setActiveTab('trials')}
        >
          Key Trials
        </div>
        <div
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Changes
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'guidelines' && (
          <div className="evidence-section">
            <div className="section-title">Guideline Sources</div>
            {pathway.guideline_sources?.map((source, idx) => (
              <div key={idx} className="guideline-source">
                {source}
              </div>
            ))}
            <div className="guideline-source" style={{ marginTop: '16px' }}>
              <strong>Last Updated:</strong> {pathway.last_updated}
            </div>
          </div>
        )}

        {activeTab === 'trials' && (
          <div className="evidence-section">
            <div className="section-title">Supporting Trials</div>
            {pathway.trial_support?.map((trial, idx) => (
              <div key={idx} className="trial-card">
                <div className="trial-name">{trial.name}</div>
                <div className="trial-field">
                  <strong>Population:</strong> {trial.population}
                </div>
                <div className="trial-field">
                  <strong>Intervention:</strong> {trial.intervention}
                </div>
                <div className="trial-field">
                  <strong>Comparator:</strong> {trial.comparator}
                </div>
                <div className="trial-field">
                  <strong>Primary Endpoint:</strong> {trial.primary_endpoint}
                </div>
                <div className="trial-field">
                  <strong>Outcome:</strong> {trial.outcome}
                </div>
                {trial.abstract_link && (
                  <a
                    href={trial.abstract_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trial-link"
                  >
                    View Abstract →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="evidence-section">
            <div className="section-title">Recent Changes</div>
            <div className="guideline-source">
              <strong>2022:</strong> SGLT2 inhibitors elevated to Class I, Level A recommendation for HFpEF based on EMPEROR-Preserved and DELIVER trials.
            </div>
            <div className="guideline-source" style={{ marginTop: '12px' }}>
              <strong>2021:</strong> ARNI (sacubitril-valsartan) received Class IIa recommendation for selected HFpEF patients based on PARAGON-HF trial.
            </div>
            <div className="guideline-source" style={{ marginTop: '12px' }}>
              <strong>2020:</strong> Focus shifted from symptom management to disease-modifying therapies with proven outcomes.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RightRail;

