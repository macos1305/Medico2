import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../../components/patient/PatientSidebar';
import BookingModal from '../../components/appointment/BookingModal';
import StarRating from '../../components/review/StarRating';
import aiRecommendationService from '../../services/aiRecommendationService';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Brain,
  HeartPulse,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  IndianRupee,
  Building2,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  RefreshCw,
  Info,
  MapPin,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton } from '../../components/common/buttons';

const SAMPLE_PROMPTS = [
  'I have frequent headaches and dizziness.',
  'Persistent knee pain and stiffness after running.',
  'Red itchy skin rash on both arms that started yesterday.',
  'Occasional heart palpitations and shortness of breath with mild exertion.',
  'Dry cough, body aches, mild fever, and general fatigue for three days.',
  'Trouble sleeping, constant anxiety, and difficulty concentrating.',
];

const RecommendDoctorPage = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [expandedFactors, setExpandedFactors] = useState({});
  const [filterSpecialty, setFilterSpecialty] = useState('ALL');

  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    const clean = symptoms.trim();
    if (!clean || clean.length < 5) {
      toastError('Please describe your symptoms in at least 5 characters.', 'Input Required');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await aiRecommendationService.recommendDoctor(clean);
      if (res && res.success) {
        setResult(res.data);
        toastSuccess('Doctor recommendations generated based on your symptoms.', 'Analysis Complete');
      } else {
        toastError(res?.message || 'Failed to analyze symptoms', 'Analysis Error');
      }
    } catch (err) {
      toastError(err.message || 'An error occurred while generating recommendations.', 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt) => {
    setSymptoms(prompt);
  };

  const toggleFactors = (docId) => {
    setExpandedFactors((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const handleBookDoctor = (doc) => {
    setSelectedDoctor(doc);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingModalOpen(false);
    toastSuccess('Consultation successfully scheduled!', 'Booked');
    navigate('/patient/appointments');
  };

  const displayedDoctors = (result?.doctors || []).filter((doc) => {
    if (filterSpecialty === 'ALL') return true;
    return doc.specialization === filterSpecialty;
  });

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="patient-layout-grid"
        >
          {/* Sidebar */}
          <PatientSidebar />

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', minWidth: 0 }}>
            {/* Page Header */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Sparkles size={22} />
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                    fontWeight: 700,
                    margin: 0,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  AI Clinical Matcher
                </h1>
              </div>
              <p style={{ margin: 0, color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.95rem' }}>
                Describe your symptoms in natural language to discover relevant medical specialties and top-rated verified practitioners.
              </p>
            </div>

            {/* Medical Disclaimer Banner */}
            <div
              style={{
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderLeft: '4px solid #f59e0b',
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                backdropFilter: 'blur(16px)',
              }}
            >
              <AlertTriangle size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.88rem', fontWeight: 700, color: '#fbbf24' }}>
                  Doctor Discovery Tool Only — Not a Medical Diagnosis
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(253, 230, 138, 0.85)', lineHeight: 1.5 }}>
                  This tool uses natural language clinical pattern recognition to match relevant specialties and assist you in selecting a certified provider. It does not provide medical assessments or treatment plans. If you are experiencing a life-threatening emergency, call emergency services immediately.
                </p>
              </div>
            </div>

            {/* Input Card */}
            <div
              className="glass-card"
              style={{
                padding: '2rem',
                background: 'rgba(18, 20, 29, 0.65)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              }}
            >
              <form onSubmit={handleAnalyze}>
                <label
                  htmlFor="symptoms-input"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    marginBottom: '0.65rem',
                  }}
                >
                  What symptoms or health concerns are you experiencing?
                </label>

                <textarea
                  id="symptoms-input"
                  rows={4}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g. I have been having frequent headaches, mild dizziness, and trouble focusing on my screen for the past few days..."
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '0.95rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: '#ffffff',
                    fontFamily: 'inherit',
                    outline: 'none',
                    lineHeight: 1.55,
                    resize: 'vertical',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(56, 189, 248, 0.5)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)')}
                />

                {/* Sample Prompt Pills */}
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.7)', display: 'block', marginBottom: '0.5rem' }}>
                    Try common examples:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {SAMPLE_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromptClick(prompt)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '999px',
                          padding: '0.35rem 0.85rem',
                          fontSize: '0.78rem',
                          color: 'rgba(200, 205, 225, 0.8)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
                          e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                          e.currentTarget.style.color = '#38bdf8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                          e.currentTarget.style.color = 'rgba(200, 205, 225, 0.8)';
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
                  {result && (
                    <SecondaryGlassButton
                      size="sm"
                      onClick={() => {
                        setSymptoms('');
                        setResult(null);
                      }}
                    >
                      Clear
                    </SecondaryGlassButton>
                  )}
                  <GlassButton
                    variant="ai"
                    type="submit"
                    size="large"
                    loading={loading}
                    disabled={!symptoms.trim()}
                    icon={<Sparkles size={17} />}
                  >
                    Find Matching Specialists
                  </GlassButton>
                </div>
              </form>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div
                className="glass-card"
                style={{
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  background: 'rgba(18, 20, 29, 0.65)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(56, 189, 248, 0.3))',
                    border: '2px solid rgba(56, 189, 248, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: '#38bdf8',
                    animation: 'pulse 1.8s infinite',
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.25)',
                  }}
                >
                  <Activity size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
                  Analyzing Health Description
                </h3>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.9rem', margin: 0 }}>
                  Extracting clinical patterns, matching medical specialties, and scoring verified practitioners...
                </p>
              </div>
            )}

            {/* Analysis & Recommendation Results */}
            {result && !loading && (
              <>
                {/* Emergency Alert (if red flags present) */}
                {result.analysis?.isEmergency && (
                  <div
                    style={{
                      backgroundColor: 'rgba(244, 63, 94, 0.12)',
                      border: '1px solid rgba(244, 63, 94, 0.3)',
                      borderLeft: '4px solid #f43f5e',
                      borderRadius: '16px',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    <AlertTriangle size={24} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#fb7185' }}>
                        Urgent Medical Notice
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffffff', lineHeight: 1.5 }}>
                        {result.analysis.emergencyAdvisory}
                      </p>
                    </div>
                  </div>
                )}

                {/* Analysis Overview Card */}
                <div
                  className="glass-card"
                  style={{
                    padding: '2rem',
                    background: 'rgba(18, 20, 29, 0.65)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '24px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.5rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingBottom: '1.25rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Brain size={22} color="#38bdf8" />
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                        Symptom Analysis Summary
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(200, 205, 225, 0.65)', fontWeight: 600 }}>
                        Urgency Level:
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? 'rgba(244, 63, 94, 0.15)'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? '#fb7185'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? '#fbbf24'
                              : '#34d399',
                          border: `1px solid ${
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? 'rgba(244, 63, 94, 0.3)'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? 'rgba(245, 158, 11, 0.3)'
                              : 'rgba(16, 185, 129, 0.3)'
                          }`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {result.analysis?.urgencyLevel}
                      </span>
                    </div>
                  </div>

                  {/* Identified Symptoms */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                      Identified Symptoms & Key Patterns
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {result.analysis?.identifiedSymptoms?.map((sym, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            color: '#f8fafc',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            padding: '0.35rem 0.85rem',
                            borderRadius: '10px',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                          }}
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Specialties */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(148, 163, 184, 0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>
                      Recommended Medical Specialties
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                      {result.analysis?.recommendedSpecialties?.map((spec, idx) => {
                        const isPrimary = idx === 0;
                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '1.15rem',
                              borderRadius: '16px',
                              backgroundColor: isPrimary ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                              border: isPrimary ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.06)',
                              boxShadow: isPrimary ? '0 0 25px rgba(56, 189, 248, 0.1)' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: isPrimary ? '#38bdf8' : '#ffffff' }}>
                                {spec.specialization}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  backgroundColor: isPrimary ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                                  color: isPrimary ? '#38bdf8' : 'rgba(200, 205, 225, 0.8)',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '999px',
                                  border: isPrimary ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                                }}
                              >
                                {isPrimary ? `${spec.confidence}% Primary Match` : `${spec.confidence}% Related`}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(200, 205, 225, 0.7)', lineHeight: 1.45 }}>
                              {spec.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Recommended Doctors Header & Filter Tabs */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                      Top Recommended Practitioners ({displayedDoctors.length})
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'rgba(200, 205, 225, 0.65)' }}>
                      Ranked by specialization relevance, patient reviews, and schedule availability.
                    </p>
                  </div>

                  {/* Specialty Filter Buttons */}
                  {result.analysis?.recommendedSpecialties?.length > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        padding: '0.25rem',
                        borderRadius: '9999px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        gap: '0.25rem',
                      }}
                    >
                      <button
                        onClick={() => setFilterSpecialty('ALL')}
                        style={{
                          border: filterSpecialty === 'ALL' ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                          padding: '0.35rem 0.85rem',
                          borderRadius: '9999px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: filterSpecialty === 'ALL' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                          color: filterSpecialty === 'ALL' ? '#38bdf8' : 'rgba(200, 205, 225, 0.7)',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        All
                      </button>
                      {result.analysis.recommendedSpecialties.map((spec, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFilterSpecialty(spec.specialization)}
                          style={{
                            border: filterSpecialty === spec.specialization ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                            padding: '0.35rem 0.85rem',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            background: filterSpecialty === spec.specialization ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                            color: filterSpecialty === spec.specialization ? '#38bdf8' : 'rgba(200, 205, 225, 0.7)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {spec.specialization}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Doctor Cards List */}
                {displayedDoctors.length === 0 ? (
                  <div
                    className="glass-card"
                    style={{
                      padding: '3rem 2rem',
                      textAlign: 'center',
                    }}
                  >
                    <Stethoscope size={36} color="rgba(148, 163, 184, 0.5)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <h4 style={{ margin: 0, fontWeight: 700, color: '#ffffff' }}>
                      No doctors currently listed under this filter
                    </h4>
                    <p style={{ margin: '0.35rem 0 1.25rem 0', fontSize: '0.85rem', color: 'rgba(200, 205, 225, 0.65)' }}>
                      Try selecting "All" to view all practitioners matching your symptoms.
                    </p>
                    <SecondaryGlassButton onClick={() => setFilterSpecialty('ALL')} size="sm">
                      View All Matches
                    </SecondaryGlassButton>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {displayedDoctors.map((doc) => {
                      const docName = doc.user?.name || doc.name || 'Medical Specialist';
                      const isExpanded = !!expandedFactors[doc._id];

                      return (
                        <div
                          key={doc._id}
                          className="glass-card"
                          style={{
                            padding: '1.75rem',
                            background: 'rgba(18, 20, 29, 0.65)',
                            backdropFilter: 'blur(20px)',
                            border: doc.isPrimarySpecialty ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: doc.isPrimarySpecialty ? '0 10px 40px rgba(56, 189, 248, 0.1)' : '0 10px 30px rgba(0, 0, 0, 0.3)',
                            borderRadius: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                          }}
                        >
                          {/* Top Row: Doctor Info + Match Score */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between',
                              gap: '1rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                              {/* Avatar */}
                              <div
                                style={{
                                  width: '68px',
                                  height: '68px',
                                  borderRadius: '20px',
                                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                  color: '#38bdf8',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '1.5rem',
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                  border: '2px solid rgba(56, 189, 248, 0.3)',
                                }}
                              >
                                {doc.user?.profileImage || doc.user?.avatar ? (
                                  <img
                                    src={doc.user.profileImage || doc.user.avatar}
                                    alt={docName}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  docName.charAt(0).toUpperCase()
                                )}
                              </div>

                              {/* Details */}
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
                                    {docName}
                                  </h3>
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      padding: '0.2rem 0.6rem',
                                      borderRadius: '999px',
                                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                                      color: '#c084fc',
                                      border: '1px solid rgba(139, 92, 246, 0.3)',
                                    }}
                                  >
                                    {doc.specialization}
                                  </span>
                                  {doc.isPrimarySpecialty && (
                                    <span
                                      style={{
                                        backgroundColor: 'rgba(56, 189, 248, 0.15)',
                                        color: '#38bdf8',
                                        border: '1px solid rgba(56, 189, 248, 0.3)',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        padding: '0.15rem 0.55rem',
                                        borderRadius: '999px',
                                      }}
                                    >
                                      Best Match
                                    </span>
                                  )}
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.25rem',
                                    marginTop: '0.5rem',
                                    flexWrap: 'wrap',
                                    fontSize: '0.85rem',
                                    color: 'rgba(200, 205, 225, 0.7)',
                                  }}
                                >
                                  {/* Star Rating */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <StarRating rating={doc.rating?.average || 0} size={15} />
                                    <span style={{ fontWeight: 700, color: '#ffffff' }}>
                                      {doc.rating?.average ? doc.rating.average.toFixed(1) : 'New'}
                                    </span>
                                    {doc.rating?.count > 0 && (
                                      <span style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '0.78rem' }}>
                                        ({doc.rating.count})
                                      </span>
                                    )}
                                  </div>

                                  {/* Experience */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Award size={15} color="#38bdf8" />
                                    <span>{doc.experienceYears || 0} yrs experience</span>
                                  </div>

                                  {/* Hospital */}
                                  {doc.hospitalAffiliation && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <Building2 size={15} color="rgba(148, 163, 184, 0.6)" />
                                      <span>{doc.hospitalAffiliation}</span>
                                    </div>
                                  )}

                                  {/* Location */}
                                  {doc.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <MapPin size={15} color="rgba(148, 163, 184, 0.6)" />
                                      <span>{doc.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Match Score Badge */}
                            <div
                              style={{
                                textAlign: 'right',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                              }}
                            >
                              <div
                                style={{
                                  background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
                                  color: '#ffffff',
                                  padding: '0.4rem 0.95rem',
                                  borderRadius: '999px',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  boxShadow: '0 4px 16px rgba(14, 165, 233, 0.35)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                              >
                                <Sparkles size={14} />
                                <span>{doc.matchScore}% Match</span>
                              </div>
                              <span style={{ fontSize: '0.78rem', color: 'rgba(200, 205, 225, 0.65)', marginTop: '0.35rem' }}>
                                Fee: ₹{doc.consultationFee || 500}
                              </span>
                            </div>
                          </div>

                          {/* Bio preview if available */}
                          {doc.bio && (
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(200, 205, 225, 0.8)', lineHeight: 1.5 }}>
                              {doc.bio}
                            </p>
                          )}

                          {/* Transparent Match Factors Accordion */}
                          <div
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.02)',
                              borderRadius: '16px',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                              overflow: 'hidden',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => toggleFactors(doc._id)}
                              style={{
                                width: '100%',
                                background: 'transparent',
                                border: 'none',
                                padding: '0.75rem 1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                color: '#38bdf8',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <Info size={15} />
                                <span>Why this match? (View transparent matching factors)</span>
                              </div>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isExpanded && (
                              <div style={{ padding: '0.5rem 1.25rem 1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.82rem', color: 'rgba(200, 205, 225, 0.75)', lineHeight: 1.6 }}>
                                  {doc.matchingFactors?.map((factor, fIdx) => (
                                    <li key={fIdx} style={{ marginBottom: '0.25rem' }}>
                                      {factor}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '0.75rem',
                              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                              paddingTop: '1rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            <SecondaryGlassButton
                              size="sm"
                              to={`/doctors/${doc._id}`}
                            >
                              View Full Profile
                            </SecondaryGlassButton>

                            <PrimaryGlassButton
                              size="sm"
                              onClick={() => handleBookDoctor(doc)}
                              icon={<Calendar size={15} />}
                            >
                              Book Consultation
                            </PrimaryGlassButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Booking Modal with prefilled symptoms capability */}
        {selectedDoctor && (
          <BookingModal
            isOpen={bookingModalOpen}
            doctor={selectedDoctor}
            onClose={() => setBookingModalOpen(false)}
            onSuccess={handleBookingSuccess}
          />
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
        @media (max-width: 860px) {
          .patient-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RecommendDoctorPage;
