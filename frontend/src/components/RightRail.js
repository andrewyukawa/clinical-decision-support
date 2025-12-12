import React, { useState, useEffect, useRef } from 'react';
import { GUIDELINE_CITATIONS } from '../utils/citations';

function RightRail({ pathway, phenotypeResult, activeTab: controlledTab, onTabChange, highlightedId }) {
  const [internalTab, setInternalTab] = useState('trials');
  const citationRefs = useRef({});
  const trialRefs = useRef({});

  // Use controlled tab if provided, otherwise use internal state
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = onTabChange || setInternalTab;

  // Scroll and highlight when highlightedId changes
  useEffect(() => {
    if (highlightedId) {
      if (highlightedId.startsWith('G')) {
        setActiveTab('citations');
        setTimeout(() => {
          const element = citationRefs.current[highlightedId];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlighted');
            setTimeout(() => {
              element.classList.remove('highlighted');
            }, 1500);
          }
        }, 100);
      } else if (highlightedId.startsWith('T')) {
        setActiveTab('trials');
        setTimeout(() => {
          const element = trialRefs.current[highlightedId];
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('highlighted');
            setTimeout(() => {
              element.classList.remove('highlighted');
            }, 1500);
          }
        }, 100);
      }
    }
  }, [highlightedId, setActiveTab]);

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
          className={`tab ${activeTab === 'citations' ? 'active' : ''}`}
          onClick={() => setActiveTab('citations')}
        >
          Citations
        </div>
        <div
          className={`tab ${activeTab === 'trials' ? 'active' : ''}`}
          onClick={() => setActiveTab('trials')}
        >
          Key Trials
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'citations' && (
          <div className="evidence-section">
            <div className="section-title">Citations</div>
            {GUIDELINE_CITATIONS.map((citation) => (
              <div
                key={citation.id}
                ref={el => citationRefs.current[citation.id] = el}
                className={`citation-card ${highlightedId === citation.id ? 'highlighted' : ''}`}
              >
                <div className="citation-id">{citation.id}</div>
                <div className="citation-source-name">
                  <strong>{citation.sourceName}</strong>
                </div>
                {citation.section && (
                  <div className="citation-section">{citation.section}</div>
                )}
                <div className="citation-excerpt">{citation.excerpt}</div>
                {citation.location && (
                  <div className="citation-location">
                    <small>{citation.location}</small>
                  </div>
                )}
                {citation.url && (
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="citation-link"
                  >
                    Open Source →
                  </a>
                )}
              </div>
            ))}
            <div className="citation-card" style={{ marginTop: '16px', opacity: 0.7 }}>
              <small><strong>Last Updated:</strong> {pathway.last_updated}</small>
            </div>
          </div>
        )}

        {activeTab === 'trials' && (
          <div className="evidence-section">
            <div className="section-title">Supporting Trials</div>
            {pathway.trial_support?.map((trial, idx) => {
              const trialId = trial.id || `T${idx + 1}`;
              return (
                <div
                  key={idx}
                  ref={el => trialRefs.current[trialId] = el}
                  className={`trial-card ${highlightedId === trialId ? 'highlighted' : ''}`}
                >
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
                {trial.relevance_general && (
                  <div className="trial-field">
                    <strong>Relevance:</strong> {trial.relevance_general}
                  </div>
                )}
                {phenotypeResult?.primaryPhenotype && 
                 trial.relevance_by_phenotype?.[phenotypeResult.primaryPhenotype] && (
                  <div className="trial-field trial-phenotype-note">
                    {trial.relevance_by_phenotype[phenotypeResult.primaryPhenotype]}
                  </div>
                )}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default RightRail;

