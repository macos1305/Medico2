import React from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Building2,
  Eye,
  RotateCcw,
  Ban,
  CheckCircle2,
} from 'lucide-react';
import { GlassButton, SecondaryGlassButton, DangerGlassButton } from '../common/buttons';
import DoctorAvatar from '../common/DoctorAvatar';


const AppointmentCard = ({
  appointment,
  onView,
  onCancel,
  onReschedule,
}) => {
  const doctorName =
    appointment.doctor?.user?.name ||
    appointment.doctor?.name ||
    'Medical Specialist';
  const doctorImg =
    appointment.doctor?.user?.profileImage ||
    appointment.doctor?.user?.avatar ||
    appointment.doctor?.profileImage;
  const specialization =
    appointment.doctor?.specialization || 'Clinical Specialist';
  const hospital =
    appointment.doctor?.hospitalAffiliation || 'Independent Clinic';
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
      className="glass-card glass-card-interactive"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '16px',
        background: 'rgba(18, 20, 29, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div>
        {/* Top: Status & Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.85rem' }}>
            <Calendar size={15} color="#60a5fa" />
            <strong style={{ color: '#ffffff' }}>{appointment.date}</strong>
          </div>
          {getStatusBadge()}
        </div>

        {/* Doctor Info */}
        <div style={{ marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <DoctorAvatar
            src={doctorImg}
            name={doctorName}
            size={52}
            borderRadius="14px"
            style={{ flexShrink: 0 }}
          />
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.3rem' }}>
              {doctorName}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: '#818cf8', fontWeight: 600 }}>
              <Stethoscope size={13} />
              <span>{specialization}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)', marginTop: '0.2rem' }}>
              <Building2 size={12} />
              <span>{hospital}</span>
            </div>
          </div>
        </div>

        {/* Time & Reason */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '10px',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', marginBottom: '0.35rem', fontWeight: 600 }}>
            <Clock size={14} color="#60a5fa" />
            <span>
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
          <div
            style={{
              color: 'rgba(255, 255, 255, 0.65)',
              fontSize: '0.825rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <strong style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Reason:</strong> {appointment.reason}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          flexWrap: 'wrap',
        }}
      >
        <SecondaryGlassButton
          size="small"
          onClick={() => onView(appointment)}
          icon={<Eye size={14} />}
          style={{ flex: 1 }}
        >
          View
        </SecondaryGlassButton>

        {isActionable && (
          <>
            <GlassButton
              variant="secondary"
              size="small"
              onClick={() => onReschedule(appointment)}
              icon={<RotateCcw size={14} />}
              style={{ flex: 1 }}
              title="Reschedule appointment"
            >
              Reschedule
            </GlassButton>

            <DangerGlassButton
              size="small"
              onClick={() => onCancel(appointment)}
              icon={<Ban size={14} />}
              title="Cancel appointment"
            >
              Cancel
            </DangerGlassButton>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
