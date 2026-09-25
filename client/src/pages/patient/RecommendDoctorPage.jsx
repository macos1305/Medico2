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

  // Filter doctors if user selects a specific specialty from the recommended list
  const displayedDoctors = (result?.doctors || []).filter((doc) => {
    if (filterSpecialty === 'ALL') return true;
    return doc.specialization === filterSpecialty;
  });

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '85vh', backgroundColor: 'var(--slate-50)' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 4px 10px rgba(13, 148, 136, 0.25)',
                  }}
                >
                  <Sparkles size={20} />
                </div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                  AI Doctor Recommendation
                </h1>
              </div>
              <p style={{ margin: 0, color: 'var(--slate-500)', fontSize: '0.95rem' }}>
                Describe your symptoms in your own words to discover relevant medical specialties and top-rated verified practitioners.
              </p>
            </div>

            {/* Medical Disclaimer Banner */}
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fef3c7',
                borderLeft: '4px solid #f59e0b',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              <AlertTriangle size={20} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.88rem', fontWeight: 700, color: '#92400e' }}>
                  Doctor Discovery Tool Only — Not a Medical Diagnosis
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#78350f', lineHeight: 1.45 }}>
                  This tool uses natural language pattern matching to identify relevant medical specializations and assist you in selecting an appropriate healthcare provider. It does not provide clinical diagnoses, medical assessments, or treatment plans. If you are experiencing a medical emergency, call 911 or visit your nearest emergency room immediately.
                </p>
              </div>
            </div>

            {/* Input Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <form onSubmit={handleAnalyze}>
                <label
                  htmlFor="symptoms-input"
                  style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--slate-800)',
                    marginBottom: '0.5rem',
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
                    padding: '0.85rem 1rem',
                    fontSize: '0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    lineHeight: 1.5,
                    resize: 'vertical',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--primary-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-subtle)')}
                />

                {/* Sample Prompt Pills */}
                <div style={{ marginTop: '0.85rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-500)', display: 'block', marginBottom: '0.4rem' }}>
                    Try common examples:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                    {SAMPLE_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePromptClick(prompt)}
                        style={{
                          background: 'var(--slate-100)',
                          border: '1px solid var(--slate-200)',
                          borderRadius: '999px',
                          padding: '0.3rem 0.75rem',
                          fontSize: '0.78rem',
                          color: 'var(--slate-700)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-50)';
                          e.currentTarget.style.borderColor = 'var(--primary-200)';
                          e.currentTarget.style.color = 'var(--primary-700)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--slate-100)';
                          e.currentTarget.style.borderColor = 'var(--slate-200)';
                          e.currentTarget.style.color = 'var(--slate-700)';
                        }}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Action */}
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  {result && (
                    <button
                      type="button"
                      onClick={() => {
                        setSymptoms('');
                        setResult(null);
                      }}
                      className="btn btn-outline"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading || !symptoms.trim()}
                    className="btn btn-primary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.65rem 1.4rem',
                      fontWeight: 700,
                    }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={17} className="animate-spin" />
                        <span>Analyzing Symptoms...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={17} />
                        <span>Find Matching Specialists</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Loading Indicator */}
            {loading && (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.15), rgba(20, 184, 166, 0.25))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    color: 'var(--primary-600)',
                    animation: 'pulse 1.8s infinite',
                  }}
                >
                  <Activity size={30} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-800)', margin: '0 0 0.4rem 0' }}>
                  Analyzing Your Health Description
                </h3>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', margin: 0 }}>
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
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fee2e2',
                      borderLeft: '4px solid #ef4444',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                    }}
                  >
                    <AlertTriangle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <h4 style={{ margin: '0 0 0.35rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#991b1b' }}>
                        Urgent Medical Notice
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#7f1d1d', lineHeight: 1.5 }}>
                        {result.analysis.emergencyAdvisory}
                      </p>
                    </div>
                  </div>
                )}

                {/* Analysis Overview Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.75rem',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '1.25rem',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '1rem',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Brain size={20} color="var(--primary-600)" />
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                        Symptom Analysis Summary
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                        Urgency Level:
                      </span>
                      <span
                        style={{
                          backgroundColor:
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? 'var(--danger-50)'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? 'var(--warning-50)'
                              : 'var(--success-50)',
                          color:
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? 'var(--danger-700)'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? 'var(--warning-700)'
                              : 'var(--success-700)',
                          border: `1px solid ${
                            result.analysis?.urgencyLevel === 'HIGH'
                              ? 'var(--danger-200)'
                              : result.analysis?.urgencyLevel === 'MEDIUM'
                              ? 'var(--warning-200)'
                              : 'var(--success-200)'
                          }`,
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                        }}
                      >
                        {result.analysis?.urgencyLevel}
                      </span>
                    </div>
                  </div>

                  {/* Identified Symptoms */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.45rem' }}>
                      Identified Symptoms & Key Patterns
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {result.analysis?.identifiedSymptoms?.map((sym, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: 'var(--slate-100)',
                            color: 'var(--slate-800)',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            padding: '0.25rem 0.65rem',
                            borderRadius: '6px',
                            border: '1px solid var(--slate-200)',
                          }}
                        >
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Specialties */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      Recommended Medical Specialties
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                      {result.analysis?.recommendedSpecialties?.map((spec, idx) => {
                        const isPrimary = idx === 0;
                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '1rem',
                              borderRadius: 'var(--radius-md)',
                              backgroundColor: isPrimary ? 'rgba(13, 148, 136, 0.05)' : 'var(--slate-50)',
                              border: isPrimary ? '1.5px solid var(--primary-300)' : '1px solid var(--border-subtle)',
                              position: 'relative',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: isPrimary ? 'var(--primary-800)' : 'var(--slate-800)' }}>
                                {spec.specialization}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  backgroundColor: isPrimary ? 'var(--primary-600)' : 'var(--slate-200)',
                                  color: isPrimary ? '#ffffff' : 'var(--slate-700)',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '999px',
                                }}
                              >
                                {isPrimary ? `${spec.confidence}% Primary Match` : `${spec.confidence}% Related`}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--slate-600)', lineHeight: 1.4 }}>
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
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      Top Recommended Practitioners ({displayedDoctors.length})
                    </h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      Ranked by specialization relevance, verified reviews, clinical experience, and schedule availability.
                    </p>
                  </div>

                  {/* Specialty Filter Buttons */}
                  {result.analysis?.recommendedSpecialties?.length > 1 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setFilterSpecialty('ALL')}
                        style={{
                          border: 'none',
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: filterSpecialty === 'ALL' ? 'var(--primary-600)' : '#ffffff',
                          color: filterSpecialty === 'ALL' ? '#ffffff' : 'var(--slate-600)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        All
                      </button>
                      {result.analysis.recommendedSpecialties.map((spec, idx) => (
                        <button
                          key={idx}
                          onClick={() => setFilterSpecialty(spec.specialization)}
                          style={{
                            border: 'none',
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            background: filterSpecialty === spec.specialization ? 'var(--primary-600)' : '#ffffff',
                            color: filterSpecialty === spec.specialization ? '#ffffff' : 'var(--slate-600)',
                            border: '1px solid var(--border-subtle)',
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
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Stethoscope size={36} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem auto' }} />
                    <h4 style={{ margin: 0, fontWeight: 700, color: 'var(--slate-800)' }}>
                      No doctors currently listed under this filter
                    </h4>
                    <p style={{ margin: '0.35rem 0 1rem 0', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      Try selecting "All" to view all practitioners matching your symptoms.
                    </p>
                    <button onClick={() => setFilterSpecialty('ALL')} className="btn btn-secondary btn-sm">
                      View All Matches
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {displayedDoctors.map((doc) => {
                      const docName = doc.user?.name || doc.name || 'Medical Specialist';
                      const isExpanded = !!expandedFactors[doc._id];

                      return (
                        <div
                          key={doc._id}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            border: doc.isPrimarySpecialty ? '1.5px solid var(--primary-300)' : '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            transition: 'all 0.2s ease',
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
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: 'var(--radius-md)',
                                  backgroundColor: 'var(--primary-100)',
                                  color: 'var(--primary-700)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '1.4rem',
                                  flexShrink: 0,
                                  overflow: 'hidden',
                                  border: '2px solid var(--primary-200)',
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                                    {docName}
                                  </h3>
                                  <span className="badge badge-doctor" style={{ fontSize: '0.72rem' }}>
                                    {doc.specialization}
                                  </span>
                                  {doc.isPrimarySpecialty && (
                                    <span
                                      style={{
                                        backgroundColor: 'var(--primary-50)',
                                        color: 'var(--primary-700)',
                                        border: '1px solid var(--primary-200)',
                                        fontSize: '0.68rem',
                                        fontWeight: 800,
                                        padding: '0.12rem 0.45rem',
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
                                    color: 'var(--slate-600)',
                                  }}
                                >
                                  {/* Star Rating */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <StarRating rating={doc.rating?.average || 0} size={15} />
                                    <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                                      {doc.rating?.average ? doc.rating.average.toFixed(1) : 'New'}
                                    </span>
                                    {doc.rating?.count > 0 && (
                                      <span style={{ color: 'var(--slate-400)', fontSize: '0.78rem' }}>
                                        ({doc.rating.count})
                                      </span>
                                    )}
                                  </div>

                                  {/* Experience */}
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Award size={15} color="var(--primary-600)" />
                                    <span>{doc.experienceYears || 0} yrs experience</span>
                                  </div>

                                  {/* Hospital */}
                                  {doc.hospitalAffiliation && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <Building2 size={15} color="var(--slate-400)" />
                                      <span>{doc.hospitalAffiliation}</span>
                                    </div>
                                  )}

                                  {/* Location */}
                                  {doc.location && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                      <MapPin size={15} color="var(--slate-400)" />
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
                                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                                  color: '#ffffff',
                                  padding: '0.35rem 0.85rem',
                                  borderRadius: '999px',
                                  fontSize: '0.85rem',
                                  fontWeight: 800,
                                  boxShadow: '0 2px 6px rgba(13, 148, 136, 0.3)',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                }}
                              >
                                <Sparkles size={14} />
                                <span>{doc.matchScore}% Match</span>
                              </div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
                                Fee: ₹{doc.consultationFee || 500}
                              </span>
                            </div>
                          </div>

                          {/* Bio preview if available */}
                          {doc.bio && (
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.45 }}>
                              {doc.bio}
                            </p>
                          )}

                          {/* Transparent Match Factors Accordion */}
                          <div
                            style={{
                              backgroundColor: 'var(--slate-50)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-subtle)',
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
                                padding: '0.65rem 0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                color: 'var(--primary-700)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Info size={14} />
                                <span>Why this match? (View transparent matching factors)</span>
                              </div>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            {isExpanded && (
                              <div style={{ padding: '0.5rem 1rem 0.85rem 1rem', borderTop: '1px solid var(--border-subtle)' }}>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--slate-700)', lineHeight: 1.55 }}>
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
                              borderTop: '1px solid var(--border-subtle)',
                              paddingTop: '0.85rem',
                              flexWrap: 'wrap',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => navigate(`/doctors/${doc._id}`)}
                              className="btn btn-outline btn-sm"
                            >
                              View Full Profile
                            </button>

                            <button
                              type="button"
                              onClick={() => handleBookDoctor(doc)}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                            >
                              <Calendar size={15} />
                              <span>Book Consultation</span>
                            </button>
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
