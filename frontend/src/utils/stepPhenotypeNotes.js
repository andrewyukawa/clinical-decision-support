// Phenotype-specific notes for pathway steps
import { HfpefPhenotype } from './phenotype';

export const STEP_PHENOTYPE_NOTES = {
  1: {
    // SGLT2 Inhibitor
    [HfpefPhenotype.FRAILTY_DOMINANT]: 'Well tolerated in frail patients; supports early initiation in this phenotype.',
    [HfpefPhenotype.CKD_MODIFIED]: 'SGLT2 inhibitors provide renal and cardiovascular protection in CKD-modified HFpEF.',
    [HfpefPhenotype.METABOLIC_OBESITY]: 'Particularly beneficial in metabolic/obesity phenotype due to dual cardiorenal and metabolic benefits.',
  },
  2: {
    // ARNI/ACEi/ARB
    [HfpefPhenotype.FRAILTY_DOMINANT]: 'In frailty-dominant HFpEF, consider slower titration and closer BP monitoring.',
    [HfpefPhenotype.CKD_MODIFIED]: 'In CKD-modified HFpEF, monitor renal function and potassium closely when initiating ARNI.',
    [HfpefPhenotype.HYPERTENSIVE]: 'ARNI may provide additional benefit in patients with uncontrolled hypertension.',
  },
  3: {
    // Comorbidity Optimization
    [HfpefPhenotype.AFIB_PREDOMINANT]: 'Beta-blockers for rate control are a priority in AFib-predominant HFpEF.',
    [HfpefPhenotype.FRAILTY_DOMINANT]: 'Consider frailty assessment when titrating medications; may require dose reduction.',
    [HfpefPhenotype.HYPERTENSIVE]: 'Focus on optimal blood pressure control as part of comorbidity management.',
  },
};

/**
 * Get phenotype-specific note for a step
 * @param {number} stepNumber - The step number
 * @param {string|null} primaryPhenotype - The inferred primary phenotype
 * @returns {string|null} Phenotype-specific note or null
 */
export function getStepPhenotypeNote(stepNumber, primaryPhenotype) {
  if (!primaryPhenotype || !STEP_PHENOTYPE_NOTES[stepNumber]) {
    return null;
  }
  return STEP_PHENOTYPE_NOTES[stepNumber][primaryPhenotype] || null;
}

