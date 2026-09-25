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
          maxWidth: '640px',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <span className="badge badge-admin">Physician Credential Review</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span className={`badge ${status === 'APPROVED' ? 'badge-approved' : status === 'REJECTED' ? 'badge-rejected' : 'badge-pending'}`}>
                {status}
              </span>
              <span className={`badge ${isActive ? 'badge-approved' : 'badge-rejected'}`}>
                {isActive ? 'Account Active' : 'Account Deactivated'}
              </span>
            </div>
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--slate-900)' }}>
            {user?.name || 'Physician Profile'}
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--primary-700)', fontWeight: 600 }}>
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
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Medical License ID</span>
            <strong style={{ color: 'var(--slate-900)' }}>{doctor.licenseNumber}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Official Email</span>
            <span>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Phone</span>
            <span>{user?.phone || 'Not provided'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Experience & Fee</span>
            <span>{doctor.experienceYears} Years • ₹{doctor.consultationFee} / visit</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Hospital & Location</span>
            <span>{doctor.hospitalAffiliation || 'Independent'} ({doctor.location || 'Main'})</span>
          </div>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Registered Date</span>
            <span>{new Date(user?.createdAt || doctor.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Qualifications */}
        {doctor.qualifications?.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
              Academic & Professional Qualifications
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {doctor.qualifications.map((q, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    border: '1px solid var(--primary-200)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
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
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
              Practice Description / Bio
            </span>
            <p style={{ color: 'var(--slate-700)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {doctor.bio}
            </p>
          </div>
        )}

        {/* Rejection notice if already rejected */}
        {status === 'REJECTED' && doctor.rejectionReason && (
          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent-rose)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}
          >
            <strong>Rejection Reason Logged:</strong> {doctor.rejectionReason}
          </div>
        )}

        {/* Rejection Form Input */}
        {rejecting && (
          <form onSubmit={handleConfirmReject} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#fff1f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
            <label className="form-label" htmlFor="adminRejectReason" style={{ color: 'var(--accent-rose)', fontWeight: 700 }}>
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
              style={{ marginBottom: '0.75rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setRejecting(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger btn-sm"
                disabled={actionLoading}
              >
                Confirm Rejection
              </button>
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
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Account Activate / Deactivate Toggle */}
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => onToggleStatus(doctor._id, !isActive)}
            className={`btn btn-sm ${isActive ? 'btn-outline' : 'btn-secondary'}`}
            style={{ gap: '0.4rem' }}
          >
            {isActive ? (
              <>
                <UserX size={15} color="var(--accent-rose)" />
                <span>Deactivate Account</span>
              </>
            ) : (
              <>
                <UserCheck size={15} color="var(--primary-600)" />
                <span>Activate Account</span>
              </>
            )}
          </button>

          {/* Approval Controls */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Close
            </button>

            {status !== 'APPROVED' && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => onApprove(doctor._id)}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <CheckCircle2 size={15} />
                <span>Approve Credentials</span>
              </button>
            )}

            {status !== 'REJECTED' && !rejecting && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => setRejecting(true)}
                className="btn btn-danger btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <XCircle size={15} />
                <span>Reject</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorReviewModal;
