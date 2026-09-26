import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import DoctorReviewModal from '../../components/admin/DoctorReviewModal';
import { SkeletonStatCard, SkeletonListItem } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import adminService from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Calendar,
  AlertCircle,
  Activity,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  Check,
  Ban,
  Clock,
} from 'lucide-react';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton } from '../../components/common/buttons';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingApprovals: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Modal state
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes, apptsRes] = await Promise.all([
        adminService.getStats(),
        adminService.getDoctors({ approvalStatus: 'PENDING' }),
        adminService.getAppointments(),
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (pendingRes.data) setPendingDoctors(pendingRes.data.slice(0, 5));
      if (apptsRes.data) setRecentAppointments(apptsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
      toastError(err.message || 'Could not load administrative analytics', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await adminService.approveDoctor(id);
      success('Doctor application approved successfully. Physician can now accept consultations.', 'Approved');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDashboardData();
    } catch (err) {
      toastError(err.message || 'Failed to approve doctor', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id, reason) => {
    setActionLoading(true);
    try {
      await adminService.rejectDoctor(id, reason);
      success('Doctor application rejected.', 'Rejected');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDashboardData();
    } catch (err) {
      toastError(err.message || 'Failed to reject doctor', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleDoctorStatus = async (id, isActive) => {
    setActionLoading(true);
    try {
      await adminService.toggleDoctorStatus(id, isActive);
      success(`Doctor account has been ${isActive ? 'activated' : 'deactivated'}`, 'Status Updated');
      setReviewModalOpen(false);
      setSelectedDoctor(null);
      fetchDashboardData();
    } catch (err) {
      toastError(err.message || 'Failed to update doctor account status', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div className="dashboard-layout">
          {/* Left Admin Sidebar */}
          <AdminSidebar />

          {/* Main Governance Content */}
          <div>
            {/* Welcome Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
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
                    Platform Governance
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.6)' }}>
                    • Administrator: {user?.name}
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
                  Platform Overview & Control
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                  Supervise verification, physician credentials, appointments, and clinical records.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <SecondaryGlassButton to="/admin/doctors" size="sm" icon={<Stethoscope size={15} />}>
                  Doctors
                </SecondaryGlassButton>
                <SecondaryGlassButton to="/admin/patients" size="sm" icon={<Users size={15} />}>
                  Patients
                </SecondaryGlassButton>
                <PrimaryGlassButton to="/admin/appointments" size="sm" icon={<Calendar size={15} />}>
                  Appointments
                </PrimaryGlassButton>
              </div>
            </div>

            {/* Metric Cards Row: 6 Real Statistics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              {loading ? (
                <>{[1,2,3,4,5,6].map(i => <SkeletonStatCard key={i} />)}</>
              ) : (
                <>
                  <DashboardCard title="Total Patients" value={stats.totalPatients} icon={Users} variant="primary" subtitle="Registered users" />
                  <DashboardCard title="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} variant="secondary" subtitle="Credentialed physicians" />
                  <DashboardCard title="Total Appointments" value={stats.totalAppointments} icon={Calendar} variant="primary" subtitle="Consultations" />
                  <DashboardCard title="Pending Approvals" value={stats.pendingApprovals} icon={AlertCircle} variant="danger" subtitle="Awaiting review" />
                  <DashboardCard title="Completed Visits" value={stats.completedAppointments} icon={CheckCircle2} variant="success" subtitle="Concluded visits" />
                  <DashboardCard title="Cancelled Visits" value={stats.cancelledAppointments} icon={XCircle} variant="secondary" subtitle="Voided slots" />
                </>
              )}
            </div>

            {/* Pending Doctor Approvals Review Queue */}
            <div
              className="glass-card"
              style={{
                marginBottom: '2rem',
                padding: '1.75rem',
                background: 'rgba(18, 20, 29, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
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
                  <AlertCircle size={20} color="#fbbf24" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                    Physician Licensure Review Queue ({stats.pendingApprovals})
                  </h3>
                </div>
                <Link
                  to="/admin/doctors?approvalStatus=PENDING"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>View All Doctors</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {loading ? (
                <LoadingSpinner text="Retrieving licensure verification queue..." />
              ) : pendingDoctors.length > 0 ? (
                <div
                  style={{
                    overflowX: 'auto',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <th style={{ padding: '0.85rem 1rem', color: 'rgba(200, 205, 225, 0.7)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physician</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'rgba(200, 205, 225, 0.7)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialty</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'rgba(200, 205, 225, 0.7)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>License ID</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'rgba(200, 205, 225, 0.7)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital</th>
                        <th style={{ padding: '0.85rem 1rem', color: 'rgba(200, 205, 225, 0.7)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDoctors.map((doc) => (
                        <tr key={doc._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>
                            {doc.user?.name || 'Physician'}
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.65)', fontWeight: 400 }}>
                              {doc.user?.email}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#38bdf8' }}>{doc.specialization}</td>
                          <td style={{ padding: '1rem' }}>
                            <code style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                              {doc.licenseNumber}
                            </code>
                          </td>
                          <td style={{ padding: '1rem', color: 'rgba(200, 205, 225, 0.8)' }}>
                            {doc.hospitalAffiliation || 'Independent Practice'}
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <SecondaryGlassButton
                                size="sm"
                                onClick={() => {
                                  setSelectedDoctor(doc);
                                  setReviewModalOpen(true);
                                }}
                                icon={<Eye size={13} />}
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                              >
                                Review
                              </SecondaryGlassButton>
                              <GlassButton
                                variant="success"
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => handleApprove(doc._id)}
                                icon={<Check size={13} />}
                                title="Approve immediately"
                                style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                              >
                                Approve
                              </GlassButton>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                  <CheckCircle2 size={36} color="#34d399" style={{ margin: '0 auto 0.75rem auto' }} />
                  <p style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', margin: 0 }}>
                    No Pending Physician Approvals
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(148, 163, 184, 0.65)', marginTop: '0.35rem', margin: 0 }}>
                    All registered doctors have been credentialed and verified.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Platform Appointments Feed */}
            <div
              className="glass-card"
              style={{
                padding: '1.75rem',
                background: 'rgba(18, 20, 29, 0.65)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
              }}
            >
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
                    Recent Consultation Activity
                  </h3>
                </div>
                <Link
                  to="/admin/appointments"
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  <span>View All ({stats.totalAppointments})</span>
                  <ArrowRight size={15} />
                </Link>
              </div>

              {recentAppointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {recentAppointments.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        padding: '1rem 1.25rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.88rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ color: 'rgba(200, 205, 225, 0.85)' }}>
                        <strong style={{ color: '#ffffff' }}>
                          {a.date ? new Date(a.date).toLocaleDateString() : '—'}
                        </strong> at {a.startTime} •{' '}
                        <span>Patient: <strong style={{ color: '#ffffff' }}>{a.patient?.user?.name || 'Patient'}</strong></span> •{' '}
                        <span>Doctor: <strong style={{ color: '#38bdf8' }}>{a.doctor?.user?.name || 'Doctor'}</strong> ({a.doctor?.specialization})</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          backgroundColor:
                            a.status === 'COMPLETED'
                              ? 'rgba(56, 189, 248, 0.15)'
                              : a.status === 'CONFIRMED'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : a.status === 'CANCELLED'
                              ? 'rgba(244, 63, 94, 0.15)'
                              : 'rgba(245, 158, 11, 0.15)',
                          color:
                            a.status === 'COMPLETED'
                              ? '#38bdf8'
                              : a.status === 'CONFIRMED'
                              ? '#34d399'
                              : a.status === 'CANCELLED'
                              ? '#fb7185'
                              : '#fbbf24',
                          border: `1px solid ${
                            a.status === 'COMPLETED'
                              ? 'rgba(56, 189, 248, 0.3)'
                              : a.status === 'CONFIRMED'
                              ? 'rgba(16, 185, 129, 0.3)'
                              : a.status === 'CANCELLED'
                              ? 'rgba(244, 63, 94, 0.3)'
                              : 'rgba(245, 158, 11, 0.3)'
                          }`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'rgba(148, 163, 184, 0.6)', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>
                  No appointments booked on the platform yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <DoctorReviewModal
        isOpen={reviewModalOpen}
        doctor={selectedDoctor}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedDoctor(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onToggleStatus={handleToggleDoctorStatus}
        actionLoading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;
