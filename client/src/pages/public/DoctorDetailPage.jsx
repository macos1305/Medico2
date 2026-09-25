import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';
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

const FALLBACK_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#e0f2f1"/><circle cx="100" cy="78" r="38" fill="#80cbc4"/><ellipse cx="100" cy="170" rx="60" ry="45" fill="#80cbc4"/><text x="100" y="88" text-anchor="middle" fill="white" font-size="36" font-family="Arial" font-weight="bold">👨‍⚕️</text></svg>`);

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  if (loading) {
    return <LoadingSpinner text="Retrieving physician profile..." fullScreen />;
  }

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Doctor Profile Not Found</h2>
        <p style={{ color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
          The requested physician profile could not be located in our verified directory.
        </p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} />
          Return to Doctors Directory
        </Link>
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
  const availability = doctor.availability || {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hours: '09:00 AM - 05:00 PM',
    slotDurationMinutes: 30,
  };
  const languages = doctor.languages?.length > 0 ? doctor.languages : ['English'];
  const gender = doctor.gender || '';

  const avgRating = doctor.rating?.average || 0;
  const ratingCount = doctor.rating?.count || 0;

  const isPatient = isAuthenticated && role === 'PATIENT';

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back Link */}
        <Link
          to="/doctors"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--slate-500)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBottom: '1.5rem',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} />
          Back to Doctor Directory
        </Link>

        {/* ── Doctor Header Card ─────────────────────────────────────────── */}
        <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                width: 140,
                height: 140,
                borderRadius: 24,
                backgroundColor: 'var(--primary-50)',
                overflow: 'hidden',
                flexShrink: 0,
                border: '3px solid var(--primary-200)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <img
                src={imgError || !profileImg ? FALLBACK_AVATAR : profileImg}
                alt={doctorName}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-doctor">{specialization}</span>
                <span className="badge badge-approved">
                  <CheckCircle2 size={12} /> Verified
                </span>
                {gender && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--slate-100)',
                      color: 'var(--slate-600)',
                    }}
                  >
                    <User size={11} />
                    {gender}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
                {doctorName}
              </h1>

              {/* Star rating in header */}
              {ratingCount > 0 && (
                <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StarRating value={avgRating} readOnly size={18} showValue count={ratingCount} />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  color: 'var(--slate-600)',
                  fontSize: 'var(--text-sm)',
                  flexWrap: 'wrap',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={15} color="var(--slate-400)" />
                  <span>{hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={15} color="var(--slate-400)" />
                  <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={15} color="var(--primary-600)" />
                  <span>{experienceYears} Yrs Experience</span>
                </div>
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--primary-50)',
                  border: '1px solid var(--primary-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.4rem 0.9rem',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 700,
                  color: 'var(--primary-800)',
                }}
              >
                <IndianRupee size={14} />
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
            gap: '1.75rem',
            alignItems: 'start',
            marginBottom: '1.75rem',
          }}
          className="doctor-detail-layout"
        >
          {/* Left: Bio + Qualifications + Languages */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* About */}
            <div className="card">
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FileText size={18} color="var(--primary-600)" />
                About the Physician
              </h3>
              <p style={{ color: 'var(--slate-700)', lineHeight: 1.75, fontSize: 'var(--text-sm)' }}>{bio}</p>
            </div>

            {/* Qualifications */}
            <div className="card">
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <GraduationCap size={18} color="var(--primary-600)" />
                Education & Credentials
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {qualifications.map((q, idx) => (
                  <li
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}
                  >
                    <CheckCircle2 size={15} color="var(--primary-600)" />
                    <span>{q}</span>
                  </li>
                ))}
                {doctor.licenseNumber && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}>
                    <ShieldCheck size={15} color="var(--primary-600)" />
                    <span>Medical License: <code style={{ background: 'var(--slate-100)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>{doctor.licenseNumber}</code></span>
                  </li>
                )}
              </ul>
            </div>

            {/* Professional Information */}
            <div className="card">
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Stethoscope size={18} color="var(--primary-600)" />
                Professional Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Specialization
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>{specialization}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Experience
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>{experienceYears} Years</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Hospital / Clinic
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>{hospital}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                    Consultation Fee
                  </div>
                  <div style={{ fontWeight: 600, color: 'var(--primary-700)', fontSize: 'var(--text-sm)' }}>₹{fee} per visit</div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="card">
              <h3
                style={{
                  fontSize: 'var(--text-lg)',
                  marginBottom: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Globe size={18} color="var(--primary-600)" />
                Languages Spoken
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {languages.map((lang, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.3rem 0.75rem',
                      backgroundColor: 'var(--primary-50)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: 'var(--primary-700)',
                      border: '1px solid var(--primary-100)',
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Availability + Book */}
          <div className="card" style={{ position: 'sticky', top: 90 }}>
            <h3
              style={{
                fontSize: 'var(--text-lg)',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={18} color="var(--primary-600)" />
              Clinical Availability
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Consultation Days
              </span>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {availability.days?.map((day, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--primary-50)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 700,
                      color: 'var(--primary-700)',
                      border: '1px solid var(--primary-100)',
                    }}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                Operating Hours
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>
                <Clock size={15} color="var(--primary-600)" />
                <span>{availability.hours || '09:00 AM – 05:00 PM'}</span>
              </div>
            </div>

            {/* Fee Highlight */}
            <div
              style={{
                backgroundColor: 'var(--primary-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.25rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Consultation Fee
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)' }}>
                ₹{fee}
              </div>
            </div>

            {isPatient ? (
              <button
                onClick={() => setBookingModalOpen(true)}
                className="btn btn-primary btn-block btn-lg"
              >
                <Calendar size={18} />
                Book Appointment
              </button>
            ) : !isAuthenticated ? (
              <Link to="/login" state={{ from: { pathname: `/doctors/${id}` } }} className="btn btn-primary btn-block btn-lg">
                <Calendar size={18} />
                Sign In to Book
              </Link>
            ) : null}
          </div>
        </div>

        {/* ── Patient Reviews Section ────────────────────────────────────── */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingBottom: '0.875rem',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <MessageSquare size={20} color="var(--primary-600)" />
            Patient Reviews
            {ratingCount > 0 && (
              <span className="badge badge-patient" style={{ fontSize: '0.65rem', marginLeft: '0.25rem' }}>
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
