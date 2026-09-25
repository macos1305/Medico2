import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Heart,
  AlertTriangle,
  FileText,
  Activity,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { SecondaryGlassButton } from '../common/buttons';

const PatientDetailsModal = ({ isOpen, appointment, onClose }) => {
  if (!isOpen || !appointment) return null;

  const patient = appointment.patient;
  const user = patient?.user;

  // Calculate age from dateOfBirth if available
  const getAge = (dobString) => {
    if (!dobString) return null;
    const dob = new Date(dobString);
    if (isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(patient?.dateOfBirth);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1.5rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          backgroundColor: '#ffffff',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--slate-400)',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-patient">Patient Dossier</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)' }}>
              Appointment #{appointment._id?.slice(-6).toUpperCase()}
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
            Clinical Consultation Details
          </h2>
        </div>

        {/* Patient Profile Snapshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
              {user?.name || 'Patient'}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.8rem' }}>
              {patient?.gender && (
                <span className="badge badge-secondary" style={{ textTransform: 'capitalize' }}>
                  {patient.gender.toLowerCase()}
                </span>
              )}
              {age !== null && (
                <span className="badge badge-secondary">{age} Years Old</span>
              )}
              {patient?.bloodGroup && patient.bloodGroup !== 'UNKNOWN' && (
                <span
                  style={{
                    fontWeight: 700,
                    color: 'var(--accent-rose)',
                    backgroundColor: '#ffe4e6',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                  }}
                >
                  Blood: {patient.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem' }}>
            Contact & Address
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-700)' }}>
              <Mail size={16} color="var(--primary-600)" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-700)' }}>
              <Phone size={16} color="var(--primary-600)" />
              <span>{user?.phone || 'No phone provided'}</span>
            </div>
            {patient?.address && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-700)' }}>
                <MapPin size={16} color="var(--primary-600)" />
                <span>{patient.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Medical Alerts & Emergency Contact */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontWeight: 700, marginBottom: '0.4rem' }}>
            <AlertTriangle size={16} />
            <span>Documented Allergies</span>
          </div>
          <div style={{ color: '#b45309' }}>
            {patient?.allergies?.length > 0
              ? patient.allergies.join(', ')
              : 'No known allergies documented.'}
          </div>

          {patient?.emergencyContact?.name && (
            <div style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid #fef3c7', color: '#92400e' }}>
              <strong>Emergency Contact:</strong> {patient.emergencyContact.name}{' '}
              {patient.emergencyContact.relationship && `(${patient.emergencyContact.relationship})`}{' '}
              - {patient.emergencyContact.phone}
            </div>
          )}
        </div>

        {/* Appointment Specifics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="card" style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Date</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appointment.date}</div>
            </div>
            <div className="card" style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Time Slot</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
              Chief Complaint / Reason
            </span>
            <div style={{ color: 'var(--slate-900)', fontWeight: 600, fontSize: '0.95rem' }}>
              {appointment.reason}
            </div>
          </div>

          {appointment.symptoms && (
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>
                Reported Symptoms & Notes
              </span>
              <div style={{ color: 'var(--slate-700)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {appointment.symptoms}
              </div>
            </div>
          )}

          {appointment.cancellationReason && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#ffe4e6',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--accent-rose)',
              }}
            >
              <strong>Cancellation Note:</strong> {appointment.cancellationReason}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'right', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <SecondaryGlassButton onClick={onClose}>
            Close Dossier
          </SecondaryGlassButton>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
