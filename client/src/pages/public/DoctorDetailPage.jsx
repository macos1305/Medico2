import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';
import availabilityService from '../../services/availabilityService';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import BookingModal from '../../components/appointment/BookingModal';
import StarRating from '../../components/review/StarRating';
import ReviewList from '../../components/review/ReviewList';
import {
  Stethoscope,
  Award,
  Building2,
  IndianRupee,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  FileText,
  ShieldCheck,
  MessageSquare,
  Globe,
  User,
  Star,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton } from '../../components/common/buttons';
import DoctorAvatar from '../../components/common/DoctorAvatar';


const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Real availability fetched from MongoDB via API
  const [availabilityData, setAvailabilityData] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getById(id);
        if (res.data) setDoctor(res.data);
      } catch (err) {
        console.error('Failed to load doctor profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Fetch real availability from the Availability collection
  useEffect(() => {
    if (!id) return;
    const fetchAvailability = async () => {
      setAvailabilityLoading(true);
      setAvailabilityError(null);
      try {
        const res = await availabilityService.getDoctorAvailability(id);
        setAvailabilityData(res.data);
      } catch (err) {
        console.error('Failed to load availability:', err);
        setAvailabilityError('Unable to load availability.');
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchAvailability();
  }, [id]);


  if (loading) {
    return <LoadingSpinner text="Retrieving physician profile..." fullScreen />;
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>Doctor Profile Not Found</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: '1.5rem' }}>
          The requested physician profile could not be located in our verified directory.
        </p>
        <PrimaryGlassButton to="/doctors" icon={<ArrowLeft size={16} />}>
          Return to Doctors Directory
        </PrimaryGlassButton>
      </div>
    );
  }

  const doctorName = doctor.user?.name || doctor.name || 'Medical Specialist';
  const profileImg = doctor.user?.profileImage || doctor.user?.avatar || doctor.profileImage;
  const specialization = doctor.specialization || 'General Practice';
  const experienceYears = doctor.experienceYears || 0;
  const fee = doctor.consultationFee || 50;
  const hospital = doctor.hospitalAffiliation || 'Independent Medical Practice';
  const location = doctor.location || doctor.hospitalAffiliation || 'Main Medical Center';
  const bio =
    doctor.bio ||
    'Board-certified practitioner dedicated to patient-centered clinical care and evidence-based medicine.';
  const qualifications =
    doctor.qualifications?.length > 0
      ? doctor.qualifications
      : ['MD (Doctor of Medicine)', 'Board Certified Specialist'];
  const languages = doctor.languages?.length > 0 ? doctor.languages : ['English'];
  const gender = doctor.gender || '';

  const avgRating = doctor.rating?.average || 0;
  const ratingCount = doctor.rating?.count || 0;

  const isPatient = isAuthenticated && role === 'PATIENT';

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0 4rem', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <GlassButton
            to="/doctors"
            variant="ghost"
            size="small"
            icon={<ArrowLeft size={16} />}
          >
            Back to Doctor Directory
          </GlassButton>
        </div>

        {/* ── Doctor Header Card ─────────────────────────────────────────── */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            marginBottom: '2rem',
            borderRadius: '20px',
            background: 'rgba(18, 20, 29, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 20,
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                overflow: 'hidden',
                flexShrink: 0,
                border: '2px solid rgba(59, 130, 246, 0.4)',
                boxShadow: '0 0 25px rgba(59, 130, 246, 0.25)',
              }}
            >
              <DoctorAvatar
                src={profileImg}
                name={doctorName}
                fullWidth
                borderRadius="18px"
                objectPosition="center top"
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                }}>{specialization}</span>
                <span style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <CheckCircle2 size={12} /> Verified
                </span>
                {gender && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <User size={11} />
                    {gender}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                {doctorName}
              </h1>

              {/* Star rating in header */}
              {ratingCount > 0 && (
                <div style={{ marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarRating value={avgRating} readOnly size={18} showValue count={ratingCount} />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  color: 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.875rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={15} color="#818cf8" />
                  <span>{hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="#818cf8" />
                  <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={15} color="#38bdf8" />
                  <span>{experienceYears} Yrs Experience</span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '10px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#60a5fa',
                }}
              >
                <IndianRupee size={15} />
                Consultation Fee: ₹{fee}
              </div>
            </div>
          </div>
        </div>

        {/* ── 2-col: Details + Booking ───────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr minmax(280px, 340px)',
            gap: '2rem',
            alignItems: 'start',
            marginBottom: '2rem',
          }}
          className="doctor-detail-layout"
        >
          {/* Left: Bio + Qualifications + Languages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* About */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', background: 'rgba(18, 20, 29, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FileText size={18} color="#60a5fa" />
                About the Physician
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.75, fontSize: '0.9rem', margin: 0 }}>{bio}</p>
            </div>

            {/* Qualifications */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', background: 'rgba(18, 20, 29, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <GraduationCap size={18} color="#60a5fa" />
                Education & Credentials
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {qualifications.map((q, idx) => (
                  <li
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)' }}
                  >
                    <CheckCircle2 size={16} color="#34d399" />
                    <span>{q}</span>
                  </li>
                ))}
                {doctor.licenseNumber && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    <ShieldCheck size={16} color="#60a5fa" />
                    <span>Medical License: <code style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.5rem', borderRadius: 6, color: '#93c5fd' }}>{doctor.licenseNumber}</code></span>
                  </li>
                )}
              </ul>
            </div>

            {/* Professional Information */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', background: 'rgba(18, 20, 29, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Stethoscope size={18} color="#60a5fa" />
                Professional Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Specialization
                  </div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{specialization}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Experience
                  </div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{experienceYears} Years</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Hospital / Clinic
                  </div>
                  <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{hospital}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Consultation Fee
                  </div>
                  <div style={{ fontWeight: 600, color: '#60a5fa', fontSize: '0.9rem' }}>₹{fee} per visit</div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="glass-card" style={{ padding: '1.75rem', borderRadius: '16px', background: 'rgba(18, 20, 29, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Globe size={18} color="#60a5fa" />
                Languages Spoken
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {languages.map((lang, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.35rem 0.85rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '9999px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#93c5fd',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Availability + Book */}
          <div
            className="glass-card"
            style={{
              position: 'sticky',
              top: 100,
              padding: '1.75rem',
              borderRadius: '20px',
              background: 'rgba(18, 20, 29, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.12)',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.85rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Calendar size={18} color="#60a5fa" />
              Clinical Availability
            </h3>


            {availabilityLoading ? (
              <div style={{ padding: '1rem 0', textAlign: 'center' }}>
                <div className="spinner spinner-primary" style={{ width: '22px', height: '22px', margin: '0 auto' }} />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Loading schedule...</p>
              </div>
            ) : availabilityError ? (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', color: '#fca5a5', fontSize: '0.83rem' }}>
                {availabilityError}
                <button
                  onClick={() => {
                    setAvailabilityError(null);
                    setAvailabilityLoading(true);
                    availabilityService.getDoctorAvailability(id)
                      .then(r => { setAvailabilityData(r.data); setAvailabilityLoading(false); })
                      .catch(() => { setAvailabilityError('Unable to load availability.'); setAvailabilityLoading(false); });
                  }}
                  style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: '#93c5fd', cursor: 'pointer', fontSize: '0.83rem', textDecoration: 'underline' }}
                >
                  Try Again
                </button>
              </div>
            ) : availabilityData && availabilityData.isActive !== false ? (
              <>
                <div style={{ marginBottom: '1.25rem' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Consultation Days
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {(availabilityData.workingDays || []).map((day, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.25rem 0.55rem',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#93c5fd',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                      >
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Operating Hours
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#ffffff', fontSize: '0.875rem' }}>
                    <Clock size={15} color="#60a5fa" />
                    <span>{availabilityData.startTime} – {availabilityData.endTime}</span>
                  </div>
                  {availabilityData.breakStartTime && availabilityData.breakEndTime && (
                    <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', marginLeft: '1.45rem' }}>
                      Break: {availabilityData.breakStartTime} – {availabilityData.breakEndTime}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Slot Duration
                  </span>
                  <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.875rem' }}>
                    {availabilityData.slotDuration} minutes per slot
                  </span>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: '1.5rem', padding: '0.85rem', backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', color: '#fbbf24', fontSize: '0.83rem' }}>
                No availability has been set for this doctor yet.
              </div>
            )}

            {/* Fee Highlight */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Consultation Fee
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>
                ₹{fee}
              </div>
            </div>

            {isPatient ? (
              <GlassButton
                variant="primary"
                size="large"
                fullWidth
                icon={<Calendar size={18} />}
                onClick={() => setBookingModalOpen(true)}
              >
                Book Appointment
              </GlassButton>
            ) : !isAuthenticated ? (
              <GlassButton
                to="/login"
                state={{ from: { pathname: `/doctors/${id}` } }}
                variant="primary"
                size="large"
                fullWidth
                icon={<Calendar size={18} />}
              >
                Sign In to Book
              </GlassButton>
            ) : null}
          </div>
        </div>

        {/* ── Patient Reviews Section ────────────────────────────────────── */}
        <div
          className="glass-card"
          style={{
            padding: '2rem',
            borderRadius: '20px',
            background: 'rgba(18, 20, 29, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <MessageSquare size={20} color="#60a5fa" />
            Patient Reviews
            {ratingCount > 0 && (
              <span style={{
                fontSize: '0.72rem',
                marginLeft: '0.5rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}>
                {ratingCount} review{ratingCount !== 1 ? 's' : ''}
              </span>
            )}
          </h2>

          <ReviewList doctorId={doctor._id} summary={doctor.rating} />
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        doctor={doctor}
        onClose={() => setBookingModalOpen(false)}
        onSuccess={() => navigate('/patient/appointments')}
      />

      <style>{`
        @media (max-width: 800px) {
          .doctor-detail-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorDetailPage;
