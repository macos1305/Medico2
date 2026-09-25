import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import PatientDetailsModal from '../../components/doctor/PatientDetailsModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { SkeletonStatCard, SkeletonListItem } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
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
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton, DangerGlassButton } from '../../components/common/buttons';

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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div className="dashboard-layout">
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
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
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
                    Physician Portal
                  </span>
                  {status === 'APPROVED' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        color: '#34d399',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      <ShieldCheck size={12} /> Board Verified
                    </span>
                  )}
                  {status === 'PENDING' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        color: '#fbbf24',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      Verification Pending
                    </span>
                  )}
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                    fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '0.35rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {user?.name || 'Doctor Practice'}
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem' }}>
                  {profile?.specialization}{profile?.hospitalAffiliation ? ` • ${profile.hospitalAffiliation}` : ''}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <SecondaryGlassButton to="/doctor/appointments" size="sm" icon={<Calendar size={15} />}>
                  Appointments
                </SecondaryGlassButton>
                <PrimaryGlassButton to="/doctor/availability" size="sm" icon={<Clock size={15} />}>
                  Manage Availability
                </PrimaryGlassButton>
              </div>
            </div>

            {/* Verification Notice Banner if Pending */}
            {status === 'PENDING' && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '2rem',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <AlertTriangle size={24} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.25rem' }}>
                    Credentialing Verification Under Review
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(253, 230, 138, 0.85)', lineHeight: 1.5, margin: 0 }}>
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
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {loading ? (
                <>
                  {[1,2,3,4,5].map(i => <SkeletonStatCard key={i} />)}
                </>
              ) : (
                <>
                  <DashboardCard title="Today's Schedule" value={stats.today} icon={Calendar} variant="primary" subtitle="Visits today" />
                  <DashboardCard title="Upcoming" value={stats.upcoming} icon={Clock} variant="secondary" subtitle="Future appointments" />
                  <DashboardCard title="Completed" value={stats.completed} icon={CheckCircle2} variant="success" subtitle="Concluded consultations" />
                  <DashboardCard title="Cancelled" value={stats.cancelled} icon={XCircle} variant="danger" subtitle="Voided slots" />
                  <DashboardCard title="Total Patients" value={stats.totalPatients} icon={Users} variant="primary" subtitle="Unique patients" />
                </>
              )}
            </div>

            {/* Today's Consultations Feed */}
            <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Calendar size={20} color="#38bdf8" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                    Today's Consultations ({todayAppointments.length})
                  </h3>
                </div>
                <Link
                  to="/doctor/appointments"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#38bdf8',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[1, 2].map(i => <SkeletonListItem key={i} />)}
                </div>
              ) : todayAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {todayAppointments.map((appt) => {
                    const patientUser = appt.patient?.user;
                    const isActionable = appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED';

                    return (
                      <div
                        key={appt._id}
                        className="glass-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1.15rem 1.35rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          flexWrap: 'wrap',
                          gap: '1rem',
                        }}
                      >
                        {/* Left: Time & Patient Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
                          <div
                            style={{
                              padding: '0.55rem 0.85rem',
                              backgroundColor: 'rgba(56, 189, 248, 0.08)',
                              borderRadius: '12px',
                              border: '1px solid rgba(56, 189, 248, 0.2)',
                              textAlign: 'center',
                              minWidth: '95px',
                            }}
                          >
                            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', display: 'block' }}>
                              {appt.startTime}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: 'rgba(200, 205, 225, 0.65)' }}>
                              to {appt.endTime}
                            </span>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                                {patientUser?.name || 'Patient'}
                              </h4>
                              <span
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '999px',
                                  backgroundColor:
                                    appt.status === 'COMPLETED'
                                      ? 'rgba(56, 189, 248, 0.15)'
                                      : appt.status === 'CONFIRMED'
                                      ? 'rgba(16, 185, 129, 0.15)'
                                      : 'rgba(245, 158, 11, 0.15)',
                                  color:
                                    appt.status === 'COMPLETED'
                                      ? '#38bdf8'
                                      : appt.status === 'CONFIRMED'
                                      ? '#34d399'
                                      : '#fbbf24',
                                  border: `1px solid ${
                                    appt.status === 'COMPLETED'
                                      ? 'rgba(56, 189, 248, 0.3)'
                                      : appt.status === 'CONFIRMED'
                                      ? 'rgba(16, 185, 129, 0.3)'
                                      : 'rgba(245, 158, 11, 0.3)'
                                  }`,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {appt.status}
                              </span>
                            </div>
                            <p style={{ fontSize: '0.82rem', color: 'rgba(200, 205, 225, 0.7)', marginTop: '0.25rem', margin: 0 }}>
                              <strong style={{ color: 'rgba(200, 205, 225, 0.9)' }}>Reason:</strong> {appt.reason || 'General Consultation'}
                            </p>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <SecondaryGlassButton
                            size="sm"
                            onClick={() => {
                              setSelectedAppt(appt);
                              setDetailsModalOpen(true);
                            }}
                            icon={<Eye size={14} />}
                          >
                            Details
                          </SecondaryGlassButton>

                          {isActionable && (
                            <>
                              <PrimaryGlassButton
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleMarkComplete(appt)}
                                icon={<Check size={14} />}
                                title="Mark as Completed"
                              >
                                Complete
                              </PrimaryGlassButton>

                              <DangerGlassButton
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleOpenReject(appt)}
                                icon={<Ban size={14} />}
                                title="Cancel visit"
                              >
                                Cancel
                              </DangerGlassButton>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon="calendar"
                  title="No Consultations Today"
                  message="No patient appointments are scheduled for today."
                  primaryAction={{ to: '/doctor/availability', label: 'Set Availability', icon: Clock }}
                />
              )}
            </div>

            {/* Quick Practice Info Card */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1.25rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem', margin: 0 }}>
                  <Stethoscope size={18} color="#38bdf8" />
                  <span>Clinical Snapshot</span>
                </h3>
                <Link to="/doctor/profile" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
                  Edit Profile →
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
                  <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>License Number</span>
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>{profile?.licenseNumber}</span>
                </div>
                <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
                  <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Consultation Fee</span>
                  <span style={{ fontWeight: 700, color: '#38bdf8', fontSize: '0.92rem' }}>₹{profile?.consultationFee || 0}</span>
                </div>
                <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
                  <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Hospital Affiliation</span>
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>{profile?.hospitalAffiliation || 'Independent Practice'}</span>
                </div>
                <div style={{ padding: '0.85rem 1rem', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px' }}>
                  <span style={{ color: 'rgba(148, 163, 184, 0.7)', display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>Practice Location</span>
                  <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>{profile?.location || 'Main Medical Center'}</span>
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

export default DoctorDashboard;
