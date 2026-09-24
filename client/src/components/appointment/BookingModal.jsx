import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SlotPicker from './SlotPicker';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import appointmentService from '../../services/appointmentService';
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  Activity,
  CheckCircle2,
  Stethoscope,
  LogIn,
} from 'lucide-react';

const BookingModal = ({ isOpen, doctor, onClose, onSuccess }) => {
  const { isAuthenticated, role } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Helper to get today formatted YYYY-MM-DD
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !doctor) return null;

  const doctorName = doctor.user?.name || doctor.name || 'Medical Specialist';
  const specialization = doctor.specialization || 'Clinical Specialist';
  const fee = doctor.consultationFee || 50;
  const hospital = doctor.hospitalAffiliation || 'Independent Practice';

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Clear slot selection when date changes
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedSlot) {
      setErrorMsg('Please select an available consultation time slot.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please provide a primary reason for your visit.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        doctorId: doctor._id,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        reason: reason.trim(),
        symptoms: symptoms.trim(),
      };

      const res = await appointmentService.create(payload);
      success(
        `Consultation confirmed with ${doctorName} on ${selectedDate} at ${selectedSlot.startTime}!`,
        'Appointment Booked'
      );

      if (onSuccess) onSuccess(res.data);
      onClose();
    } catch (err) {
      const msg = err.message || 'Failed to book appointment. Please try another slot.';
      setErrorMsg(msg);
      toastError(msg, 'Booking Error');
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-patient">Booking Flow</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Step 1 of 1</span>
          </div>
          <h2 style={{ fontSize: '1.45rem', color: 'var(--slate-900)' }}>
            Schedule Consultation
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{doctorName}</span>
            <span>•</span>
            <span style={{ color: 'var(--primary-700)', fontWeight: 600 }}>{specialization}</span>
            <span>•</span>
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>${fee}</span>
          </div>
        </div>

        {/* Non-Patient or Unauthenticated Notice */}
        {!isAuthenticated ? (
          <div
            style={{
              padding: '2rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--slate-300)',
            }}
          >
            <LogIn size={32} color="var(--primary-600)" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>Patient Sign In Required</h3>
            <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              You must be logged in as a patient to schedule verified medical consultations.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Link to="/login" className="btn btn-primary" onClick={onClose}>
                Sign In
              </Link>
              <Link to="/register/patient" className="btn btn-secondary" onClick={onClose}>
                Register Account
              </Link>
            </div>
          </div>
        ) : role !== 'PATIENT' ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#fffbeb',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.9rem',
            }}
          >
            <strong>Role Restriction:</strong> You are currently signed in as <strong>{role}</strong>. Only registered patient accounts can book appointments.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
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

            {/* 1. Date & Slot Picker */}
            <SlotPicker
              doctorId={doctor._id}
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedSlot={selectedSlot}
              onSlotSelect={setSelectedSlot}
            />

            {/* Selected Slot Summary Pill */}
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
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-900)' }}>
                  <CheckCircle2 size={16} color="var(--primary-600)" />
                  <span>
                    Selected: <strong>{selectedDate}</strong> at{' '}
                    <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: 'var(--primary-800)' }}>${fee}</span>
              </div>
            )}

            {/* 2. Reason for Visit */}
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label" htmlFor="reason" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={15} color="var(--primary-600)" />
                Reason for Consultation *
              </label>
              <input
                id="reason"
                type="text"
                className="form-input"
                placeholder="e.g. Routine checkup, chest tightness, second opinion"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* 3. Symptoms Details (Optional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="symptoms" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={15} color="var(--primary-600)" />
                Specific Symptoms or Medical History (Optional)
              </label>
              <textarea
                id="symptoms"
                rows="2"
                className="form-textarea"
                placeholder="Describe any symptoms, duration, current medications, or notes for the doctor..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Actions */}
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
                style={{ minWidth: '160px' }}
              >
                {loading ? (
                  <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
