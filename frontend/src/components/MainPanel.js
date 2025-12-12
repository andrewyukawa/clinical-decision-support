import React from 'react';
import { PHENOTYPE_LABELS } from '../utils/phenotype';
import { formatDrivers } from '../utils/citations';
import { getWhyBulletsForStep } from '../utils/stepConfig';

function MainPanel({ pathway, loading, error, phenotypeResult, activeModifierLabels, onCitationClick }) {
  if (loading && !pathway) {
    return (
      <div className="main-panel">
        <div className="loading">Loading pathway...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-panel">
        <div className="error-message">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!pathway) {
    return (
      <div className="main-panel">
        <div>No pathway data available</div>
      </div>
    );
  }

  return (
    <div className="main-panel">
      <div className="panel-title">Stepwise Management Pathway</div>
      
      <div className="clinical-summary">
        {pathway.clinical_summary}
      </div>

      {/* Phenotype Badge */}
      <div className="phenotype-badge-container">
        {phenotypeResult?.primaryPhenotype ? (
          <div className="phenotype-badge-wrapper">
            <div className="phenotype-badge">
              Phenotype detected: {PHENOTYPE_LABELS[phenotypeResult.primaryPhenotype]}
            </div>
            {phenotypeResult.drivers && phenotypeResult.drivers.length > 0 && (
              <div className="phenotype-drivers">
                Drivers: {formatDrivers(phenotypeResult.drivers)}
              </div>
            )}
          </div>
        ) : (
          <div className="phenotype-badge phenotype-not-specified">
            Phenotype not specified
          </div>
        )}
      </div>

      <div className="pathway-steps">
        {pathway.steps.map((step) => {
          const stepClass = `pathway-step ${
            step.contraindicated ? 'contraindicated' : ''
          } ${step.priority ? 'priority' : ''}`;

          return (
            <div key={step.step_number} className={stepClass}>
              <div className="step-header">
                <div className="step-number">{step.step_number}</div>
                <div className="step-name">{step.step_name}</div>
              </div>
              
              <div className="step-therapy">{step.therapy_class}</div>
              
              <div className="step-evidence">
                <span className="evidence-badge">
                  {step.recommendation_class}
                </span>
                <span className="evidence-badge">
                  LOE: {step.level_of_evidence}
                </span>
              </div>

              <div className="step-rationale">{step.rationale}</div>

              {/* Why this is recommended section */}
              {(() => {
                const whyBullets = getWhyBulletsForStep(step.step_number, phenotypeResult?.primaryPhenotype);
                if (whyBullets.length === 0) return null;
                
                return (
                  <div className="why-section">
                    <h5>Why this is recommended</h5>
                    <ul>
                      {whyBullets.map((bullet, idx) => (
                        <li key={idx}>
                          {bullet.text}
                          {bullet.citations && bullet.citations.length > 0 && (
                            <span className="citation-chips">
                              {bullet.citations.map((citationId, cidx) => (
                                <button
                                  key={cidx}
                                  className="citation-chip"
                                  onClick={() => onCitationClick && onCitationClick(citationId)}
                                  aria-label={`View citation ${citationId}`}
                                >
                                  [{citationId}]
                                </button>
                              ))}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {step.warning && (
                <div className="step-warning">
                  ⚠️ {step.warning}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MainPanel;

