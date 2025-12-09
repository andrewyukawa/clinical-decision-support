import React from 'react';

function LeftRail({ modifiers, onModifierChange }) {
  const modifierLabels = [
    {
      key: 'ckd',
      label: 'Chronic kidney disease (eGFR < 30)'
    },
    {
      key: 'hypotension',
      label: 'Hypotension (SBP < 100)'
    },
    {
      key: 'afib',
      label: 'Atrial fibrillation present'
    },
    {
      key: 'diabetes',
      label: 'Diabetes present'
    },
    {
      key: 'frailty',
      label: 'Advanced frailty'
    }
  ];

  return (
    <div className="left-rail">
      <div className="rail-title">Patient Modifiers</div>
      <div className="modifier-group">
        {modifierLabels.map(({ key, label }) => (
          <div key={key} className="modifier-checkbox">
            <input
              type="checkbox"
              id={key}
              checked={modifiers[key]}
              onChange={(e) => onModifierChange(key, e.target.checked)}
            />
            <label htmlFor={key}>{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeftRail;

