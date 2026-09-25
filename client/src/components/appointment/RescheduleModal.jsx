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
import { SecondaryGlassButton, PrimaryGlassButton } from '../common/buttons';

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
          maxWidth: '580px',
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

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}>
              Rescheduling
            </span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Change Appointment Time
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.9rem', margin: 0 }}>
            Rescheduling consultation with <strong style={{ color: '#ffffff' }}>{doctorName}</strong>.
          </p>

          {/* Current slot badge */}
          <div
            style={{
              marginTop: '0.85rem',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              fontSize: '0.825rem',
              color: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Clock size={14} color="#60a5fa" />
            <span>
              Current booking: <strong style={{ color: '#ffffff' }}>{appointment.date}</strong> at{' '}
              <strong style={{ color: '#60a5fa' }}>{appointment.startTime} - {appointment.endTime}</strong>
            </span>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: '#fca5a5',
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
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                color: '#93c5fd',
              }}
            >
              <CheckCircle2 size={16} color="#60a5fa" />
              <span>
                New Time: <strong style={{ color: '#ffffff' }}>{selectedDate}</strong> at{' '}
                <strong style={{ color: '#ffffff' }}>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
              </span>
            </div>
          )}

          {/* Optional reason update */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="rescheduleReason" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
              <FileText size={15} color="#60a5fa" />
              Reason for Rescheduling (Optional)
            </label>
            <input
              id="rescheduleReason"
              type="text"
              className="glass-input"
              placeholder="e.g. Schedule conflict, doctor advised new date"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '0.875rem',
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <SecondaryGlassButton
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </SecondaryGlassButton>
            <PrimaryGlassButton
              type="submit"
              disabled={loading || !selectedSlot}
              loading={loading}
              icon={<RotateCcw size={16} />}
              style={{ minWidth: '170px' }}
            >
              Confirm Reschedule
            </PrimaryGlassButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
