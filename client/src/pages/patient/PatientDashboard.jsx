import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientSidebar from '../../components/patient/PatientSidebar';
import { SkeletonStatCard, SkeletonText } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import appointmentService from '../../services/appointmentService';
import DashboardCard from '../../components/dashboard/DashboardCard';
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

/* ── Profile Field ──────────────────────────────────────────────────────────── */
const ProfileField = ({ label, value }) => (
  <div
    style={{
      padding: '0.85rem 1rem',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderRadius: '14px',
    }}
  >
    <span
      style={{
        display: 'block',
        fontSize: '0.72rem',
        color: 'rgba(148, 163, 184, 0.7)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '0.3rem',
      }}
    >
      {label}
    </span>
    <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.92rem' }}>
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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        {/* Dashboard Grid */}
        <div className="dashboard-layout">
          {/* Sidebar */}
          <PatientSidebar />

          {/* Main Content */}
          <main>
            {/* ── Page Header ───────────────────────────────────────────── */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
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
                      background: 'rgba(56, 189, 248, 0.1)',
                      border: '1px solid rgba(56, 189, 248, 0.25)',
                      color: '#38bdf8',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Patient Overview
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.6)' }}>• Portal Active</span>
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
                  {greeting()}, <span style={{ background: 'linear-gradient(135deg, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0] || 'there'}</span>! 👋
                </h1>
                <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem' }}>
                  Here is an overview of your health appointments and medical consultations.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
              {loading ? (
                <>
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                  <SkeletonStatCard />
                </>
              ) : (
                <>
                  <DashboardCard
                    title="Upcoming Consultations"
                    value={upcomingCount}
                    icon={Calendar}
                    variant="primary"
                    subtitle="Scheduled appointments"
                  />
                  <DashboardCard
                    title="Completed Visits"
                    value={completedCount}
                    icon={CheckCircle2}
                    variant="success"
                    subtitle="Concluded sessions"
                  />
                  <DashboardCard
                    title="Cancelled Visits"
                    value={cancelledCount}
                    icon={XCircle}
                    variant="danger"
                    subtitle="Voided appointments"
                  />
                </>
              )}
            </div>

            {/* ── Next Appointment Card ─────────────────────────────────── */}
            {loading ? (
              <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
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
                className="glass-card"
                style={{
                  marginBottom: '2rem',
                  padding: '1.75rem',
                  borderLeft: '4px solid #38bdf8',
                  background: 'rgba(18, 20, 29, 0.75)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(56, 189, 248, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.25rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <TrendingUp size={16} color="#38bdf8" />
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#f8fafc', letterSpacing: '0.02em' }}>
                      Next Upcoming Consultation
                    </span>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Confirmed
                    </span>
                  </div>
                  <Link
                    to="/patient/appointments"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'color 0.2s',
                    }}
                  >
                    View all ({upcomingCount}) <ArrowRight size={13} />
                  </Link>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1.25rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Doctor Avatar */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
                      color: '#38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                      flexShrink: 0,
                      border: '2px solid rgba(56, 189, 248, 0.35)',
                      boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    {(nextAppointment.doctor?.user?.name || nextAppointment.doctor?.name || 'D').charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        marginBottom: '0.25rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {nextAppointment.doctor?.user?.name || nextAppointment.doctor?.name || 'Doctor'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                      <Stethoscope size={14} />
                      <span>{nextAppointment.doctor?.specialization || 'Specialist'}</span>
                    </div>
                    <p style={{ color: 'rgba(200, 205, 225, 0.65)', fontSize: '0.8rem' }}>
                      <strong style={{ color: 'rgba(200, 205, 225, 0.9)' }}>Reason:</strong> {nextAppointment.reason || 'General Health Consultation'}
                    </p>
                  </div>

                  {/* Date/Time pill */}
                  <div
                    style={{
                      padding: '0.85rem 1.15rem',
                      background: 'rgba(56, 189, 248, 0.08)',
                      borderRadius: '16px',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      flexShrink: 0,
                      minWidth: 140,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>
                      <Calendar size={14} color="#38bdf8" />
                      {formatDate(nextAppointment.date)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: 'rgba(200, 205, 225, 0.8)' }}>
                      <Clock size={14} color="#38bdf8" />
                      {nextAppointment.startTime} – {nextAppointment.endTime}
                    </div>
                  </div>
                </div>
              </div>
            ) : !error ? (
              <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <EmptyState
                  icon="calendar"
                  title="No Appointments Scheduled"
                  message="You have no upcoming consultations. Browse our network of certified physicians and book a convenient time slot."
                  primaryAction={{ to: '/doctors', label: 'Explore Doctors', icon: Search }}
                />
              </div>
            ) : null}

            {/* ── Profile Snapshot ──────────────────────────────────────── */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
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
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <User size={18} color="#38bdf8" />
                  Your Profile Snapshot
                </h3>
                <Link
                  to="/patient/profile"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  Edit Profile <ArrowRight size={14} />
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
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
