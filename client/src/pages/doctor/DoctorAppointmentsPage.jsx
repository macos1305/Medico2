import React, { useState, useEffect, useCallback } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import PatientDetailsModal from '../../components/doctor/PatientDetailsModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import appointmentService from '../../services/appointmentService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  Ban,
  Search,
  AlertCircle,
  FileText,
  Activity,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton, DangerGlassButton } from '../../components/common/buttons';

const DoctorAppointmentsPage = () => {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getDoctorAppointments({ tab: activeTab });
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      toastError(err.message || 'Could not load doctor appointments', 'Load Error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, toastError]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handlers
  const handleView = (appt) => {
    setSelectedAppt(appt);
    setDetailsModalOpen(true);
  };

  const handleConfirm = async (appt) => {
    setActionLoading(true);
    try {
      await appointmentService.confirmDoctorAppointment(appt._id);
      success(`Consultation with ${appt.patient?.user?.name || 'patient'} confirmed`, 'Confirmed');
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to confirm appointment', 'Action Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkComplete = async (appt) => {
    setActionLoading(true);
    try {
      await appointmentService.completeDoctorAppointment(appt._id);
      success(`Consultation with ${appt.patient?.user?.name || 'patient'} marked completed`, 'Completed');
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to mark appointment completed', 'Action Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReject = (appt) => {
    setSelectedAppt(appt);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      await appointmentService.rejectDoctorAppointment(selectedAppt._id, rejectReason);
      success('Appointment has been cancelled and slot released', 'Appointment Cancelled');
      setRejectModalOpen(false);
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to cancel appointment', 'Cancellation Error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="badge badge-approved">Confirmed</span>;
      case 'PENDING':
        return <span className="badge badge-pending">Pending</span>;
      case 'RESCHEDULED':
        return <span className="badge badge-warning" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>Rescheduled</span>;
      case 'COMPLETED':
        return <span className="badge badge-patient">Completed</span>;
      case 'CANCELLED':
        return <span className="badge badge-rejected">Cancelled</span>;
      default:
        return <span className="badge badge-pending">{status}</span>;
    }
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
          {/* Left Doctor Sidebar */}
          <DoctorSidebar />

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
                  <span className="badge badge-doctor">Clinical Schedule</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Patient Appointments
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Manage consultations, inspect clinical reasons/symptoms, confirm visits, or complete appointments.
                </p>
              </div>
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
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('today')}
                className={`btn btn-sm ${activeTab === 'today' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Today
              </button>
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
                onClick={() => setActiveTab('completed')}
                className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('cancelled')}
                className={`btn btn-sm ${activeTab === 'cancelled' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                Cancelled
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: 'var(--radius-md)' }}
              >
                All
              </button>
            </div>

            {/* Appointments Grid or Empty State */}
            {loading ? (
              <LoadingSpinner text="Retrieving appointment records..." />
            ) : appointments.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {appointments.map((appt) => {
                  const patientUser = appt.patient?.user;
                  const patientData = appt.patient;
                  const isActionable = appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED';

                  return (
                    <div
                      key={appt._id}
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
                        {/* Top: Date & Status */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '0.85rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                            <Calendar size={16} color="var(--primary-600)" />
                            <strong style={{ color: 'var(--slate-900)' }}>{appt.date}</strong>
                          </div>
                          {getStatusBadge(appt.status)}
                        </div>

                        {/* Patient Info */}
                        <div style={{ marginBottom: '1rem' }}>
                          <h3 style={{ fontSize: '1.15rem', color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                            {patientUser?.name || 'Patient'}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--slate-500)', flexWrap: 'wrap' }}>
                            <span>{patientUser?.email}</span>
                            {patientUser?.phone && (
                              <>
                                <span>•</span>
                                <span>{patientUser.phone}</span>
                              </>
                            )}
                          </div>
                          {patientData?.bloodGroup && patientData.bloodGroup !== 'UNKNOWN' && (
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: 'var(--accent-rose)',
                                backgroundColor: '#ffe4e6',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                marginTop: '0.35rem',
                              }}
                            >
                              Blood: {patientData.bloodGroup}
                            </span>
                          )}
                        </div>

                        {/* Slot Time & Reason/Symptoms */}
                        <div
                          style={{
                            padding: '0.75rem 0.85rem',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.25rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-800)', fontWeight: 600, marginBottom: '0.35rem' }}>
                            <Clock size={14} color="var(--primary-600)" />
                            <span>
                              {appt.startTime} - {appt.endTime}
                            </span>
                          </div>
                          <div style={{ color: 'var(--slate-700)', marginBottom: '0.25rem' }}>
                            <strong>Reason:</strong> {appt.reason}
                          </div>
                          {appt.symptoms && (
                            <div style={{ color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                              <strong>Symptoms:</strong> {appt.symptoms}
                            </div>
                          )}
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
                        <SecondaryGlassButton
                          size="small"
                          onClick={() => handleView(appt)}
                          icon={<Eye size={14} />}
                          style={{ flex: 1 }}
                        >
                          Dossier
                        </SecondaryGlassButton>

                        {isActionable && (
                          <>
                            {appt.status !== 'CONFIRMED' && (
                              <GlassButton
                                variant="success"
                                size="small"
                                disabled={actionLoading}
                                onClick={() => handleConfirm(appt)}
                                icon={<Check size={14} />}
                                title="Confirm Appointment"
                              >
                                Confirm
                              </GlassButton>
                            )}

                            <PrimaryGlassButton
                              size="small"
                              disabled={actionLoading}
                              onClick={() => handleMarkComplete(appt)}
                              icon={<CheckCircle2 size={14} />}
                              title="Mark as Completed"
                            >
                              Complete
                            </PrimaryGlassButton>

                            <DangerGlassButton
                              size="small"
                              disabled={actionLoading}
                              onClick={() => handleOpenReject(appt)}
                              icon={<Ban size={14} />}
                              title="Cancel / Reject"
                            >
                              Reject
                            </DangerGlassButton>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                  No {activeTab} Appointments
                </h3>
                <p
                  style={{
                    color: 'var(--slate-500)',
                    fontSize: '0.95rem',
                    maxWidth: '420px',
                    margin: '0 auto',
                    lineHeight: 1.6,
                  }}
                >
                  There are currently no {activeTab} consultations registered under your clinical schedule.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patient Dossier Modal */}
      <PatientDetailsModal
        isOpen={detailsModalOpen}
        appointment={selectedAppt}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedAppt(null);
        }}
      />

      {/* Cancel Appointment Modal */}
      <ConfirmationModal
        isOpen={rejectModalOpen}
        title="Cancel Patient Appointment"
        message={`Are you sure you want to cancel the appointment with ${selectedAppt?.patient?.user?.name || 'this patient'} on ${selectedAppt?.date} at ${selectedAppt?.startTime}? The reserved time slot will become available for booking.`}
        confirmText="Yes, Cancel Appointment"
        cancelText="Keep Appointment"
        isDangerous={true}
        loading={actionLoading}
        onConfirm={handleConfirmReject}
        onCancel={() => {
          setRejectModalOpen(false);
          setSelectedAppt(null);
        }}
      />



    </div>
  );
};

export default DoctorAppointmentsPage;
