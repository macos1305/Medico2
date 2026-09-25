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

  const statusColors = {
    PENDING:     { bg: '#fef9c3', color: '#854d0e', label: 'Pending' },
    CONFIRMED:   { bg: '#f0fdf4', color: '#166534', label: 'Confirmed' },
    COMPLETED:   { bg: '#eff6ff', color: '#1d4ed8', label: 'Completed' },
    CANCELLED:   { bg: '#fff1f2', color: '#9f1239', label: 'Cancelled' },
    RESCHEDULED: { bg: '#faf5ff', color: '#6b21a8', label: 'Rescheduled' },
  };
  const sc = statusColors[appointment.status] || statusColors.PENDING;

  return (
    <div
      className="card"
      style={{
        padding: '1.125rem 1.375rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
        transition: 'box-shadow 0.15s',
      }}
    >
      {/* Date badge */}
      <div
        style={{
          flexShrink: 0,
          textAlign: 'center',
          backgroundColor: 'var(--primary-50)',
          border: '1px solid var(--primary-100)',
          borderRadius: 'var(--radius-md)',
          padding: '0.4rem 0.75rem',
          minWidth: 60,
        }}
      >
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--primary-600)', fontWeight: 700 }}>
          {new Date(appointment.date).toLocaleDateString('en-IN', { month: 'short' }).toUpperCase()}
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-800)', lineHeight: 1 }}>
          {new Date(appointment.date).getDate()}
        </div>
      </div>

      {/* Doctor info */}
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--slate-900)' }}>
          {doctorName}
        </div>
        {specialization && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-500)' }}>{specialization}</div>
        )}
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: '0.1rem' }}>
          {appointment.startTime} – {appointment.endTime}
        </div>
      </div>

      {/* Status badge */}
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: sc.bg,
          color: sc.color,
          flexShrink: 0,
        }}
      >
        {sc.label}
      </span>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, flexWrap: 'wrap', alignItems: 'center' }}>
        <SecondaryGlassButton
          size="small"
          onClick={() => onView(appointment)}
          style={{ fontSize: 'var(--text-xs)', minHeight: '30px', padding: '0.25rem 0.65rem' }}
        >
          Details
        </SecondaryGlassButton>

        {isCompleted && !alreadyReviewed && (
          <GlassButton
            variant="warning"
            size="small"
            icon={<Star size={12} />}
            onClick={() => onReviewClick(appointment)}
            style={{ fontSize: 'var(--text-xs)', minHeight: '30px', padding: '0.25rem 0.65rem' }}
          >
            Write Review
          </GlassButton>
        )}

        {isCompleted && alreadyReviewed && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: 'var(--text-xs)',
              color: 'var(--primary-600)',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={13} /> Reviewed
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

  // Review form (inline, not a modal)
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
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past Visits' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
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
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <span className="badge badge-patient" style={{ marginBottom: '0.35rem' }}>
                  Consultation Tracker
                </span>
                <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--slate-900)' }}>
                  My Appointments
                </h1>
                <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)', marginTop: '0.2rem' }}>
                  Track visits, reschedule, or rate completed consultations.
                </p>
              </div>
              <PrimaryGlassButton
                to="/doctors"
                size="small"
                icon={<Plus size={15} />}
              >
                Book New Visit
              </PrimaryGlassButton>
            </div>

            {/* Tabs */}
            <div className="tab-list" style={{ marginBottom: '1.5rem', width: 'fit-content' }}>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setActiveTab(tab.key); setReviewAppointment(null); }}
                  className={`tab-btn${activeTab === tab.key ? ' active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Inline Review Form */}
            {reviewAppointment && (
              <div style={{ marginBottom: '1.25rem', animation: 'fadeIn 0.2s ease' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[1, 2, 3].map((i) => <SkeletonListItem key={i} />)}
              </div>
            ) : appointments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
              <div className="card">
                <EmptyState
                  icon="calendar"
                  title={`No ${tabs.find((t) => t.key === activeTab)?.label || ''} Appointments`}
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
        } on ${selectedAppointment?.date} at ${selectedAppointment?.startTime}?`}
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
