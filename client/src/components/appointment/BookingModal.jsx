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
  IndianRupee,
  AlertCircle,
  FileText,
  Activity,
  CheckCircle2,
  Stethoscope,
  LogIn,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton } from '../common/buttons';

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
        {/* Close Button */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}>Booking Flow</span>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.45)' }}>Step 1 of 1</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.35rem 0' }}>
            Schedule Consultation
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.65)', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>{doctorName}</span>
            <span>•</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>{specialization}</span>
            <span>•</span>
            <span style={{ fontWeight: 700, color: '#60a5fa' }}>₹{fee}</span>
          </div>
        </div>

        {/* Non-Patient or Unauthenticated Notice */}
        {!isAuthenticated ? (
          <div
            style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px',
              border: '1px dashed rgba(255, 255, 255, 0.1)',
            }}
          >
            <LogIn size={32} color="#60a5fa" style={{ margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>Patient Sign In Required</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              You must be logged in as a verified patient to schedule medical consultations.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <PrimaryGlassButton to="/login" onClick={onClose}>
                Sign In
              </PrimaryGlassButton>
              <SecondaryGlassButton to="/register/patient" onClick={onClose}>
                Register Account
              </SecondaryGlassButton>
            </div>
          </div>
        ) : role !== 'PATIENT' ? (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              color: '#fbbf24',
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
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd' }}>
                  <CheckCircle2 size={16} color="#60a5fa" />
                  <span>
                    Selected: <strong>{selectedDate}</strong> at{' '}
                    <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
                  </span>
                </div>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>₹{fee}</span>
              </div>
            )}

            {/* 2. Reason for Visit */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="reason" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                <FileText size={15} color="#60a5fa" />
                Reason for Consultation *
              </label>
              <input
                id="reason"
                type="text"
                className="glass-input"
                placeholder="e.g. Routine checkup, chest tightness, second opinion"
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

            {/* 3. Symptoms Details (Optional) */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label htmlFor="symptoms" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
                <Activity size={15} color="#60a5fa" />
                Specific Symptoms or Medical History (Optional)
              </label>
              <textarea
                id="symptoms"
                rows="2"
                className="glass-input"
                placeholder="Describe any symptoms, duration, current medications, or notes for the doctor..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
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
              <GlassButton
                variant="primary"
                type="submit"
                loading={loading}
                disabled={!selectedSlot}
                icon={<CheckCircle2 size={16} />}
                style={{ minWidth: '170px' }}
              >
                Confirm Booking
              </GlassButton>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
