# Curie Clinical Decision Support (CDS) Prototype

A structured, guideline-grounded clinical decision dashboard for Heart Failure with Preserved Ejection Fraction (HFpEF).

## Architecture

- **Frontend**: React-based dashboard with structured UI components
- **Backend**: Python FastAPI for API endpoints
- **Document Store**: JSON-based storage for guidelines and trials
- **Query System**: Template-based pathway generation with modifier filtering

## Getting Started

### Prerequisites

- Python 3.8+ 
- Node.js 16+ and npm
- A terminal/command prompt

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the backend server:
```bash
python app.py
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000` and will automatically connect to the backend API.

### Verify Installation

- Backend: Visit `http://localhost:8000` - you should see a JSON response
- Frontend: Visit `http://localhost:3000` - you should see the Curie CDS dashboard

## Project Structure

```
.
├── backend/
│   ├── app.py              # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   └── data/
│       ├── guidelines.json # Guideline data
│       └── trials.json     # Trial data
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── App.js          # Main app component
│   └── package.json        # Node dependencies
└── README.md
```

## Features

- Structured HFpEF management pathway display
- Patient modifier toggles (CKD, Hypotension, AFib, Diabetes, Frailty)
- Dynamic pathway updates based on modifiers
- Evidence panel with guidelines, trials, and recent changes
- Template-enforced output schema
- Validation rules and safety guardrails

## Data Sources

- ACC/AHA HF Guidelines
- ESC HF Guidelines
- Key Trials: EMPEROR-Preserved, DELIVER, PARAGON-HF, SOLOIST-WHF

