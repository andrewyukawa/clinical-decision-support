import React from 'react';
import { PHENOTYPE_LABELS } from '../utils/phenotype';
import { getStepPhenotypeNote } from '../utils/stepPhenotypeNotes';

function MainPanel({ pathway, loading, error, phenotypeResult, activeModifierLabels }) {
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
        {phenotypeResult.primaryPhenotype ? (
          <div 
            className="phenotype-badge"
            title={`Based on: ${activeModifierLabels.join(', ')}`}
          >
            Phenotype detected: {PHENOTYPE_LABELS[phenotypeResult.primaryPhenotype]}
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
              {(step.why_recommended || getStepPhenotypeNote(step.step_number, phenotypeResult?.primaryPhenotype)) && (
                <div className="why-section">
                  <h5>Why this is recommended</h5>
                  <ul>
                    {step.why_recommended?.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                    {getStepPhenotypeNote(step.step_number, phenotypeResult?.primaryPhenotype) && (
                      <li>{getStepPhenotypeNote(step.step_number, phenotypeResult.primaryPhenotype)}</li>
                    )}
                  </ul>
                </div>
              )}

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

