import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import doctorService from '../../services/doctorService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import BookingModal from '../../components/appointment/BookingModal';
import {
  Stethoscope,
  Award,
  Building2,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  GraduationCap,
  FileText,
  ShieldCheck,
  Info,
} from 'lucide-react';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const res = await doctorService.getById(id);
        if (res.data) {
          setDoctor(res.data);
        }
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
  const bio = doctor.bio || 'Board-certified practitioner dedicated to patient-centered clinical care and evidence-based medicine.';
  const qualifications = doctor.qualifications?.length > 0
    ? doctor.qualifications
    : ['MD (Doctor of Medicine)', 'Board Certified Specialist'];
  const availability = doctor.availability || {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hours: '09:00 AM - 05:00 PM',
    slotDurationMinutes: 30,
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Back Link */}
        <Link
          to="/doctors"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--slate-600)',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.75rem',
          }}
        >
          <ArrowLeft size={16} />
          Back to Doctor Directory
        </Link>

        {/* Doctor Header Card */}
        <div className="card glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '24px',
                backgroundColor: 'var(--primary-100)',
                color: 'var(--primary-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '2.5rem',
                overflow: 'hidden',
                flexShrink: 0,
                border: '3px solid var(--primary-200)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={doctorName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                doctorName.replace('Dr. ', '').charAt(0) || 'D'
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span className="badge badge-doctor">{specialization}</span>
                <span className="badge badge-approved">
                  <CheckCircle2 size={12} /> Verified Specialist
                </span>
              </div>

              <h1 style={{ fontSize: '2.1rem', color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
                {doctorName}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--slate-600)', fontSize: '0.925rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Building2 size={16} color="var(--slate-400)" />
                  <span>{hospital}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--slate-400)" />
                  <span>{location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Award size={16} color="var(--primary-600)" />
                  <span>{experienceYears} Years Experience</span>
                </div>
              </div>

              {/* Consultation Fee Pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    backgroundColor: 'var(--primary-50)',
                    border: '1px solid var(--primary-200)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.4rem 0.85rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--primary-800)',
                  }}
                >
                  Consultation Fee: ${fee}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-col Details & Booking */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr minmax(300px, 360px)',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="doctor-detail-layout"
        >
          {/* Left Column: About & Qualifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* About / Bio */}
            <div className="card">
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FileText size={20} color="var(--primary-600)" />
                About the Physician
              </h3>
              <p style={{ color: 'var(--slate-700)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                {bio}
              </p>
            </div>

            {/* Qualifications & Credentials */}
            <div className="card">
              <h3
                style={{
                  fontSize: '1.2rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <GraduationCap size={20} color="var(--primary-600)" />
                Education & Credentials
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {qualifications.map((q, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                    <CheckCircle2 size={16} color="var(--primary-600)" />
                    <span>{q}</span>
                  </li>
                ))}
                {doctor.licenseNumber && (
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.925rem', color: 'var(--slate-700)' }}>
                    <ShieldCheck size={16} color="var(--primary-600)" />
                    <span>Medical License: <code>{doctor.licenseNumber}</code></span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column: Availability & Book Appointment */}
          <div className="card" style={{ position: 'sticky', top: '90px' }}>
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={20} color="var(--primary-600)" />
              Clinical Availability
            </h3>

            {/* Working days */}
            <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                Consultation Days
              </span>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {availability.days?.map((day, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '0.2rem 0.5rem',
                      backgroundColor: 'var(--slate-100)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--slate-700)',
                    }}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
            </div>

            {/* Working hours */}
            <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                Operating Hours
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                <Clock size={16} color="var(--primary-600)" />
                <span>{availability.hours || '09:00 AM - 05:00 PM'}</span>
              </div>
            </div>

            {/* Book Appointment Button */}
            <button
              onClick={() => setBookingModalOpen(true)}
              className="btn btn-primary btn-block btn-lg"
              style={{ marginBottom: '1rem', height: '48px' }}
            >
              <Calendar size={18} />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Booking Modal */}
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
