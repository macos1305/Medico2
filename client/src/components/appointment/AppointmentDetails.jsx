import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  DollarSign,
  FileText,
  Activity,
  AlertCircle,
  RotateCcw,
  Ban,
  CheckCircle2,
} from 'lucide-react';

const AppointmentDetails = ({
  isOpen,
  appointment,
  onClose,
  onCancelClick,
  onRescheduleClick,
}) => {
  if (!isOpen || !appointment) return null;

  const doctorName =
    appointment.doctor?.user?.name ||
    appointment.doctor?.name ||
    'Medical Specialist';
  const specialization =
    appointment.doctor?.specialization || 'Clinical Specialist';
  const hospital =
    appointment.doctor?.hospitalAffiliation || 'Independent Practice';
  const fee = appointment.doctor?.consultationFee || 50;
  const status = appointment.status;

  const getStatusBadge = () => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-approved">Confirmed</span>;
      case 'RESCHEDULED':
        return <span className="badge badge-pending">Rescheduled</span>;
      case 'COMPLETED':
        return <span className="badge badge-patient">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-rejected">Cancelled</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
  };

  const isActionable = status !== 'CANCELLED' && status !== 'COMPLETED';

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
          maxWidth: '560px',
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

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 600 }}>
              Appointment ID: #{appointment._id?.slice(-6).toUpperCase()}
            </span>
            {getStatusBadge()}
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
            Consultation Details
          </h2>
        </div>

        {/* Doctor Summary Card */}
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--slate-900)' }}>
              {doctorName}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
              {specialization}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              {hospital}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Consultation Fee</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              ${fee}
            </div>
          </div>
        </div>

        {/* Date & Time Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Calendar size={20} color="var(--primary-600)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Date</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{appointment.date}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Clock size={20} color="var(--primary-600)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Time</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
          </div>
        </div>

        {/* Reason & Symptoms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
              Reason for Visit
            </span>
            <div style={{ color: 'var(--slate-800)', fontWeight: 500, lineHeight: 1.5 }}>
              {appointment.reason}
            </div>
          </div>

          {appointment.symptoms && (
            <div>
              <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>
                Symptoms / Notes
              </span>
              <div style={{ color: 'var(--slate-700)', lineHeight: 1.5 }}>
                {appointment.symptoms}
              </div>
            </div>
          )}

          {/* Rescheduled From info */}
          {appointment.rescheduledFrom?.previousDate && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: '#fffbeb',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                color: '#92400e',
              }}
            >
              Moved from original date: {appointment.rescheduledFrom.previousDate} at{' '}
              {appointment.rescheduledFrom.previousStartTime}
            </div>
          )}

          {/* Cancellation Reason info */}
          {status === 'CANCELLED' && appointment.cancellationReason && (
            <div
              style={{
                padding: '0.65rem 0.85rem',
                backgroundColor: '#fff1f2',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.825rem',
                color: '#9f1239',
              }}
            >
              Cancellation note: {appointment.cancellationReason}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>

          {isActionable && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  onClose();
                  if (onRescheduleClick) onRescheduleClick(appointment);
                }}
              >
                <RotateCcw size={15} />
                <span>Reschedule</span>
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onClose();
                  if (onCancelClick) onCancelClick(appointment);
                }}
              >
                <Ban size={15} />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
