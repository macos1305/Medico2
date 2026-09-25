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
    const badgeMap = {
      CONFIRMED:   { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)', label: 'Confirmed' },
      PENDING:     { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', label: 'Pending' },
      RESCHEDULED: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)', label: 'Rescheduled' },
      COMPLETED:   { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: 'rgba(56, 189, 248, 0.3)', label: 'Completed' },
      CANCELLED:   { bg: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.3)', label: 'Cancelled' },
    };
    const b = badgeMap[status] || badgeMap.PENDING;
    return (
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '0.2rem 0.6rem',
          borderRadius: '999px',
          backgroundColor: b.bg,
          color: b.color,
          border: `1px solid ${b.border}`,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {b.label}
      </span>
    );
  };

  const tabs = [
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
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
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      color: '#c084fc',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Clinical Schedule
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    margin: 0,
                  }}
                >
                  Patient Appointments
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                  Manage consultations, inspect clinical reasons/symptoms, confirm visits, or complete appointments.
                </p>
              </div>
            </div>

            {/* Segmented Glass Filter Tabs */}
            <div
              style={{
                display: 'inline-flex',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(20px)',
                padding: '0.3rem',
                borderRadius: '9999px',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                gap: '0.25rem',
                flexWrap: 'wrap',
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: '0.5rem 1.15rem',
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
                      className="glass-card glass-card-hover"
                      style={{
                        padding: '1.75rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '24px',
                        background: 'rgba(18, 20, 29, 0.65)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        {/* Top: Date & Status */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '1rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#38bdf8' }}>
                            <Calendar size={16} />
                            <strong style={{ color: '#ffffff' }}>
                              {appt.date ? new Date(appt.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : '—'}
                            </strong>
                          </div>
                          {getStatusBadge(appt.status)}
                        </div>

                        {/* Patient Info */}
                        <div style={{ marginBottom: '1.25rem' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                            {patientUser?.name || 'Patient'}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(200, 205, 225, 0.65)', flexWrap: 'wrap' }}>
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
                                color: '#fb7185',
                                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                                border: '1px solid rgba(244, 63, 94, 0.25)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '6px',
                                marginTop: '0.5rem',
                              }}
                            >
                              Blood: {patientData.bloodGroup}
                            </span>
                          )}
                        </div>

                        {/* Slot Time & Reason/Symptoms */}
                        <div
                          style={{
                            padding: '0.85rem 1rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '14px',
                            marginBottom: '1.25rem',
                            fontSize: '0.85rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.35rem' }}>
                            <Clock size={14} />
                            <span>
                              {appt.startTime} - {appt.endTime}
                            </span>
                          </div>
                          <div style={{ color: '#ffffff', marginBottom: '0.25rem' }}>
                            <strong style={{ color: 'rgba(200, 205, 225, 0.7)' }}>Reason:</strong> {appt.reason}
                          </div>
                          {appt.symptoms && (
                            <div style={{ color: 'rgba(200, 205, 225, 0.65)', fontSize: '0.8rem' }}>
                              <strong style={{ color: 'rgba(200, 205, 225, 0.7)' }}>Symptoms:</strong> {appt.symptoms}
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
                          paddingTop: '1rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                          flexWrap: 'wrap',
                        }}
                      >
                        <SecondaryGlassButton
                          size="sm"
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
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleConfirm(appt)}
                                icon={<Check size={14} />}
                                title="Confirm Appointment"
                              >
                                Confirm
                              </GlassButton>
                            )}

                            <PrimaryGlassButton
                              size="sm"
                              disabled={actionLoading}
                              onClick={() => handleMarkComplete(appt)}
                              icon={<CheckCircle2 size={14} />}
                              title="Mark as Completed"
                            >
                              Complete
                            </PrimaryGlassButton>

                            <DangerGlassButton
                              size="sm"
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
                className="glass-card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: '24px',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                  }}
                >
                  <Calendar size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                  No {activeTab} Appointments
                </h3>
                <p
                  style={{
                    color: 'rgba(200, 205, 225, 0.65)',
                    fontSize: '0.92rem',
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
        message={`Are you sure you want to cancel the appointment with ${selectedAppt?.patient?.user?.name || 'this patient'} on ${selectedAppt?.date ? new Date(selectedAppt.date).toLocaleDateString() : ''} at ${selectedAppt?.startTime}? The reserved time slot will become available for booking.`}
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
