import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { GlassButton } from '../common/buttons';

const SAMPLE_SYMPTOMS = [
  'Persistent headache & dizziness',
  'Lower back pain when bending',
  'Skin redness & irritation',
  'Chest discomfort during exertion',
];

const AIRecommendation = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');

  const handleRecommend = (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      navigate('/doctors');
      return;
    }

    // Direct to doctor discovery search with symptom context
    navigate(`/doctors?search=${encodeURIComponent(symptoms.trim())}`);
  };

  const selectSample = (sample) => {
    setSymptoms(sample);
  };

  return (
    <section className="cinematic-section" id="ai-discovery">
      <div className="ai-section-card">
        {/* Glow backdrop */}
        <div className="ai-section-glow" />

        <div className="ai-badge">
          <Sparkles size={14} />
          <span>Intelligent Discovery</span>
        </div>

        <h2 className="section-title">Not sure which doctor you need?</h2>
        <p className="section-subtitle">
          Describe what you're experiencing and Medico can help you discover relevant specialists.
        </p>

        {/* Symptoms Input Dock */}
        <form onSubmit={handleRecommend} className="ai-input-dock">
          <textarea
            className="ai-textarea"
            placeholder="Describe your symptoms (e.g., persistent headache, joint stiffness, skin rash)..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            {/* Quick sample chips */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {SAMPLE_SYMPTOMS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => selectSample(sample)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    color: 'rgba(200, 205, 225, 0.7)',
                    fontSize: '0.75rem',
                    padding: '4px 10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#ffffff')}
                  onMouseOut={(e) => (e.currentTarget.style.color = 'rgba(200, 205, 225, 0.7)')}
                >
                  {sample}
                </button>
              ))}
            </div>

            <GlassButton
              type="submit"
              variant="ai"
              size="md"
              style={{
                borderRadius: '16px',
                padding: '0.65rem 1.4rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
              }}
            >
              Find Doctors with AI
              <ArrowRight size={16} style={{ marginLeft: 6 }} />
            </GlassButton>
          </div>
        </form>

        {/* Clear Medical Disclaimer */}
        <p className="ai-disclaimer">
          <ShieldAlert size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: '-1px' }} />
          Medico AI is intended strictly for discovery and scheduling navigation. It does not provide medical diagnoses or replace clinical consultations.
        </p>
      </div>
    </section>
  );
};

export default AIRecommendation;
