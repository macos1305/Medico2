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
import { GlassButton, SecondaryGlassButton } from '../common/buttons';

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
        backgroundColor: 'rgba(5, 6, 10, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
        className="glass-card glass-modal"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          borderRadius: '20px',
          background: 'rgba(18, 20, 29, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
          position: 'relative',
          color: '#ffffff',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>Patient Dossier</span>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: isActive ? '#34d399' : '#f87171',
              border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            }}>
              {isActive ? 'Account Active' : 'Account Deactivated'}
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0.25rem 0' }}>
            {user?.name || 'Patient User'}
          </h2>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
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
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Email Address</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Contact Phone</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>{user?.phone || 'Not provided'}</span>
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Gender & Blood</span>
            <span style={{ color: '#ffffff' }}>
              {patientData.gender || 'Unspecified'} •{' '}
              <strong style={{ color: '#f43f5e' }}>{patientData.bloodGroup || 'UNKNOWN'}</strong>
            </span>
          </div>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Date of Birth</span>
            <span style={{ color: '#ffffff' }}>{patientData.dateOfBirth || 'Not provided'}</span>
          </div>
          {patientData.address && (
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.5)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Address</span>
              <span style={{ color: '#ffffff' }}>{patientData.address}</span>
            </div>
          )}
        </div>

        {/* Emergency Contact & Allergies */}
        <div
          style={{
            padding: '1.15rem',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, marginBottom: '0.35rem' }}>
            <AlertTriangle size={15} />
            <span>Documented Allergies</span>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.5rem' }}>
            {patientData.allergies?.length > 0 ? patientData.allergies.join(', ') : 'None documented'}
          </div>

          {patientData.emergencyContact?.name && (
            <div style={{ borderTop: '1px solid rgba(245, 158, 11, 0.2)', paddingTop: '0.6rem', color: '#fef3c7' }}>
              <strong style={{ color: '#fbbf24' }}>Emergency Contact:</strong> {patientData.emergencyContact.name}{' '}
              {patientData.emergencyContact.relationship && `(${patientData.emergencyContact.relationship})`}{' '}
              • {patientData.emergencyContact.phone}
            </div>
          )}
        </div>

        {/* Consultation History */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.75rem' }}>
            Consultation History ({appointments.length})
          </h4>

          {appointments.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '200px', overflowY: 'auto' }}>
              {appointments.map((a) => (
                <div
                  key={a._id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                  }}
                >
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    <strong style={{ color: '#ffffff' }}>{a.date}</strong> at {a.startTime} • with{' '}
                    <span style={{ color: '#60a5fa' }}>{a.doctor?.user?.name || 'Doctor'}</span> ({a.doctor?.specialization})
                  </div>
                  <span style={{
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: a.status === 'COMPLETED' ? 'rgba(59, 130, 246, 0.15)' : a.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: a.status === 'COMPLETED' ? '#60a5fa' : a.status === 'CONFIRMED' ? '#34d399' : '#f87171',
                    border: `1px solid ${a.status === 'COMPLETED' ? 'rgba(59, 130, 246, 0.3)' : a.status === 'CONFIRMED' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  }}>
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)' }}>
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
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <GlassButton
            variant={isActive ? 'danger' : 'secondary'}
            size="sm"
            disabled={actionLoading}
            onClick={() => onToggleStatus(patientData._id, !isActive)}
            icon={isActive ? <UserX size={15} /> : <UserCheck size={15} />}
          >
            {isActive ? 'Deactivate Patient Account' : 'Activate Patient Account'}
          </GlassButton>

          <SecondaryGlassButton size="sm" onClick={onClose}>
            Close
          </SecondaryGlassButton>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
