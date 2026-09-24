import React from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  UserCheck,
  UserX,
  Clock,
  MapPin,
  FileText,
} from 'lucide-react';

const PatientDetailsModal = ({
  isOpen,
  patientData,
  onClose,
  onToggleStatus,
  actionLoading,
}) => {
  if (!isOpen || !patientData) return null;

  const user = patientData.user;
  const isActive = user?.isActive !== false;
  const appointments = patientData.appointments || [];

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
          maxWidth: '620px',
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

        {/* Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span className="badge badge-admin">Patient Dossier</span>
            <span className={`badge ${isActive ? 'badge-approved' : 'badge-rejected'}`}>
              {isActive ? 'Account Active' : 'Account Deactivated'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-900)' }}>
            {user?.name || 'Patient User'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Member since {new Date(user?.createdAt || patientData.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Contact & Medical Snapshot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Email Address</span>
            <span>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Contact Phone</span>
            <span>{user?.phone || 'Not provided'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Gender & Blood</span>
            <span>
              {patientData.gender || 'Unspecified'} •{' '}
              <strong style={{ color: 'var(--accent-rose)' }}>{patientData.bloodGroup || 'UNKNOWN'}</strong>
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Date of Birth</span>
            <span>{patientData.dateOfBirth || 'Not provided'}</span>
          </div>
          {patientData.address && (
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Address</span>
              <span>{patientData.address}</span>
            </div>
          )}
        </div>

        {/* Emergency Contact & Allergies */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontWeight: 700, marginBottom: '0.25rem' }}>
            <AlertTriangle size={15} />
            <span>Documented Allergies</span>
          </div>
          <div style={{ color: '#b45309', marginBottom: '0.5rem' }}>
            {patientData.allergies?.length > 0 ? patientData.allergies.join(', ') : 'None documented'}
          </div>

          {patientData.emergencyContact?.name && (
            <div style={{ borderTop: '1px solid #fef3c7', paddingTop: '0.5rem', color: '#92400e' }}>
              <strong>Emergency Contact:</strong> {patientData.emergencyContact.name}{' '}
              {patientData.emergencyContact.relationship && `(${patientData.emergencyContact.relationship})`}{' '}
              • {patientData.emergencyContact.phone}
            </div>
          )}
        </div>

        {/* Consultation History */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--slate-900)', marginBottom: '0.75rem' }}>
            Consultation History ({appointments.length})
          </h4>

          {appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
              {appointments.map((a) => (
                <div
                  key={a._id}
                  style={{
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                  }}
                >
                  <div>
                    <strong>{a.date}</strong> at {a.startTime} • with{' '}
                    <span>{a.doctor?.user?.name || 'Doctor'}</span> ({a.doctor?.specialization})
                  </div>
                  <span className={`badge ${a.status === 'COMPLETED' ? 'badge-patient' : a.status === 'CONFIRMED' ? 'badge-approved' : 'badge-rejected'}`}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)' }}>
              No appointments booked yet by this patient.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onToggleStatus(patientData._id, !isActive)}
            className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            {isActive ? (
              <>
                <UserX size={15} color="var(--accent-rose)" />
                <span>Deactivate Patient Account</span>
              </>
            ) : (
              <>
                <UserCheck size={15} color="var(--primary-600)" />
                <span>Activate Patient Account</span>
              </>
            )}
          </button>

          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
