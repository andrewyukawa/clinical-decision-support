// Citation data and utilities

export const MODIFIER_LABELS = {
  ckd: 'CKD',
  hypotension: 'Hypotension',
  afib: 'Atrial fibrillation',
  diabetes: 'Diabetes',
  frailty: 'Frailty',
  obesity: 'Obesity',
  uncontrolledHypertension: 'Uncontrolled HTN',
};

/**
 * Format drivers list for display
 * @param {string[]} drivers - Array of modifier keys
 * @returns {string} Formatted drivers string
 */
export function formatDrivers(drivers) {
  if (!drivers || drivers.length === 0) return '';
  
  const labels = drivers.map(key => MODIFIER_LABELS[key] || key);
  
  if (labels.length <= 3) {
    return labels.join(', ');
  }
  
  const firstThree = labels.slice(0, 3).join(', ');
  const remaining = labels.length - 3;
  return `${firstThree} + ${remaining} more`;
}

// Guideline Citations
export const GUIDELINE_CITATIONS = [
  {
    id: 'G1',
    sourceName: 'ACC/AHA/HFSA Heart Failure Guideline 2022',
    section: 'HFpEF – Pharmacologic therapy',
    excerpt: 'SGLT2 inhibitors are recommended (Class I, LOE A) in HFpEF to reduce heart failure hospitalizations and cardiovascular mortality.',
    location: 'HFpEF section',
    url: null, // Add URL if available
  },
  {
    id: 'G2',
    sourceName: 'ESC Heart Failure Guidelines 2021',
    section: 'HFpEF treatment',
    excerpt: 'SGLT2 inhibitors are recommended in patients with HFpEF to reduce the risk of HF hospitalizations and cardiovascular death.',
    location: 'HFpEF section',
    url: null,
  },
  {
    id: 'G3',
    sourceName: 'ACC/AHA/HFSA Heart Failure Guideline 2022',
    section: 'HFpEF – ARNI therapy',
    excerpt: 'ARNI (sacubitril-valsartan) may be beneficial (Class IIa, LOE B-R) to reduce heart failure hospitalizations in selected patients with HFpEF.',
    location: 'HFpEF section',
    url: null,
  },
];

/**
 * Get citation by ID
 * @param {string} citationId - Citation ID (e.g., 'G1', 'T1')
 * @returns {Object|null} Citation object or null
 */
export function getCitationById(citationId) {
  if (citationId.startsWith('G')) {
    return GUIDELINE_CITATIONS.find(c => c.id === citationId) || null;
  }
  return null;
}

