import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PatientSidebar from '../../components/patient/PatientSidebar';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import AppointmentDetails from '../../components/appointment/AppointmentDetails';
import RescheduleModal from '../../components/appointment/RescheduleModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

const PatientAppointmentsPage = () => {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments(activeTab);
      setAppointments(res.data || []);
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

  // Handlers
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  };

  const handleOpenReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  const handleOpenCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppointment) return;
    setCancelling(true);
    try {
      await appointmentService.cancel(
        selectedAppointment._id,
        'Cancelled by patient via portal'
      );
      success('Your appointment has been cancelled and the slot freed.', 'Appointment Cancelled');
      setCancelModalOpen(false);
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to cancel appointment', 'Cancellation Error');
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleSuccess = () => {
    fetchAppointments();
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 300px) 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="dashboard-layout"
        >
          {/* Left Sidebar */}
          <PatientSidebar />

          {/* Main Appointment Management Area */}
          <div>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-patient">Consultation Tracker</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  My Appointments
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Track your upcoming medical appointments, view visit histories, or reschedule time slots.
                </p>
              </div>

              <Link to="/doctors" className="btn btn-primary" style={{ gap: '0.4rem' }}>
                <Plus size={16} />
                <span>Book New Visit</span>
              </Link>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                backgroundColor: 'var(--slate-100)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '1.75rem',
                width: 'fit-content',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`btn btn-sm ${activeTab === 'upcoming' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('past')}
                className={`btn btn-sm ${activeTab === 'past' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Past Visits
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cancelled')}
                className={`btn btn-sm ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Cancelled
              </button>
            </div>

            {/* Appointment Cards Grid or Empty State */}
            {loading ? (
              <LoadingSpinner text="Loading appointment records..." />
            ) : appointments.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {appointments.map((appt) => (
                  <AppointmentCard
                    key={appt._id}
                    appointment={appt}
                    onView={handleView}
                    onCancel={handleOpenCancel}
                    onReschedule={handleOpenReschedule}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                className="card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <Calendar size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                  No {activeTab} Appointments Found
                </h3>
                <p
                  style={{
                    color: 'var(--slate-500)',
                    fontSize: '0.95rem',
                    maxWidth: '420px',
                    margin: '0 auto 1.5rem auto',
                    lineHeight: 1.6,
                  }}
                >
                  {activeTab === 'upcoming'
                    ? 'You have no scheduled visits at this time. Browse our certified doctor directory to book a consultation.'
                    : `There are no ${activeTab} consultation records stored in your account.`}
                </p>
                <Link to="/doctors" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Search size={16} />
                  <span>Find a Doctor & Book</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetails
        isOpen={detailsModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onCancelClick={handleOpenCancel}
        onRescheduleClick={handleOpenReschedule}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={rescheduleModalOpen}
        appointment={selectedAppointment}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={handleRescheduleSuccess}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Cancel Appointment"
        message={`Are you sure you want to cancel your consultation with ${
          selectedAppointment?.doctor?.user?.name || selectedAppointment?.doctor?.name || 'the doctor'
        } on ${selectedAppointment?.date} at ${selectedAppointment?.startTime}? The reserved time slot will become available to other patients immediately.`}
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        isDangerous={true}
        loading={cancelling}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
      />

      <style>{`
        @media (max-width: 840px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PatientAppointmentsPage;
