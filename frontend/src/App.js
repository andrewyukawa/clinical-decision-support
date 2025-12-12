import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import LeftRail from './components/LeftRail';
import MainPanel from './components/MainPanel';
import RightRail from './components/RightRail';
import Footer from './components/Footer';
import { getPathway, getGuidelineMetadata } from './services/api';
import { inferHfpefPhenotype, getActiveModifierLabels } from './utils/phenotype';

function App() {
  const [modifiers, setModifiers] = useState({
    ckd: false,
    hypotension: false,
    afib: false,
    diabetes: false,
    frailty: false,
    obesity: false,
    uncontrolledHypertension: false
  });

  const [pathway, setPathway] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Infer phenotype whenever modifiers change
  const phenotypeResult = useMemo(() => inferHfpefPhenotype(modifiers), [modifiers]);

  useEffect(() => {
    // Load guideline metadata
    getGuidelineMetadata()
      .then(data => {
        setMetadata(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Fetch pathway whenever modifiers change
    const fetchPathway = async () => {
      setLoading(true);
      try {
        const data = await getPathway({ disease: 'HFpEF', modifiers });
        setPathway(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load pathway');
      } finally {
        setLoading(false);
      }
    };

    fetchPathway();
  }, [modifiers]);

  const handleModifierChange = (modifier, value) => {
    setModifiers(prev => ({
      ...prev,
      [modifier]: value
    }));
  };

  if (loading && !pathway) {
    return (
      <div className="app">
        <div className="loading">Loading Curie CDS...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar metadata={metadata} />
      <div className="app-content">
        <LeftRail 
          modifiers={modifiers} 
          onModifierChange={handleModifierChange} 
        />
        <MainPanel 
          pathway={pathway} 
          loading={loading} 
          error={error}
          phenotypeResult={phenotypeResult}
          activeModifierLabels={getActiveModifierLabels(modifiers)}
        />
        <RightRail 
          pathway={pathway}
          phenotypeResult={phenotypeResult}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

