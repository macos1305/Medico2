import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientSidebar from '../../components/patient/PatientSidebar';
import { SkeletonStatCard, SkeletonText } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import appointmentService from '../../services/appointmentService';
import { PrimaryGlassButton, SecondaryGlassButton, GlassButton, GlassAiButtonWrapper } from '../../components/common/buttons';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  User,
  Clock,
  ArrowRight,
  Stethoscope,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

/* ── Helper: format date string ────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/* ── Stat Card ──────────────────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon: Icon, color, bg, subtitle }) => (
  <div
    className="stat-card"
    style={{ '--card-color': color }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--slate-500)', lineHeight: 1.3 }}>{title}</p>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 'var(--radius-md)',
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={19} />
      </div>
    </div>
    <p style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--slate-900)', lineHeight: 1 }}>{value}</p>
    {subtitle && (
      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)', marginTop: '0.35rem', lineHeight: 1.4 }}>{subtitle}</p>
    )}
  </div>
);

/* ── Profile Field ──────────────────────────────────────────────────────────── */
const ProfileField = ({ label, value }) => (
  <div>
    <span style={{ display: 'block', fontSize: 'var(--text-xs)', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
      {label}
    </span>
    <span style={{ fontWeight: 600, color: 'var(--slate-800)', fontSize: 'var(--text-sm)' }}>
      {value || '—'}
    </span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [upcomingList, setUpcomingList] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [upcomingRes, pastRes, cancelledRes] = await Promise.allSettled([
          appointmentService.getMyAppointments('upcoming'),
          appointmentService.getMyAppointments('past'),
          appointmentService.getMyAppointments('cancelled'),
        ]);

        const upcoming  = upcomingRes.status  === 'fulfilled' ? (upcomingRes.value.data  || []) : [];
        const past      = pastRes.status      === 'fulfilled' ? (pastRes.value.data      || []) : [];
        const cancelled = cancelledRes.status === 'fulfilled' ? (cancelledRes.value.data || []) : [];

        setUpcomingList(upcoming);
        setUpcomingCount(upcoming.length);
        setCompletedCount(past.length);
        setCancelledCount(cancelled.length);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const nextAppointment = upcomingList[0] || null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
      <div className="container">
        {/* Dashboard Grid */}
        <div className="dashboard-layout">
          {/* Sidebar */}
          <PatientSidebar />

          {/* Main */}
          <main>
            {/* ── Page Header ───────────────────────────────────────────── */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span className="badge badge-patient">Patient Overview</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>Portal Active</span>
                </div>
                <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '0.3rem' }}>
                  {greeting()}, {user?.name?.split(' ')[0] || 'there'}! 👋
                </h1>
                <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>
                  Here's a summary of your health journey.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                <GlassAiButtonWrapper
                  to="/patient/recommend-doctor"
                  size="sm"
                  icon={<Sparkles size={15} />}
                >
                  AI Doctor Finder
                </GlassAiButtonWrapper>
                <SecondaryGlassButton
                  to="/patient/appointments"
                  size="sm"
                  icon={<Calendar size={15} />}
                >
                  My Appointments
                </SecondaryGlassButton>
                <GlassButton
                  to="/doctors"
                  variant="outline"
                  size="sm"
                  icon={<Search size={15} />}
                >
                  Find Doctors
                </GlassButton>
              </div>
            </div>

            {/* ── Stat Cards ────────────────────────────────────────────── */}
            <div className="metrics-grid" style={{ marginBottom: '1.75rem' }}>
              {loading ? (
                <>
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                </>
              ) : (
                <>
                  <StatCard
                    title="Upcoming Appointments"
                    value={upcomingCount}
                    icon={Calendar}
                    color="var(--primary-700)"
                    bg="var(--primary-100)"
                    subtitle="Scheduled consultations"
                  />
                  <StatCard
                    title="Completed Visits"
                    value={completedCount}
                    icon={CheckCircle2}
                    color="#059669"
                    bg="#d1fae5"
                    subtitle="Concluded sessions"
                  />
                  <StatCard
                    title="Cancelled Visits"
                    value={cancelledCount}
                    icon={XCircle}
                    color="#e11d48"
                    bg="#ffe4e6"
                    subtitle="Voided appointments"
                  />
                </>
              )}
            </div>

            {/* ── Next Appointment Card ─────────────────────────────────── */}
            {loading ? (
              <div className="card" style={{ marginBottom: '1.75rem', padding: '1.5rem' }}>
                <SkeletonText width="45%" />
                <div style={{ height: '0.75rem' }} />
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div className="skeleton skeleton-avatar" style={{ width: 48, height: 48, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <SkeletonText width="55%" />
                    <SkeletonText width="40%" />
                  </div>
                  <div className="skeleton" style={{ width: 120, height: 60, borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
                </div>
              </div>
            ) : nextAppointment ? (
              <div
                className="card"
                style={{
                  marginBottom: '1.75rem',
                  padding: '1.5rem',
                  borderLeft: '4px solid var(--primary-500)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={16} color="var(--primary-600)" />
                    <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--slate-700)' }}>
                      Next Upcoming Consultation
                    </span>
                    <span className="badge badge-confirmed" style={{ fontSize: '0.62rem' }}>Confirmed</span>
                  </div>
                  <Link
                    to="/patient/appointments"
                    style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    View all ({upcomingCount}) <ArrowRight size={12} />
                  </Link>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      background: 'var(--primary-100)',
                      color: 'var(--primary-700)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.25rem',
                      flexShrink: 0,
                      border: '2px solid var(--primary-200)',
                    }}
                  >
                    {(nextAppointment.doctor?.user?.name || nextAppointment.doctor?.name || 'D').charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'var(--text-lg)',
                        color: 'var(--slate-900)',
                        marginBottom: '0.2rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {nextAppointment.doctor?.user?.name || nextAppointment.doctor?.name || 'Doctor'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '0.3rem' }}>
                      <Stethoscope size={14} />
                      <span>{nextAppointment.doctor?.specialization || 'Specialist'}</span>
                    </div>
                    <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-xs)' }}>
                      <strong>Reason:</strong> {nextAppointment.reason || '—'}
                    </p>
                  </div>

                  {/* Date/Time pill */}
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      background: 'var(--primary-50)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--primary-100)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      flexShrink: 0,
                      minWidth: 130,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--primary-800)' }}>
                      <Calendar size={13} />
                      {formatDate(nextAppointment.date)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--primary-600)' }}>
                      <Clock size={13} />
                      {nextAppointment.startTime} – {nextAppointment.endTime}
                    </div>
                  </div>
                </div>
              </div>
            ) : !error ? (
              <div className="card" style={{ marginBottom: '1.75rem' }}>
                <EmptyState
                  icon="calendar"
                  title="No Appointments Scheduled"
                  message="You have no upcoming consultations. Browse our network of certified physicians and book a convenient time slot."
                  primaryAction={{ to: '/doctors', label: 'Explore Doctors', icon: Search }}
                />
              </div>
            ) : null}

            {/* ── Profile Snapshot ──────────────────────────────────────── */}
            <div className="card">
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
                <h3 style={{ fontSize: 'var(--text-lg)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--primary-600)" />
                  Your Profile Snapshot
                </h3>
                <Link to="/patient/profile" style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--primary-600)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Edit Profile <ArrowRight size={14} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {loading ? (
                  <>
                    <SkeletonText width="70%" />
                    <SkeletonText width="70%" />
                    <SkeletonText width="70%" />
                    <SkeletonText width="70%" />
                  </>
                ) : (
                  <>
                    <ProfileField label="Email" value={user?.email} />
                    <ProfileField label="Phone" value={user?.phone || 'Not set'} />
                    <ProfileField label="Blood Group" value={profile?.bloodGroup || 'UNKNOWN'} />
                    <ProfileField
                      label="Known Allergies"
                      value={profile?.allergies?.length > 0 ? profile.allergies.join(', ') : 'None documented'}
                    />
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
