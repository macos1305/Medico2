import React from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  IndianRupee,
  FileText,
  Activity,
  AlertCircle,
  RotateCcw,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { SecondaryGlassButton, GlassButton, DangerGlassButton } from '../common/buttons';

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
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>Confirmed</span>
        );
      case 'RESCHEDULED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}>Rescheduled</span>
        );
      case 'COMPLETED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}>Completed</span>
        );
      case 'CANCELLED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>Cancelled</span>
        );
      default:
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>{status}</span>
        );
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
          maxWidth: '560px',
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

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 600 }}>
              Appointment ID: #{appointment._id?.slice(-6).toUpperCase()}
            </span>
            {getStatusBadge()}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Consultation Details
          </h2>
        </div>

        {/* Doctor Summary Card */}
        <div
          style={{
            padding: '1.15rem 1.25rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '14px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.2rem' }}>
              {doctorName}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#818cf8', fontWeight: 600 }}>
              {specialization}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '2px' }}>
              {hospital}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Consultation Fee</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#60a5fa' }}>
              ₹{fee}
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
          <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}>
            <Calendar size={20} color="#60a5fa" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase' }}>Date</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>{appointment.date}</div>
            </div>
          </div>

          <div style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px' }}>
            <Clock size={20} color="#60a5fa" />
            <div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.45)', textTransform: 'uppercase' }}>Time</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffffff' }}>
                {appointment.startTime} - {appointment.endTime}
              </div>
            </div>
          </div>
        </div>

        {/* Reason & Symptoms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Reason for Visit
            </span>
            <div style={{ color: '#ffffff', fontWeight: 500, lineHeight: 1.5 }}>
              {appointment.reason}
            </div>
          </div>

          {appointment.symptoms && (
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                Symptoms / Notes
              </span>
              <div style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.5 }}>
                {appointment.symptoms}
              </div>
            </div>
          )}

          {/* Rescheduled From info */}
          {appointment.rescheduledFrom?.previousDate && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                fontSize: '0.825rem',
                color: '#fbbf24',
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
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                fontSize: '0.825rem',
                color: '#fca5a5',
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
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <SecondaryGlassButton onClick={onClose}>
            Close
          </SecondaryGlassButton>

          {isActionable && (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <GlassButton
                variant="secondary"
                onClick={() => {
                  onClose();
                  if (onRescheduleClick) onRescheduleClick(appointment);
                }}
                icon={<RotateCcw size={15} />}
              >
                Reschedule
              </GlassButton>

              <DangerGlassButton
                onClick={() => {
                  onClose();
                  if (onCancelClick) onCancelClick(appointment);
                }}
                icon={<Ban size={15} />}
              >
                Cancel
              </DangerGlassButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;
