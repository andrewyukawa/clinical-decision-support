import React from 'react';

function TopBar({ metadata }) {
  if (!metadata) {
    return (
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="disease-badge">HFpEF</div>
        </div>
      </div>
    );
  }

  const confidenceClass = `confidence-badge confidence-${metadata.evidence_confidence?.toLowerCase() || 'high'}`;

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="disease-badge">Disease: {metadata.disease}</div>
        <div className="guideline-info">
          {metadata.guideline_version} | Updated: {metadata.last_updated}
        </div>
      </div>
      <div className={confidenceClass}>
        {metadata.evidence_confidence || 'High'} Confidence
      </div>
    </div>
  );
}

export default TopBar;

