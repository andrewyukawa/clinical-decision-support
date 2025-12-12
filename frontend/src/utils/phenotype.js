// HFpEF Phenotype Types and Inference Engine

export const HfpefPhenotype = {
  FRAILTY_DOMINANT: 'frailty_dominant',
  CKD_MODIFIED: 'ckd_modified',
  AFIB_PREDOMINANT: 'afib_predominant',
  METABOLIC_OBESITY: 'metabolic_obesity',
  HYPERTENSIVE: 'hypertensive',
};

export const PHENOTYPE_LABELS = {
  [HfpefPhenotype.FRAILTY_DOMINANT]: 'Frailty-dominant HFpEF',
  [HfpefPhenotype.CKD_MODIFIED]: 'CKD-modified HFpEF',
  [HfpefPhenotype.AFIB_PREDOMINANT]: 'AFib-predominant HFpEF',
  [HfpefPhenotype.METABOLIC_OBESITY]: 'Metabolic/obesity HFpEF',
  [HfpefPhenotype.HYPERTENSIVE]: 'Hypertensive HFpEF',
};

const INITIAL_SCORES = {
  [HfpefPhenotype.FRAILTY_DOMINANT]: 0,
  [HfpefPhenotype.CKD_MODIFIED]: 0,
  [HfpefPhenotype.AFIB_PREDOMINANT]: 0,
  [HfpefPhenotype.METABOLIC_OBESITY]: 0,
  [HfpefPhenotype.HYPERTENSIVE]: 0,
};

const PHENOTYPE_PRIORITY = [
  HfpefPhenotype.FRAILTY_DOMINANT,
  HfpefPhenotype.CKD_MODIFIED,
  HfpefPhenotype.AFIB_PREDOMINANT,
  HfpefPhenotype.METABOLIC_OBESITY,
  HfpefPhenotype.HYPERTENSIVE,
];

/**
 * Infer primary HFpEF phenotype from patient modifiers
 * @param {Object} modifiers - Patient modifier object
 * @returns {Object} { primaryPhenotype: string | null, scores: Object }
 */
export function inferHfpefPhenotype(modifiers) {
  const scores = { ...INITIAL_SCORES };

  // Apply scoring rules based on modifiers
  if (modifiers.ckd) {
    scores[HfpefPhenotype.FRAILTY_DOMINANT] += 1;
    scores[HfpefPhenotype.CKD_MODIFIED] += 3;
    scores[HfpefPhenotype.HYPERTENSIVE] += 1;
  }

  if (modifiers.hypotension) {
    scores[HfpefPhenotype.FRAILTY_DOMINANT] += 2;
  }

  if (modifiers.afib) {
    scores[HfpefPhenotype.AFIB_PREDOMINANT] += 3;
  }

  if (modifiers.diabetes) {
    scores[HfpefPhenotype.METABOLIC_OBESITY] += 2;
  }

  if (modifiers.frailty) {
    scores[HfpefPhenotype.FRAILTY_DOMINANT] += 3;
    scores[HfpefPhenotype.CKD_MODIFIED] += 1;
  }

  if (modifiers.obesity) {
    scores[HfpefPhenotype.METABOLIC_OBESITY] += 3;
    scores[HfpefPhenotype.HYPERTENSIVE] += 1;
  }

  if (modifiers.uncontrolledHypertension) {
    scores[HfpefPhenotype.HYPERTENSIVE] += 3;
    scores[HfpefPhenotype.CKD_MODIFIED] += 1;
  }

  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) {
    return { primaryPhenotype: null, scores };
  }

  const primaryPhenotype = PHENOTYPE_PRIORITY.find(
    (p) => scores[p] === maxScore
  ) || null;

  return { primaryPhenotype, scores };
}

/**
 * Get list of active modifier names for tooltip
 * @param {Object} modifiers - Patient modifier object
 * @returns {Array<string>} Array of active modifier labels
 */
export function getActiveModifierLabels(modifiers) {
  const labels = {
    ckd: 'CKD',
    hypotension: 'Hypotension',
    afib: 'Atrial fibrillation',
    diabetes: 'Diabetes',
    frailty: 'Frailty',
    obesity: 'Obesity',
    uncontrolledHypertension: 'Uncontrolled hypertension',
  };

  return Object.keys(modifiers)
    .filter(key => modifiers[key] === true)
    .map(key => labels[key])
    .filter(Boolean);
}

