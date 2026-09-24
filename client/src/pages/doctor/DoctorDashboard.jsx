import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import PatientDetailsModal from '../../components/doctor/PatientDetailsModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import appointmentService from '../../services/appointmentService';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  Eye,
  Check,
  Ban,
  Building2,
  Phone,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState({
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalPatients: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, todayRes] = await Promise.all([
        appointmentService.getDoctorStats(),
        appointmentService.getDoctorAppointments({ tab: 'today' }),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (todayRes.data) setTodayAppointments(todayRes.data);
    } catch (err) {
      console.error('Failed to load doctor dashboard data:', err);
      toastError(err.message || 'Could not load dashboard statistics', 'Dashboard Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkComplete = async (appt) => {
    setActionLoading(true);
    try {
      await appointmentService.completeDoctorAppointment(appt._id);
      success(`Appointment with ${appt.patient?.user?.name || 'patient'} marked as completed`, 'Completed');
      fetchDashboardData();
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
      fetchDashboardData();
    } catch (err) {
      toastError(err.message || 'Failed to cancel appointment', 'Action Error');
    } finally {
      setActionLoading(false);
    }
  };

  const status = profile?.approvalStatus || 'PENDING';

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

          {/* Main Dashboard Content */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-doctor">Doctor Portal</span>
                  {status === 'APPROVED' && (
                    <span className="badge badge-approved">
                      <ShieldCheck size={12} /> Board Verified
                    </span>
                  )}
                  {status === 'PENDING' && (
                    <span className="badge badge-pending">
                      Verification Pending
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  {user?.name || 'Doctor Practice'}
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  {profile?.specialization} • {profile?.hospitalAffiliation || 'Independent Practice'}
                </p>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/doctor/appointments" className="btn btn-secondary">
                  <Calendar size={18} />
                  <span>Appointments</span>
                </Link>
                <Link to="/doctor/availability" className="btn btn-primary">
                  <Clock size={18} />
                  <span>Set Availability</span>
                </Link>
              </div>
            </div>

            {/* Verification Notice Banner if Pending */}
            {status === 'PENDING' && (
              <div
                style={{
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <AlertTriangle size={24} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#92400e', marginBottom: '0.25rem' }}>
                    Credentialing Verification Under Review
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#b45309', lineHeight: 1.5 }}>
                    Your medical license <strong>{profile?.licenseNumber}</strong> is currently being verified by Medico administrators. You can configure your availability and practice profile in the meantime.
                  </p>
                </div>
              </div>
            )}

            {/* Metrics Row: 5 Stats Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <DashboardCard
                title="Today's Schedule"
                value={stats.today}
                icon={Calendar}
                variant="primary"
                subtitle="Visits scheduled today"
              />
              <DashboardCard
                title="Upcoming"
                value={stats.upcoming}
                icon={Clock}
                variant="secondary"
                subtitle="Future appointments"
              />
              <DashboardCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                variant="success"
                subtitle="Concluded consultations"
              />
              <DashboardCard
                title="Cancelled"
                value={stats.cancelled}
                icon={XCircle}
                variant="danger"
                subtitle="Voided slots"
              />
              <DashboardCard
                title="Total Patients"
                value={stats.totalPatients}
                icon={Users}
                variant="primary"
                subtitle="Unique patients treated"
              />
            </div>

            {/* Today's Consultations Feed */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                    Today's Consultations ({todayAppointments.length})
                  </h3>
                </div>
                <Link
                  to="/doctor/appointments"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>View All Appointments</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner text="Retrieving today's appointments..." />
              ) : todayAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {todayAppointments.map((appt) => {
                    const patientUser = appt.patient?.user;
                    const isActionable = appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED';

                    return (
                      <div
                        key={appt._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.25rem',
                          backgroundColor: 'var(--slate-50)',
                          borderRadius: 'var(--radius-lg)',
                          border: '1px solid var(--border-subtle)',
                          flexWrap: 'wrap',
                          gap: '1rem',
                        }}
                      >
                        {/* Left: Time & Patient Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              padding: '0.5rem 0.75rem',
                              backgroundColor: '#ffffff',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--slate-200)',
                              textAlign: 'center',
                              minWidth: '90px',
                            }}
                          >
                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary-700)', display: 'block' }}>
                              {appt.startTime}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>
                              to {appt.endTime}
                            </span>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <h4 style={{ fontSize: '1.05rem', color: 'var(--slate-900)' }}>
                                {patientUser?.name || 'Patient'}
                              </h4>
                              <span className={`badge ${appt.status === 'COMPLETED' ? 'badge-patient' : appt.status === 'CONFIRMED' ? 'badge-approved' : 'badge-pending'}`}>
                                {appt.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '2px' }}>
                              <strong>Reason:</strong> {appt.reason}
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAppt(appt);
                              setDetailsModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ gap: '0.35rem' }}
                          >
                            <Eye size={14} />
                            <span>Details</span>
                          </button>

                          {isActionable && (
                            <>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleMarkComplete(appt)}
                                className="btn btn-primary btn-sm"
                                style={{ gap: '0.35rem' }}
                                title="Mark as Completed"
                              >
                                <Check size={14} />
                                <span>Complete</span>
                              </button>

                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleOpenReject(appt)}
                                className="btn btn-ghost btn-sm"
                                style={{ color: 'var(--accent-rose)' }}
                                title="Cancel visit"
                              >
                                <Ban size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                  <Calendar size={36} color="var(--slate-300)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <p style={{ fontSize: '0.95rem' }}>No patient appointments scheduled for today.</p>
                </div>
              )}
            </div>

            {/* Quick Practice Info Card */}
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Stethoscope size={18} color="var(--primary-600)" />
                  <span>Clinical Snapshot</span>
                </h3>
                <Link to="/doctor/profile" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                  Edit Profile →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>License Number</span>
                  <span style={{ fontWeight: 600 }}>{profile?.licenseNumber}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Consultation Fee</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>${profile?.consultationFee || 0}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Hospital Affiliation</span>
                  <span style={{ fontWeight: 600 }}>{profile?.hospitalAffiliation || 'Independent Practice'}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>Practice Location</span>
                  <span style={{ fontWeight: 600 }}>{profile?.location || 'Main Medical Center'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Dossier Details Modal */}
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

export default DoctorDashboard;
