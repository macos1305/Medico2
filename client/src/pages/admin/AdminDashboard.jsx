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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
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
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-admin">Platform Governance</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Administrator: {user?.name}
                  </span>
                </div>
                <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                  Platform Overview & Control
                </h1>
                <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>
                  Supervise verification, physician credentials, appointments, and clinical records.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <Link to="/admin/doctors" className="btn btn-secondary btn-sm">
                  <Stethoscope size={16} /> Doctors
                </Link>
                <Link to="/admin/patients" className="btn btn-secondary btn-sm">
                  <Users size={16} /> Patients
                </Link>
                <Link to="/admin/appointments" className="btn btn-primary btn-sm">
                  <Calendar size={16} /> Appointments
                </Link>
              </div>
            </div>

            {/* Metric Cards Row: 6 Real Statistics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              {loading ? (
                <>{[1,2,3,4,5,6].map(i => <SkeletonStatCard key={i} />)}</>
              ) : (
                <>
                  <DashboardCard title="Total Patients" value={stats.totalPatients} icon={Users} variant="primary" subtitle="Registered patients" />
                  <DashboardCard title="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} variant="secondary" subtitle="Credentialed physicians" />
                  <DashboardCard title="Total Appointments" value={stats.totalAppointments} icon={Calendar} variant="primary" subtitle="All consultations" />
                  <DashboardCard title="Pending Approvals" value={stats.pendingApprovals} icon={AlertCircle} variant="danger" subtitle="Awaiting review" />
                  <DashboardCard title="Completed Visits" value={stats.completedAppointments} icon={CheckCircle2} variant="success" subtitle="Successful sessions" />
                  <DashboardCard title="Cancelled Visits" value={stats.cancelledAppointments} icon={XCircle} variant="secondary" subtitle="Voided slots" />
                </>
              )}
            </div>

            {/* Pending Doctor Approvals Review Queue */}
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
                  <AlertCircle size={20} color="var(--accent-amber)" />
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--slate-900)' }}>
                    Physician Licensure Review Queue ({stats.pendingApprovals})
                  </h3>
                </div>
                <Link
                  to="/admin/doctors?approvalStatus=PENDING"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary-600)',
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
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontWeight: 600 }}>Physician</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontWeight: 600 }}>Specialty</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontWeight: 600 }}>License ID</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontWeight: 600 }}>Hospital</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)', fontWeight: 600 }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingDoctors.map((doc) => (
                        <tr key={doc._id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                          <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: 'var(--slate-900)' }}>
                            {doc.user?.name || 'Physician'}
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 400 }}>
                              {doc.user?.email}
                            </span>
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>{doc.specialization}</td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <code style={{ backgroundColor: 'var(--slate-100)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                              {doc.licenseNumber}
                            </code>
                          </td>
                          <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-600)' }}>
                            {doc.hospitalAffiliation || 'Independent Practice'}
                          </td>
                          <td style={{ padding: '0.85rem 1rem' }}>
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDoctor(doc);
                                  setReviewModalOpen(true);
                                }}
                                className="btn btn-secondary btn-sm"
                                style={{ gap: '0.25rem', padding: '0.35rem 0.65rem' }}
                              >
                                <Eye size={13} />
                                <span>Review</span>
                              </button>
                              <button
                                type="button"
                                disabled={actionLoading}
                                onClick={() => handleApprove(doc._id)}
                                className="btn btn-primary btn-sm"
                                style={{ gap: '0.25rem', padding: '0.35rem 0.65rem' }}
                                title="Approve immediately"
                              >
                                <Check size={13} />
                                <span>Approve</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-500)' }}>
                  <CheckCircle2 size={36} color="var(--primary-600)" style={{ margin: '0 auto 0.75rem auto' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    No Pending Physician Approvals
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-400)', marginTop: '2px' }}>
                    All registered doctors have been credentialed and verified.
                  </p>
                </div>
              )}
            </div>

            {/* Recent Platform Appointments Feed */}
            <div className="card" style={{ padding: '1.75rem' }}>
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
                    Recent Consultation Activity
                  </h3>
                </div>
                <Link
                  to="/admin/appointments"
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--primary-600)',
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentAppointments.map((a) => (
                    <div
                      key={a._id}
                      style={{
                        padding: '0.85rem 1.15rem',
                        backgroundColor: 'var(--slate-50)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.875rem',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div>
                        <strong>{a.date}</strong> at {a.startTime} •{' '}
                        <span>Patient: <strong>{a.patient?.user?.name || 'Patient'}</strong></span> •{' '}
                        <span>Doctor: <strong>{a.doctor?.user?.name || 'Doctor'}</strong> ({a.doctor?.specialization})</span>
                      </div>
                      <span className={`badge ${a.status === 'COMPLETED' ? 'badge-patient' : a.status === 'CONFIRMED' ? 'badge-approved' : a.status === 'CANCELLED' ? 'badge-rejected' : 'badge-pending'}`}>
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--slate-400)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
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
