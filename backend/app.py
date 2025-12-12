"""
Curie CDS Backend API
Provides structured pathway lookups for HFpEF management
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
from datetime import datetime
from pathlib import Path

app = FastAPI(title="Curie CDS API", version="1.0.0")

# CORS middleware for frontend communication
# Allow all origins for now (can restrict to specific domains later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when allow_origins is ["*"]
    allow_methods=["GET", "POST", "OPTIONS"],  # Explicitly allow these methods
    allow_headers=["*"],
)

# Data models
class PatientModifier(BaseModel):
    ckd: bool = False  # eGFR < 30
    hypotension: bool = False  # SBP < 100
    afib: bool = False  # Atrial fibrillation present
    diabetes: bool = False  # Diabetes present
    frailty: bool = False  # Advanced frailty
    obesity: bool = False  # Obesity
    uncontrolledHypertension: bool = False  # Uncontrolled hypertension (e.g. SBP > target)

class PathwayRequest(BaseModel):
    disease: str = "HFpEF"  # Locked for v1
    modifiers: PatientModifier

class PathwayStep(BaseModel):
    step_number: int
    step_name: str
    therapy_class: str
    recommendation_class: str  # Class I, IIa, IIb, III
    level_of_evidence: str  # A, B-R, B-NR, C-LD, C-EO
    rationale: str
    contraindicated: bool = False
    priority: bool = False
    warning: Optional[str] = None
    why_recommended: Optional[List[str]] = None  # Guideline and evidence bullets
    phenotype_note: Optional[str] = None  # Phenotype-specific note

class Trial(BaseModel):
    name: str
    population: str
    intervention: str
    comparator: str
    primary_endpoint: str
    outcome: str
    abstract_link: Optional[str] = None
    relevance_general: Optional[str] = None
    relevance_by_phenotype: Optional[Dict[str, str]] = None

class PathwayResponse(BaseModel):
    clinical_summary: str
    steps: List[PathwayStep]
    key_modifiers: Dict[str, bool]
    mechanistic_rationale: str
    trial_support: List[Trial]
    evidence_confidence: str  # High, Moderate, Emerging
    guideline_sources: List[str]
    last_updated: str

# Data directory
DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

def load_guidelines() -> Dict[str, Any]:
    """Load guideline data"""
    guidelines_path = DATA_DIR / "guidelines.json"
    if guidelines_path.exists():
        with open(guidelines_path, "r") as f:
            return json.load(f)
    return {}

def load_trials() -> List[Dict[str, Any]]:
    """Load trial data"""
    trials_path = DATA_DIR / "trials.json"
    if trials_path.exists():
        with open(trials_path, "r") as f:
            return json.load(f)
    return []

def generate_pathway(modifiers: PatientModifier) -> PathwayResponse:
    """
    Generate HFpEF management pathway based on patient modifiers.
    Uses template-based generation with modifier filtering.
    """
    guidelines = load_guidelines()
    trials = load_trials()
    
    # Base pathway steps (template)
    base_steps = [
        {
            "step_number": 1,
            "step_name": "Foundational Therapy",
            "therapy_class": "SGLT2 Inhibitor",
            "recommendation_class": "Class I",
            "level_of_evidence": "A",
            "rationale": "SGLT2 inhibitors reduce heart failure hospitalizations and cardiovascular death in HFpEF regardless of diabetes status."
        },
        {
            "step_number": 2,
            "step_name": "Neurohormonal Modulation",
            "therapy_class": "ARNI or ACEi/ARB",
            "recommendation_class": "Class IIa",
            "level_of_evidence": "B-R",
            "rationale": "ARNI may provide benefit in selected HFpEF patients; ACEi/ARB are considered when ARNI is not appropriate."
        },
        {
            "step_number": 3,
            "step_name": "Comorbidity Optimization",
            "therapy_class": "MRA, Beta-blocker, or Rate Control",
            "recommendation_class": "Class IIb",
            "level_of_evidence": "C-LD",
            "rationale": "MRA may be considered in select patients; beta-blockers for rate control in AFib; optimize comorbidities."
        }
    ]
    
    # Infer phenotype (simplified client-side version - for now just pass modifiers)
    # In a full implementation, this would be done here, but keeping it client-side for v1
    
    # Apply modifier-based filtering
    steps = []
    for step_data in base_steps:
        step_dict = step_data.copy()
        
        # Add why_recommended bullets
        if step_dict["step_number"] == 1:
            step_dict["why_recommended"] = [
                "Guideline: ACC/AHA Class I, Level A for HFpEF.",
                "Evidence: Supported by EMPEROR-Preserved and DELIVER trials."
            ]
        elif step_dict["step_number"] == 2:
            step_dict["why_recommended"] = [
                "Guideline: ACC/AHA Class IIa, Level B-R for HFpEF.",
                "Evidence: PARAGON-HF trial demonstrated benefit in selected patients."
            ]
        elif step_dict["step_number"] == 3:
            step_dict["why_recommended"] = [
                "Guideline: ACC/AHA Class IIb, Level C-LD for HFpEF.",
                "Evidence: Individualized approach based on comorbidities and patient factors."
            ]
        
        step = PathwayStep(**step_dict)
        
        # Apply contraindications and warnings
        if modifiers.ckd and step.step_number == 2:
            # ARNI/ACEi may need dose adjustment with CKD
            step.warning = "Monitor eGFR and potassium; dose adjustment may be required"
        
        if modifiers.hypotension and step.step_number in [2, 3]:
            # Neurohormonal agents may worsen hypotension
            step.contraindicated = False  # Not absolute contraindication
            step.warning = "Use with caution; monitor blood pressure closely"
        
        if modifiers.afib and step.step_number == 3:
            # Beta-blockers are priority for rate control in AFib
            step.priority = True
            step.rationale = "Beta-blocker for rate control in atrial fibrillation; consider rhythm control in select patients"
        
        if modifiers.diabetes and step.step_number == 1:
            # SGLT2 is especially beneficial in diabetes
            step.priority = True
        
        if modifiers.frailty and step.step_number in [2, 3]:
            # Consider frailty in elderly
            step.warning = "Consider frailty assessment; may need dose reduction or slower titration"
        
        steps.append(step)
    
    # Filter out contraindicated steps (gray out in UI)
    # For now, we keep all steps but mark them appropriately
    
    # Build clinical summary
    active_modifiers = {
        "CKD": modifiers.ckd,
        "Hypotension": modifiers.hypotension,
        "Atrial Fibrillation": modifiers.afib,
        "Diabetes": modifiers.diabetes,
        "Advanced Frailty": modifiers.frailty,
        "Obesity": modifiers.obesity,
        "Uncontrolled Hypertension": modifiers.uncontrolledHypertension
    }
    
    modifier_list = [k for k, v in active_modifiers.items() if v]
    if modifier_list:
        clinical_summary = f"For a patient with HFpEF and {', '.join(modifier_list)}, the following management pathway is recommended:"
    else:
        clinical_summary = "For a patient with HFpEF, the following standard management pathway is recommended:"
    
    # Mechanistic rationale
    mechanistic_rationale = """
    HFpEF management focuses on three pillars: (1) SGLT2 inhibitors as foundational therapy with proven CV and renal benefits,
    (2) Neurohormonal modulation with ARNI or ACEi/ARB to address remodeling, and (3) Comorbidity optimization including
    blood pressure control, rate/rhythm management in AFib, and volume optimization. Patient-specific factors modify the
    sequence and intensity of these interventions.
    """
    
    # Get relevant trials
    relevant_trials = [
        Trial(**trial) for trial in trials[:4]  # Top 4 trials
    ]
    
    # Evidence confidence
    evidence_confidence = "High"  # Based on strong guideline support and multiple RCTs
    
    # Guideline sources
    guideline_sources = [
        "ACC/AHA/HFSA Heart Failure Guideline 2022",
        "ESC Heart Failure Guidelines 2021"
    ]
    
    return PathwayResponse(
        clinical_summary=clinical_summary,
        steps=steps,
        key_modifiers=active_modifiers,
        mechanistic_rationale=mechanistic_rationale.strip(),
        trial_support=relevant_trials,
        evidence_confidence=evidence_confidence,
        guideline_sources=guideline_sources,
        last_updated="2024-01-15"
    )

@app.get("/")
def root():
    return {"message": "Curie CDS API", "version": "1.0.0", "disease": "HFpEF"}

@app.get("/health")
def health():
    return {"status": "ok", "cors": "enabled"}

@app.get("/api/guidelines/metadata")
def get_guideline_metadata():
    """Get guideline version and metadata"""
    return {
        "disease": "HFpEF",
        "guideline_version": "ACC/AHA/HFSA 2022, ESC 2021",
        "last_updated": "2024-01-15",
        "evidence_confidence": "High"
    }

@app.post("/api/pathway", response_model=PathwayResponse)
def get_pathway(request: PathwayRequest):
    """
    Get HFpEF management pathway based on patient modifiers.
    This is the primary endpoint - deterministic, template-based.
    """
    if request.disease != "HFpEF":
        raise HTTPException(status_code=400, detail="Only HFpEF is supported in v1")
    
    pathway = generate_pathway(request.modifiers)
    
    # Validation: must have all required elements
    if not pathway.steps or not pathway.trial_support:
        raise HTTPException(status_code=500, detail="Pathway generation failed validation")
    
    return pathway

@app.get("/api/trials")
def get_trials():
    """Get all trial data"""
    trials = load_trials()
    return {"trials": trials}

@app.get("/api/guidelines")
def get_guidelines():
    """Get guideline data"""
    guidelines = load_guidelines()
    return guidelines

if __name__ == "__main__":
    import uvicorn
    import os
    # Railway provides PORT environment variable, default to 8000 for local development
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

