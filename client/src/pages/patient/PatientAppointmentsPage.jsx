import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PatientSidebar from '../../components/patient/PatientSidebar';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import AppointmentDetails from '../../components/appointment/AppointmentDetails';
import RescheduleModal from '../../components/appointment/RescheduleModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ReviewForm from '../../components/review/ReviewForm';
import StarRating from '../../components/review/StarRating';
import { SkeletonListItem } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import appointmentService from '../../services/appointmentService';
import reviewService from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Search,
  Plus,
  Star,
  CheckCircle2,
  X,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton } from '../../components/common/buttons';

/* ─── Compact appointment card with review prompt ─────────────────────────── */
const AppointmentRowCard = ({ appointment, onView, onCancel, onReschedule, onReviewClick, reviewedIds }) => {
  const doctorName =
    appointment.doctor?.user?.name ||
    appointment.doctor?.name ||
    'Medical Specialist';
  const specialization = appointment.doctor?.specialization || '';
  const isCompleted = appointment.status === 'COMPLETED';
  const alreadyReviewed = reviewedIds.has(appointment._id);

  const statusStyles = {
    PENDING:     { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)', label: 'Pending' },
    CONFIRMED:   { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.25)', label: 'Confirmed' },
    COMPLETED:   { bg: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.25)', label: 'Completed' },
    CANCELLED:   { bg: 'rgba(244, 63, 94, 0.12)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.25)', label: 'Cancelled' },
    RESCHEDULED: { bg: 'rgba(168, 85, 247, 0.12)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.25)', label: 'Rescheduled' },
  };
  const sc = statusStyles[appointment.status] || statusStyles.PENDING;

  const dateObj = new Date(appointment.date);

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        flexWrap: 'wrap',
        background: 'rgba(18, 20, 29, 0.6)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Date badge */}
      <div
        style={{
          flexShrink: 0,
          textAlign: 'center',
          backgroundColor: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '14px',
          padding: '0.5rem 0.85rem',
          minWidth: 64,
        }}
      >
        <div style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.05em' }}>
          {dateObj.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
        </div>
        <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, marginTop: '2px' }}>
          {dateObj.getDate()}
        </div>
      </div>

      {/* Doctor info */}
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ fontWeight: 600, fontSize: '1rem', color: '#ffffff' }}>
          {doctorName}
        </div>
        {specialization && (
          <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 500, marginTop: '0.15rem' }}>
            {specialization}
          </div>
        )}
        <div style={{ fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.7)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={13} color="rgba(148, 163, 184, 0.7)" />
          {appointment.startTime} – {appointment.endTime}
        </div>
      </div>

      {/* Status badge */}
      <span
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          padding: '0.3rem 0.75rem',
          borderRadius: '9999px',
          backgroundColor: sc.bg,
          color: sc.color,
          border: `1px solid ${sc.border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          flexShrink: 0,
        }}
      >
        {sc.label}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.65rem', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
        <SecondaryGlassButton
          size="sm"
          onClick={() => onView(appointment)}
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
        >
          Details
        </SecondaryGlassButton>

        {isCompleted && !alreadyReviewed && (
          <GlassButton
            variant="warning"
            size="sm"
            icon={<Star size={13} />}
            onClick={() => onReviewClick(appointment)}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
          >
            Write Review
          </GlassButton>
        )}

        {isCompleted && alreadyReviewed && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.8rem',
              color: '#34d399',
              fontWeight: 600,
              padding: '0.4rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            <CheckCircle2 size={14} /> Reviewed
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const PatientAppointmentsPage = () => {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewedIds, setReviewedIds] = useState(new Set());

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Review form (inline)
  const [reviewAppointment, setReviewAppointment] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments(activeTab);
      const list = res.data || [];
      setAppointments(list);

      // For completed tab — check which ones have been reviewed already
      if (activeTab === 'past') {
        const completedIds = list
          .filter((a) => a.status === 'COMPLETED')
          .map((a) => a._id);
        if (completedIds.length > 0) {
          const checks = await Promise.all(
            completedIds.map((id) =>
              reviewService.checkExists(id).then((r) => (r.data?.reviewed ? id : null))
            )
          );
          setReviewedIds(new Set(checks.filter(Boolean)));
        } else {
          setReviewedIds(new Set());
        }
      } else {
        setReviewedIds(new Set());
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
      toastError(err.message || 'Could not load your appointments', 'Load Error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, toastError]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleView = (appt) => { setSelectedAppointment(appt); setDetailsModalOpen(true); };
  const handleOpenReschedule = (appt) => { setSelectedAppointment(appt); setRescheduleModalOpen(true); };
  const handleOpenCancel = (appt) => { setSelectedAppointment(appt); setCancelModalOpen(true); };
  const handleReviewClick = (appt) => setReviewAppointment(appt);

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setCancelling(true);
    try {
      await appointmentService.cancel(selectedAppointment._id, 'Cancelled by patient via portal');
      success('Your appointment has been cancelled.', 'Appointment Cancelled');
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to cancel appointment', 'Cancellation Error');
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleSuccess = () => fetchAppointments();

  const handleReviewSuccess = (review) => {
    setReviewedIds((prev) => new Set([...prev, reviewAppointment._id]));
    setReviewAppointment(null);
  };

  const tabs = [
    { key: 'upcoming', label: 'Upcoming Consultations' },
    { key: 'past', label: 'Past Visits' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div className="dashboard-layout">
          {/* Left Sidebar */}
          <PatientSidebar />

          {/* Main */}
          <main>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  Consultation Tracker
                </span>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  My Appointments
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.3rem' }}>
                  Track visits, reschedule slots, or rate completed consultations.
                </p>
              </div>
              <PrimaryGlassButton
                to="/doctors"
                size="sm"
                icon={<Plus size={15} />}
              >
                Book New Visit
              </PrimaryGlassButton>
            </div>

            {/* Segmented Glass Tabs */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                padding: '0.3rem',
                borderRadius: '9999px',
                marginBottom: '1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '0.25rem',
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => { setActiveTab(tab.key); setReviewAppointment(null); }}
                    style={{
                      padding: '0.55rem 1.15rem',
                      borderRadius: '9999px',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                      color: isActive ? '#38bdf8' : 'rgba(200, 205, 225, 0.7)',
                      boxShadow: isActive ? '0 0 15px rgba(56, 189, 248, 0.15)' : 'none',
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Inline Review Form */}
            {reviewAppointment && (
              <div style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.25s ease' }}>
                <ReviewForm
                  appointment={reviewAppointment}
                  doctorName={
                    reviewAppointment.doctor?.user?.name ||
                    reviewAppointment.doctor?.name ||
                    'the doctor'
                  }
                  onSuccess={handleReviewSuccess}
                  onClose={() => setReviewAppointment(null)}
                />
              </div>
            )}

            {/* Appointments list */}
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
              </div>
            ) : appointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {appointments.map((appt) => (
                  <AppointmentRowCard
                    key={appt._id}
                    appointment={appt}
                    onView={handleView}
                    onCancel={handleOpenCancel}
                    onReschedule={handleOpenReschedule}
                    onReviewClick={handleReviewClick}
                    reviewedIds={reviewedIds}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '2rem' }}>
                <EmptyState
                  icon="calendar"
                  title={`No ${tabs.find((t) => t.key === activeTab)?.label || ''}`}
                  message={
                    activeTab === 'upcoming'
                      ? 'You have no scheduled visits. Browse our certified specialist directory to book a consultation.'
                      : `There are no ${activeTab} consultations recorded for your account.`
                  }
                  primaryAction={
                    activeTab === 'upcoming'
                      ? { to: '/doctors', label: 'Find a Doctor', icon: Search }
                      : null
                  }
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <AppointmentDetails
        isOpen={detailsModalOpen}
        appointment={selectedAppointment}
        onClose={() => { setDetailsModalOpen(false); setSelectedAppointment(null); }}
        onCancelClick={handleOpenCancel}
        onRescheduleClick={handleOpenReschedule}
      />

      <RescheduleModal
        isOpen={rescheduleModalOpen}
        appointment={selectedAppointment}
        onClose={() => { setRescheduleModalOpen(false); setSelectedAppointment(null); }}
        onSuccess={handleRescheduleSuccess}
      />

      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your consultation with ${
          selectedAppointment?.doctor?.user?.name ||
          selectedAppointment?.doctor?.name ||
          'the doctor'
        } on ${selectedAppointment?.date ? new Date(selectedAppointment.date).toLocaleDateString() : ''} at ${selectedAppointment?.startTime}?`}
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        isDangerous
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => { setCancelModalOpen(false); setSelectedAppointment(null); }}
      />
    </div>
  );
};

export default PatientAppointmentsPage;
