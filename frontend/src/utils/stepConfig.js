// Step configuration with citation chips
import { HfpefPhenotype } from './phenotype';

/**
 * Step configuration
 * Why bullet format: { text: string, citations: string[] }
 */
export const STEP_CONFIGS = {
  foundational: {
    stepId: 'foundational',
    stepNumber: 1,
    why: [
      {
        text: 'Guideline: ACC/AHA Class I, LOE A for HFpEF.',
        citations: ['G1']
      },
      {
        text: 'Evidence: Supported by EMPEROR-Preserved and DELIVER trials.',
        citations: ['T1', 'T2']
      }
    ],
    phenotypeWhy: {
      [HfpefPhenotype.FRAILTY_DOMINANT]: [{
        text: 'Well tolerated in frail patients; supports early initiation in this phenotype.',
        citations: []
      }],
      [HfpefPhenotype.CKD_MODIFIED]: [{
        text: 'SGLT2 inhibitors provide renal and cardiovascular protection in CKD-modified HFpEF.',
        citations: []
      }],
      [HfpefPhenotype.METABOLIC_OBESITY]: [{
        text: 'Particularly beneficial in metabolic/obesity phenotype due to dual cardiorenal and metabolic benefits.',
        citations: []
      }]
    }
  },
  neurohormonal: {
    stepId: 'neurohormonal',
    stepNumber: 2,
    why: [
      {
        text: 'Guideline: ACC/AHA Class IIa, LOE B-R for HFpEF.',
        citations: ['G3']
      },
      {
        text: 'Evidence: PARAGON-HF trial demonstrated benefit in selected patients.',
        citations: ['T3']
      }
    ],
    phenotypeWhy: {
      [HfpefPhenotype.FRAILTY_DOMINANT]: [{
        text: 'In frailty-dominant HFpEF, consider slower titration and closer BP monitoring.',
        citations: []
      }],
      [HfpefPhenotype.CKD_MODIFIED]: [{
        text: 'In CKD-modified HFpEF, monitor renal function and potassium closely when initiating ARNI.',
        citations: []
      }],
      [HfpefPhenotype.HYPERTENSIVE]: [{
        text: 'ARNI may provide additional benefit in patients with uncontrolled hypertension.',
        citations: []
      }]
    }
  },
  comorbidity: {
    stepId: 'comorbidity',
    stepNumber: 3,
    why: [
      {
        text: 'Guideline: ACC/AHA Class IIb, LOE C-LD for HFpEF.',
        citations: ['G1']
      },
      {
        text: 'Evidence: Individualized approach based on comorbidities and patient factors.',
        citations: []
      }
    ],
    phenotypeWhy: {
      [HfpefPhenotype.AFIB_PREDOMINANT]: [{
        text: 'Beta-blockers for rate control are a priority in AFib-predominant HFpEF.',
        citations: []
      }],
      [HfpefPhenotype.FRAILTY_DOMINANT]: [{
        text: 'Consider frailty assessment when titrating medications; may require dose reduction.',
        citations: []
      }],
      [HfpefPhenotype.HYPERTENSIVE]: [{
        text: 'Focus on optimal blood pressure control as part of comorbidity management.',
        citations: []
      }]
    }
  }
};

/**
 * Get why bullets for a step
 * @param {number} stepNumber - Step number (1, 2, or 3)
 * @param {string|null} primaryPhenotype - Primary phenotype
 * @returns {Array} Array of why bullets
 */
export function getWhyBulletsForStep(stepNumber, primaryPhenotype) {
  let config;
  if (stepNumber === 1) config = STEP_CONFIGS.foundational;
  else if (stepNumber === 2) config = STEP_CONFIGS.neurohormonal;
  else if (stepNumber === 3) config = STEP_CONFIGS.comorbidity;
  else return [];

  const bullets = [...config.why];

  // Add phenotype-specific bullet if available
  if (primaryPhenotype && config.phenotypeWhy && config.phenotypeWhy[primaryPhenotype]) {
    bullets.push(...config.phenotypeWhy[primaryPhenotype]);
  }

  return bullets.slice(0, 4); // Max 4 bullets
}

