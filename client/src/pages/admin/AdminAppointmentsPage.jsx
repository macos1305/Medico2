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
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-admin">Master Schedule</span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Platform Consultations Tracker
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
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
                marginBottom: '1.75rem',
              }}
            >
              {/* Status Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.4rem',
                  backgroundColor: 'var(--slate-100)',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                }}
              >
                {['All', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveStatus(st)}
                    className={`btn btn-sm ${activeStatus === st ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ borderRadius: 'var(--radius-md)' }}
                  >
                    {st === 'All' ? 'All Visits' : st}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--slate-400)',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search doctor, patient, reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '2.4rem' }}
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
                        {/* Date & Status */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                            <Calendar size={15} color="var(--primary-600)" />
                            <strong style={{ color: 'var(--slate-900)' }}>{appt.date}</strong>
                          </div>
                          {getStatusBadge(appt.status)}
                        </div>

                        {/* Parties Involved */}
                        <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                              Doctor
                            </span>
                            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                              {doctorUser?.name || 'Doctor'}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: 600 }}>
                              {appt.doctor?.specialization}
                            </div>
                          </div>

                          <div style={{ paddingTop: '0.35rem', borderTop: '1px dashed var(--slate-200)' }}>
                            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)', textTransform: 'uppercase', fontWeight: 700 }}>
                              Patient
                            </span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                              {patientUser?.name || 'Patient'}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                              {patientUser?.email}
                            </div>
                          </div>
                        </div>

                        {/* Time & Reason */}
                        <div
                          style={{
                            padding: '0.65rem 0.85rem',
                            backgroundColor: 'var(--slate-50)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.825rem',
                            marginBottom: '1.25rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--slate-800)', fontWeight: 600, marginBottom: '0.2rem' }}>
                            <Clock size={13} color="var(--primary-600)" />
                            <span>{appt.startTime} - {appt.endTime}</span>
                          </div>
                          <div style={{ color: 'var(--slate-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <strong>Reason:</strong> {appt.reason}
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
                          borderTop: '1px solid var(--border-subtle)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAppt(appt);
                            setDetailsModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ flex: 1, gap: '0.35rem' }}
                        >
                          <Eye size={14} />
                          <span>Details</span>
                        </button>

                        {isActionable && (
                          <button
                            type="button"
                            onClick={() => handleOpenCancel(appt)}
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--accent-rose)' }}
                            title="Cancel Appointment"
                          >
                            <Ban size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <Calendar size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                  No Appointments Found
                </h3>
                <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
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
          onClick={() => {
            setDetailsModalOpen(false);
            setSelectedAppt(null);
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              borderRadius: 'var(--radius-xl)',
              backgroundColor: '#ffffff',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <span className="badge badge-admin">Master Consultation Record</span>
              {getStatusBadge(selectedAppt.status)}
            </div>

            <h3 style={{ fontSize: '1.3rem', color: 'var(--slate-900)', marginBottom: '1rem' }}>
              Consultation #{selectedAppt._id?.slice(-6).toUpperCase()}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Doctor</span>
                <strong>{selectedAppt.doctor?.user?.name}</strong> ({selectedAppt.doctor?.specialization})
              </div>
              <div>
                <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Patient</span>
                <strong>{selectedAppt.patient?.user?.name}</strong> ({selectedAppt.patient?.user?.email})
              </div>
              <div>
                <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Date & Time</span>
                <span>{selectedAppt.date} at {selectedAppt.startTime} - {selectedAppt.endTime}</span>
              </div>
              <div>
                <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Chief Reason</span>
                <span>{selectedAppt.reason}</span>
              </div>
              {selectedAppt.symptoms && (
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Symptoms</span>
                  <span>{selectedAppt.symptoms}</span>
                </div>
              )}
              {selectedAppt.cancellationReason && (
                <div style={{ padding: '0.5rem', backgroundColor: '#ffe4e6', borderRadius: 'var(--radius-sm)', color: 'var(--accent-rose)' }}>
                  <strong>Cancellation Note:</strong> {selectedAppt.cancellationReason}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setDetailsModalOpen(false);
                  setSelectedAppt(null);
                }}
              >
                Close
              </button>
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
