import React, { useState } from 'react';
import SlotPicker from './SlotPicker';
import { useToast } from '../../context/ToastContext';
import appointmentService from '../../services/appointmentService';
import {
  X,
  Calendar,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';

const RescheduleModal = ({ isOpen, appointment, onClose, onSuccess }) => {
  const { success, error: toastError } = useToast();

  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowStr());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !appointment) return null;

  const doctorId = appointment.doctor?._id || appointment.doctor;
  const doctorName =
    appointment.doctor?.user?.name ||
    appointment.doctor?.name ||
    'Medical Specialist';

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedSlot) {
      setErrorMsg('Please select a new available consultation time slot.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        newDate: selectedDate,
        newStartTime: selectedSlot.startTime,
        reason: reason.trim() || appointment.reason,
      };

      const res = await appointmentService.reschedule(appointment._id, payload);
      success(
        `Appointment successfully moved to ${selectedDate} at ${selectedSlot.startTime}. Previous slot has been freed.`,
        'Appointment Rescheduled'
      );

      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to reschedule. Please choose another slot.';
      setErrorMsg(msg);
      toastError(msg, 'Reschedule Error');
    } finally {
      setLoading(false);
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
              Rescheduling
            </span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
            Change Appointment Time
          </h2>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            Rescheduling consultation with <strong>{doctorName}</strong>.
          </p>

          {/* Current slot badge */}
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--slate-100)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              color: 'var(--slate-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Clock size={14} color="var(--slate-500)" />
            <span>
              Current booking: <strong>{appointment.date}</strong> at{' '}
              <strong>{appointment.startTime} - {appointment.endTime}</strong>
            </span>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#ffe4e6',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'var(--accent-rose)',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SlotPicker */}
          <SlotPicker
            doctorId={doctorId}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />

          {/* New Selected Slot Preview */}
          {selectedSlot && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--primary-50)',
                border: '1px solid var(--primary-200)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: 'var(--primary-900)',
              }}
            >
              <CheckCircle2 size={16} color="var(--primary-600)" />
              <span>
                New Time: <strong>{selectedDate}</strong> at{' '}
                <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
              </span>
            </div>
          )}

          {/* Optional reason update */}
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label" htmlFor="rescheduleReason" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={15} color="var(--primary-600)" />
              Reason for Rescheduling (Optional)
            </label>
            <input
              id="rescheduleReason"
              type="text"
              className="form-input"
              placeholder="e.g. Schedule conflict, doctor advised new date"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !selectedSlot}
              style={{ minWidth: '170px' }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
              ) : (
                <>
                  <RotateCcw size={16} />
                  <span>Confirm Reschedule</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
