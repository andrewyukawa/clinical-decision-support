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

// Primary modifiers required for each phenotype (phenotype is invalid without these)
const PHENOTYPE_REQUIRED_MODIFIERS = {
  [HfpefPhenotype.FRAILTY_DOMINANT]: ['frailty'], // Frailty-dominant requires frailty
  [HfpefPhenotype.CKD_MODIFIED]: ['ckd'], // CKD-modified requires CKD
  [HfpefPhenotype.AFIB_PREDOMINANT]: ['afib'], // AFib-predominant requires AFib
  [HfpefPhenotype.METABOLIC_OBESITY]: ['obesity', 'diabetes'], // Requires either obesity OR diabetes
  [HfpefPhenotype.HYPERTENSIVE]: ['uncontrolledHypertension'], // Hypertensive requires uncontrolled HTN
};

/**
 * Check if a phenotype is valid (has required modifiers checked)
 * @param {string} phenotype - Phenotype to check
 * @param {Object} modifiers - Patient modifier object
 * @returns {boolean} True if phenotype is valid
 */
function isPhenotypeValid(phenotype, modifiers) {
  const requiredModifiers = PHENOTYPE_REQUIRED_MODIFIERS[phenotype];
  if (!requiredModifiers) return true; // No requirements = always valid
  
  // For METABOLIC_OBESITY, at least one of obesity OR diabetes must be checked
  if (phenotype === HfpefPhenotype.METABOLIC_OBESITY) {
    return modifiers.obesity || modifiers.diabetes;
  }
  
  // For others, the primary modifier must be checked
  return requiredModifiers.some(mod => modifiers[mod] === true);
}

/**
 * Infer primary HFpEF phenotype from patient modifiers
 * @param {Object} modifiers - Patient modifier object
 * @returns {Object} { primaryPhenotype: string | null, scores: Object, drivers: string[] }
 */
export function inferHfpefPhenotype(modifiers) {
  const scores = { ...INITIAL_SCORES };
  const modifierContributions = {}; // Track contribution per modifier per phenotype

  // Helper to add contribution tracking
  const addPoints = (phenotype, modifier, points) => {
    scores[phenotype] += points;
    if (!modifierContributions[modifier]) {
      modifierContributions[modifier] = {};
    }
    if (!modifierContributions[modifier][phenotype]) {
      modifierContributions[modifier][phenotype] = 0;
    }
    modifierContributions[modifier][phenotype] += points;
  };

  // Apply scoring rules based on modifiers
  if (modifiers.ckd) {
    addPoints(HfpefPhenotype.FRAILTY_DOMINANT, 'ckd', 1);
    addPoints(HfpefPhenotype.CKD_MODIFIED, 'ckd', 3);
    addPoints(HfpefPhenotype.HYPERTENSIVE, 'ckd', 1);
  }

  if (modifiers.hypotension) {
    addPoints(HfpefPhenotype.FRAILTY_DOMINANT, 'hypotension', 2);
  }

  if (modifiers.afib) {
    addPoints(HfpefPhenotype.AFIB_PREDOMINANT, 'afib', 3);
  }

  if (modifiers.diabetes) {
    addPoints(HfpefPhenotype.METABOLIC_OBESITY, 'diabetes', 2);
  }

  if (modifiers.frailty) {
    addPoints(HfpefPhenotype.FRAILTY_DOMINANT, 'frailty', 3);
    addPoints(HfpefPhenotype.CKD_MODIFIED, 'frailty', 1);
  }

  if (modifiers.obesity) {
    addPoints(HfpefPhenotype.METABOLIC_OBESITY, 'obesity', 3);
    addPoints(HfpefPhenotype.HYPERTENSIVE, 'obesity', 1);
  }

  if (modifiers.uncontrolledHypertension) {
    addPoints(HfpefPhenotype.HYPERTENSIVE, 'uncontrolledHypertension', 3);
    addPoints(HfpefPhenotype.CKD_MODIFIED, 'uncontrolledHypertension', 1);
  }

  const maxScore = Math.max(...Object.values(scores));

  if (maxScore === 0) {
    return { primaryPhenotype: null, scores, drivers: [] };
  }

  // Find phenotypes with max score, but only consider valid ones (with required modifiers)
  const candidatesWithMaxScore = PHENOTYPE_PRIORITY.filter(
    (p) => scores[p] === maxScore && isPhenotypeValid(p, modifiers)
  );

  // If no valid phenotype has max score, find the highest valid phenotype
  let primaryPhenotype = null;
  if (candidatesWithMaxScore.length > 0) {
    primaryPhenotype = candidatesWithMaxScore[0]; // Use priority order
  } else {
    // Fallback: find highest scoring valid phenotype
    const validPhenotypes = PHENOTYPE_PRIORITY.filter(p => isPhenotypeValid(p, modifiers));
    if (validPhenotypes.length > 0) {
      primaryPhenotype = validPhenotypes.reduce((max, p) => 
        scores[p] > scores[max] ? p : max
      );
    }
  }

  // Compute drivers: modifiers that contributed to the primary phenotype
  const drivers = [];
  if (primaryPhenotype) {
    const contributions = Object.keys(modifierContributions)
      .filter(modifier => modifiers[modifier]) // Only checked modifiers
      .map(modifier => ({
        modifier,
        contribution: modifierContributions[modifier][primaryPhenotype] || 0
      }))
      .filter(item => item.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution)
      .slice(0, 3); // Top 3 drivers

    drivers.push(...contributions.map(item => item.modifier));
  }

  return { primaryPhenotype, scores, drivers };
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

