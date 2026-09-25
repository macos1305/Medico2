import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  Award,
  IndianRupee,
  GraduationCap,
  FileText,
  Mail,
  Phone,
  Calendar,
  AlertTriangle,
  UserCheck,
  UserX,
} from 'lucide-react';
import { GlassButton, SecondaryGlassButton, DangerGlassButton } from '../common/buttons';

const DoctorReviewModal = ({
  isOpen,
  doctor,
  onClose,
  onApprove,
  onReject,
  onToggleStatus,
  actionLoading,
}) => {
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !doctor) return null;

  const user = doctor.user;
  const status = doctor.approvalStatus;
  const isActive = user?.isActive !== false;

  const handleConfirmReject = (e) => {
    e.preventDefault();
    if (onReject) {
      onReject(doctor._id, rejectionReason);
    }
  };

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
          maxWidth: '640px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.25rem',
          borderRadius: '28px',
          boxShadow: '0 25px 80px rgba(0, 0, 0, 0.7)',
          backgroundColor: 'rgba(18, 20, 29, 0.92)',
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
          }}
          aria-label="Close modal"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(139, 92, 246, 0.15)',
                color: '#c084fc',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Physician Credential Review
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  backgroundColor: status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : status === 'REJECTED' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: status === 'APPROVED' ? '#34d399' : status === 'REJECTED' ? '#fb7185' : '#fbbf24',
                  border: `1px solid ${status === 'APPROVED' ? 'rgba(16, 185, 129, 0.3)' : status === 'REJECTED' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  textTransform: 'uppercase',
                }}
              >
                {status}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                  color: isActive ? '#34d399' : '#fb7185',
                  border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'}`,
                }}
              >
                {isActive ? 'Account Active' : 'Account Deactivated'}
              </span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.25rem 0' }}>
            {user?.name || 'Physician Profile'}
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#38bdf8', fontWeight: 600 }}>
            {doctor.specialization}
          </div>
        </div>

        {/* Doctor Identity Snapshot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
          }}
        >
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Medical License ID</span>
            <strong style={{ color: '#ffffff' }}>{doctor.licenseNumber}</strong>
          </div>
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Official Email</span>
            <span style={{ color: 'rgba(200, 205, 225, 0.85)' }}>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</span>
            <span style={{ color: 'rgba(200, 205, 225, 0.85)' }}>{user?.phone || 'Not provided'}</span>
          </div>
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Experience & Fee</span>
            <span style={{ color: 'rgba(200, 205, 225, 0.85)' }}>{doctor.experienceYears} Years • <strong style={{ color: '#38bdf8' }}>₹{doctor.consultationFee}</strong> / visit</span>
          </div>
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital & Location</span>
            <span style={{ color: 'rgba(200, 205, 225, 0.85)' }}>{doctor.hospitalAffiliation || 'Independent'} ({doctor.location || 'Main'})</span>
          </div>
          <div>
            <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registered Date</span>
            <span style={{ color: 'rgba(200, 205, 225, 0.85)' }}>{new Date(user?.createdAt || doctor.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Qualifications */}
        {doctor.qualifications?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
              Academic & Professional Qualifications
            </span>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {doctor.qualifications.map((q, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {q}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Bio */}
        {doctor.bio && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.35rem' }}>
              Practice Description / Bio
            </span>
            <p style={{ color: 'rgba(200, 205, 225, 0.85)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
              {doctor.bio}
            </p>
          </div>
        )}

        {/* Rejection notice if already rejected */}
        {status === 'REJECTED' && doctor.rejectionReason && (
          <div
            style={{
              padding: '0.85rem 1.15rem',
              backgroundColor: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '14px',
              color: '#fb7185',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <strong>Rejection Reason Logged:</strong> {doctor.rejectionReason}
          </div>
        )}

        {/* Rejection Form Input */}
        {rejecting && (
          <form onSubmit={handleConfirmReject} style={{ marginBottom: '1.5rem', padding: '1.15rem', backgroundColor: 'rgba(244, 63, 94, 0.08)', borderRadius: '16px', border: '1px solid rgba(244, 63, 94, 0.25)' }}>
            <label className="form-label" htmlFor="adminRejectReason" style={{ color: '#fb7185', fontWeight: 600, fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
              Specify Rejection Reason *
            </label>
            <textarea
              id="adminRejectReason"
              rows="2"
              className="form-textarea"
              placeholder="e.g. License number unverified with state board; invalid practice documents"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '0.88rem',
                outline: 'none',
                marginBottom: '0.85rem',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <SecondaryGlassButton
                size="sm"
                onClick={() => setRejecting(false)}
              >
                Cancel
              </SecondaryGlassButton>
              <DangerGlassButton
                size="sm"
                type="submit"
                loading={actionLoading}
              >
                Confirm Rejection
              </DangerGlassButton>
            </div>
          </form>
        )}

        {/* Modal Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Account Activate / Deactivate Toggle */}
          <GlassButton
            variant={isActive ? 'outline' : 'secondary'}
            size="sm"
            disabled={actionLoading}
            onClick={() => onToggleStatus(doctor._id, !isActive)}
            icon={isActive ? <UserX size={15} color="#fb7185" /> : <UserCheck size={15} color="#38bdf8" />}
          >
            {isActive ? 'Deactivate Account' : 'Activate Account'}
          </GlassButton>

          {/* Approval Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <SecondaryGlassButton
              size="sm"
              onClick={onClose}
            >
              Close
            </SecondaryGlassButton>

            {status !== 'APPROVED' && (
              <GlassButton
                variant="success"
                size="sm"
                disabled={actionLoading}
                onClick={() => onApprove(doctor._id)}
                icon={<CheckCircle2 size={15} />}
              >
                Approve Credentials
              </GlassButton>
            )}

            {status !== 'REJECTED' && !rejecting && (
              <DangerGlassButton
                size="sm"
                disabled={actionLoading}
                onClick={() => setRejecting(true)}
                icon={<XCircle size={15} />}
              >
                Reject
              </DangerGlassButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewModal;
