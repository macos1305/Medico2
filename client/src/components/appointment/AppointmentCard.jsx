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
  const specialization =
    appointment.doctor?.specialization || 'Clinical Specialist';
  const hospital =
    appointment.doctor?.hospitalAffiliation || 'Independent Clinic';
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
      className="card card-interactive"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div>
        {/* Top: Status & Date */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-600)', fontSize: '0.85rem' }}>
            <Calendar size={16} color="var(--primary-600)" />
            <strong style={{ color: 'var(--slate-900)' }}>{appointment.date}</strong>
          </div>
          {getStatusBadge()}
        </div>

        {/* Doctor Info */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
            {doctorName}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary-700)', fontWeight: 600 }}>
            <Stethoscope size={14} />
            <span>{specialization}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            <Building2 size={13} />
            <span>{hospital}</span>
          </div>
        </div>

        {/* Time & Reason */}
        <div
          style={{
            padding: '0.75rem 0.85rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-700)', marginBottom: '0.35rem' }}>
            <Clock size={14} color="var(--primary-600)" />
            <span style={{ fontWeight: 600 }}>
              {appointment.startTime} - {appointment.endTime}
            </span>
          </div>
          <div
            style={{
              color: 'var(--slate-600)',
              fontSize: '0.825rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <strong>Reason:</strong> {appointment.reason}
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
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => onView(appointment)}
          className="btn btn-secondary btn-sm"
          style={{ flex: 1, gap: '0.35rem' }}
        >
          <Eye size={14} />
          <span>View</span>
        </button>

        {isActionable && (
          <>
            <button
              type="button"
              onClick={() => onReschedule(appointment)}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, gap: '0.35rem' }}
              title="Reschedule appointment"
            >
              <RotateCcw size={14} />
              <span>Reschedule</span>
            </button>

            <button
              type="button"
              onClick={() => onCancel(appointment)}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--accent-rose)', padding: '0.4rem 0.6rem' }}
              title="Cancel appointment"
            >
              <Ban size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
