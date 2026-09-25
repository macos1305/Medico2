import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminService from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Eye,
  Filter,
  User,
  Stethoscope,
  FileText,
} from 'lucide-react';
import { SecondaryGlassButton, DangerGlassButton } from '../../components/common/buttons';

const AdminAppointmentsPage = () => {
  const { success, error: toastError } = useToast();

  const [activeStatus, setActiveStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation Modal state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Details Modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const query = {};
      if (activeStatus !== 'All') query.status = activeStatus;
      if (searchTerm.trim()) query.search = searchTerm.trim();

      const res = await adminService.getAppointments(query);
      setAppointments(res.data || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
      toastError(err.message || 'Could not load platform appointments', 'Error');
    } finally {
      setLoading(false);
    }
  }, [activeStatus, searchTerm, toastError]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleOpenCancel = (appt) => {
    setSelectedAppt(appt);
    setCancellationReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppt) return;
    setActionLoading(true);
    try {
      await adminService.cancelAppointment(
        selectedAppt._id,
        cancellationReason || 'Cancelled by platform administrator'
      );
      success('Appointment has been cancelled and time slot released.', 'Cancelled');
      setCancelModalOpen(false);
      setSelectedAppt(null);
      fetchAppointments();
    } catch (err) {
      toastError(err.message || 'Failed to cancel appointment', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
          }}>Confirmed</span>
        );
      case 'PENDING':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}>Pending</span>
        );
      case 'RESCHEDULED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(168, 85, 247, 0.15)',
            color: '#c084fc',
            border: '1px solid rgba(168, 85, 247, 0.3)',
          }}>Rescheduled</span>
        );
      case 'COMPLETED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(59, 130, 246, 0.15)',
            color: '#60a5fa',
            border: '1px solid rgba(59, 130, 246, 0.3)',
          }}>Completed</span>
        );
      case 'CANCELLED':
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>Cancelled</span>
        );
      default:
        return (
          <span style={{
            padding: '0.2rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.08)',
            color: '#e2e8f0',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}>{status}</span>
        );
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0', minHeight: '80vh' }}>
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
          {/* Left Admin Sidebar */}
          <AdminSidebar />

          {/* Main Appointments Management */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: '#c084fc',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                  }}>Master Schedule</span>
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.4rem 0' }}>
                  Platform Consultations Tracker
                </h1>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.95rem', margin: 0, maxWidth: '600px' }}>
                  Monitor all consultations across the network, inspect booking reasons, and intervene where required.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {/* Status Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  padding: '0.35rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  flexWrap: 'wrap',
                }}
              >
                {['All', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => {
                  const isActive = activeStatus === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setActiveStatus(st)}
                      style={{
                        padding: '0.45rem 0.95rem',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isActive ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                        color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                        boxShadow: isActive ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
                      }}
                    >
                      {st === 'All' ? 'All Visits' : st}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '300px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Search doctor, patient, reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.65rem',
                    paddingBottom: '0.65rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Appointments Grid */}
            {loading ? (
              <LoadingSpinner text="Retrieving platform appointments..." />
            ) : appointments.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {appointments.map((appt) => {
                  const patientUser = appt.patient?.user;
                  const doctorUser = appt.doctor?.user;
                  const isActionable = appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED';

                  return (
                    <div
                      key={appt._id}
                      className="glass-card glass-card-interactive"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: '16px',
                        background: 'rgba(18, 20, 29, 0.65)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div>
                        {/* Date & Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            <Calendar size={15} color="#60a5fa" />
                            <strong style={{ color: '#ffffff' }}>{appt.date}</strong>
                          </div>
                          {getStatusBadge(appt.status)}
                        </div>

                        {/* Parties Involved */}
                        <div style={{ marginBottom: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                              Doctor
                            </span>
                            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: '0.1rem 0' }}>
                              {doctorUser?.name || 'Doctor'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600 }}>
                              {appt.doctor?.specialization}
                            </div>
                          </div>

                          <div style={{ paddingTop: '0.6rem', borderTop: '1px dashed rgba(255, 255, 255, 0.08)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                              Patient
                            </span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.9)', margin: '0.1rem 0' }}>
                              {patientUser?.name || 'Patient'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                              {patientUser?.email}
                            </div>
                          </div>
                        </div>

                        {/* Time & Reason */}
                        <div
                          style={{
                            padding: '0.75rem 0.85rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '10px',
                            fontSize: '0.825rem',
                            marginBottom: '1.25rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontWeight: 600, marginBottom: '0.3rem' }}>
                            <Clock size={13} color="#60a5fa" />
                            <span>{appt.startTime} - {appt.endTime}</span>
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <strong style={{ color: 'rgba(255, 255, 255, 0.85)' }}>Reason:</strong> {appt.reason}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                      >
                        <SecondaryGlassButton
                          size="small"
                          onClick={() => {
                            setSelectedAppt(appt);
                            setDetailsModalOpen(true);
                          }}
                          icon={<Eye size={14} />}
                          style={{ flex: 1 }}
                        >
                          Details
                        </SecondaryGlassButton>

                        {isActionable && (
                          <DangerGlassButton
                            size="small"
                            iconOnly
                            onClick={() => handleOpenCancel(appt)}
                            icon={<Ban size={15} />}
                            title="Cancel Appointment"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="glass-card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: '16px',
                  background: 'rgba(18, 20, 29, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <Calendar size={36} style={{ margin: '0 auto 0.75rem auto', color: 'rgba(255, 255, 255, 0.3)' }} />
                <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  No Appointments Found
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem' }}>
                  No consultation records match the specified filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      {detailsModalOpen && selectedAppt && (
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
          onClick={() => {
            setDetailsModalOpen(false);
            setSelectedAppt(null);
          }}
        >
          <div
            className="glass-card glass-modal"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              borderRadius: '20px',
              background: 'rgba(18, 20, 29, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
              color: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0.2rem 0.65rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#c084fc',
                border: '1px solid rgba(168, 85, 247, 0.3)',
              }}>Master Consultation Record</span>
              {getStatusBadge(selectedAppt.status)}
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
              Consultation #{selectedAppt._id?.slice(-6).toUpperCase()}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Doctor</span>
                <strong style={{ color: '#ffffff' }}>{selectedAppt.doctor?.user?.name}</strong> <span style={{ color: '#818cf8' }}>({selectedAppt.doctor?.specialization})</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Patient</span>
                <strong style={{ color: '#ffffff' }}>{selectedAppt.patient?.user?.name}</strong> <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>({selectedAppt.patient?.user?.email})</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Date & Time</span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>{selectedAppt.date} at {selectedAppt.startTime} - {selectedAppt.endTime}</span>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Chief Reason</span>
                <span style={{ color: '#ffffff' }}>{selectedAppt.reason}</span>
              </div>
              {selectedAppt.symptoms && (
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <span style={{ color: 'rgba(255, 255, 255, 0.45)', display: 'block', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Symptoms</span>
                  <span style={{ color: '#ffffff' }}>{selectedAppt.symptoms}</span>
                </div>
              )}
              {selectedAppt.cancellationReason && (
                <div style={{ padding: '0.85rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px', color: '#fca5a5' }}>
                  <strong style={{ color: '#ef4444' }}>Cancellation Note:</strong> {selectedAppt.cancellationReason}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <SecondaryGlassButton
                size="small"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedAppt(null);
                }}
              >
                Close
              </SecondaryGlassButton>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={cancelModalOpen}
        title="Admin Cancel Consultation"
        message={`Are you sure you want to cancel the appointment between Dr. ${selectedAppt?.doctor?.user?.name || 'Doctor'} and ${selectedAppt?.patient?.user?.name || 'Patient'} on ${selectedAppt?.date}? The time slot will be freed immediately.`}
        confirmText="Yes, Void Appointment"
        cancelText="Keep"
        isDangerous={true}
        loading={actionLoading}
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setCancelModalOpen(false);
          setSelectedAppt(null);
        }}
      />
    </div>
  );
};

export default AdminAppointmentsPage;
