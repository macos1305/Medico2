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
        backgroundColor: 'rgba(5, 6, 10, 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
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
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.25rem',
          borderRadius: '28px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(18, 20, 29, 0.9)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
            color: 'rgba(148, 163, 184, 0.7)',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Patient Dossier
            </span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.6)' }}>
              Appointment #{appointment._id?.slice(-6).toUpperCase()}
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Clinical Consultation Details
          </h2>
        </div>

        {/* Patient Profile Snapshot */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.15rem',
            padding: '1.15rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '18px',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              fontWeight: 800,
              flexShrink: 0,
              border: '2px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
              {user?.name || 'Patient'}
            </h3>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.8rem' }}>
              {patient?.gender && (
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: 'rgba(200, 205, 225, 0.8)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {patient.gender.toLowerCase()}
                </span>
              )}
              {age !== null && (
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    color: 'rgba(200, 205, 225, 0.8)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                  }}
                >
                  {age} Years Old
                </span>
              )}
              {patient?.bloodGroup && patient.bloodGroup !== 'UNKNOWN' && (
                <span
                  style={{
                    fontWeight: 700,
                    color: '#fb7185',
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
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
          <h4 style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Contact & Address
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <Mail size={16} color="#38bdf8" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <Phone size={16} color="#38bdf8" />
              <span>{user?.phone || 'No phone provided'}</span>
            </div>
            {patient?.address && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(200, 205, 225, 0.85)' }}>
                <MapPin size={16} color="#38bdf8" />
                <span>
                  {typeof patient.address === 'object'
                    ? [patient.address.street, patient.address.city, patient.address.state, patient.address.zipCode].filter(Boolean).join(', ')
                    : patient.address}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Medical Alerts & Emergency Contact */}
        <div
          style={{
            padding: '1.15rem',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.4rem' }}>
            <AlertTriangle size={16} />
            <span>Documented Allergies</span>
          </div>
          <div style={{ color: 'rgba(253, 230, 138, 0.9)' }}>
            {patient?.allergies?.length > 0
              ? patient.allergies.join(', ')
              : 'No known allergies documented.'}
          </div>

          {patient?.emergencyContact?.name && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(245, 158, 11, 0.2)', color: 'rgba(253, 230, 138, 0.85)' }}>
              <strong style={{ color: '#fbbf24' }}>Emergency Contact:</strong> {patient.emergencyContact.name}{' '}
              {patient.emergencyContact.relationship && `(${patient.emergencyContact.relationship})`}{' '}
              - {patient.emergencyContact.phone}
            </div>
          )}
        </div>

        {/* Appointment Specifics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff', marginTop: '0.2rem' }}>
                {appointment.date ? new Date(appointment.date).toLocaleDateString() : '—'}
              </div>
            </div>
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Time Slot</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8', marginTop: '0.2rem' }}>
                {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
              Chief Complaint / Reason
            </span>
            <div style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
              {appointment.reason}
            </div>
          </div>

          {appointment.symptoms && (
            <div>
              <span style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
                Reported Symptoms & Notes
              </span>
              <div style={{ color: 'rgba(200, 205, 225, 0.8)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {appointment.symptoms}
              </div>
            </div>
          )}

          {appointment.cancellationReason && (
            <div
              style={{
                padding: '0.85rem',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: '#fb7185',
              }}
            >
              <strong>Cancellation Note:</strong> {appointment.cancellationReason}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'right', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <SecondaryGlassButton onClick={onClose} size="sm">
            Close Dossier
          </SecondaryGlassButton>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
