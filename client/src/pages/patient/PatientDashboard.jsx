import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientSidebar from '../../components/patient/PatientSidebar';
import DashboardCard from '../../components/dashboard/DashboardCard';
import appointmentService from '../../services/appointmentService';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Search,
  User,
  Clock,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';

const PatientDashboard = () => {
  const { user, profile } = useAuth();
  const [upcomingList, setUpcomingList] = useState([]);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [cancelledCount, setCancelledCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardAppointments = async () => {
      setLoading(true);
      try {
        const [upcomingRes, pastRes, cancelledRes] = await Promise.allSettled([
          appointmentService.getMyAppointments('upcoming'),
          appointmentService.getMyAppointments('past'),
          appointmentService.getMyAppointments('cancelled'),
        ]);

        const upcoming = upcomingRes.status === 'fulfilled' ? upcomingRes.value.data || [] : [];
        const past = pastRes.status === 'fulfilled' ? pastRes.value.data || [] : [];
        const cancelled = cancelledRes.status === 'fulfilled' ? cancelledRes.value.data || [] : [];

        setUpcomingList(upcoming);
        setUpcomingCount(upcoming.length);
        setCompletedCount(past.length);
        setCancelledCount(cancelled.length);
      } catch (err) {
        console.error('Failed to load dashboard appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardAppointments();
  }, []);

  const nextAppointment = upcomingList.length > 0 ? upcomingList[0] : null;

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
          {/* Left Sidebar */}
          <PatientSidebar />

          {/* Main Dashboard Body */}
          <div>
            {/* Header */}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-patient">Patient Overview</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                    Portal Active
                  </span>
                </div>
                <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                  Welcome back, {user?.name}!
                </h1>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                  Access your upcoming consultations, medical records, and certified specialists.
                </p>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link to="/patient/appointments" className="btn btn-secondary">
                  <Calendar size={18} />
                  <span>My Appointments</span>
                </Link>
                <Link to="/doctors" className="btn btn-primary">
                  <Search size={18} />
                  <span>Find Doctors</span>
                </Link>
              </div>
            </div>

            {/* Metrics Row: 3 DashboardCards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              <DashboardCard
                title="Upcoming Appointments"
                value={upcomingCount}
                icon={Calendar}
                variant="primary"
                subtitle="Scheduled consultation slots"
              />
              <DashboardCard
                title="Completed Visits"
                value={completedCount}
                icon={CheckCircle2}
                variant="success"
                subtitle="Past consultations concluded"
              />
              <DashboardCard
                title="Cancelled Visits"
                value={cancelledCount}
                icon={XCircle}
                variant="danger"
                subtitle="Voided appointments"
              />
            </div>

            {/* Appointment State: Next Appointment or Clean Empty State */}
            {nextAppointment ? (
              <div
                className="card"
                style={{
                  marginBottom: '2rem',
                  padding: '1.75rem',
                  borderLeft: '4px solid var(--primary-600)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="badge badge-approved">Next Upcoming Consultation</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                      Slot Confirmed
                    </span>
                  </div>
                  <Link
                    to="/patient/appointments"
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <span>View all ({upcomingCount})</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                      {nextAppointment.doctor?.user?.name || nextAppointment.doctor?.name || 'Doctor'}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-700)', fontWeight: 600, fontSize: '0.9rem' }}>
                      <Stethoscope size={15} />
                      <span>{nextAppointment.doctor?.specialization || 'Specialist'}</span>
                    </div>
                    <p style={{ color: 'var(--slate-600)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                      <strong>Reason:</strong> {nextAppointment.reason}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--slate-50)',
                      borderRadius: 'var(--radius-md)',
                      width: 'fit-content',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-800)', fontWeight: 600 }}>
                      <Calendar size={16} color="var(--primary-600)" />
                      <span>{nextAppointment.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)', fontSize: '0.875rem' }}>
                      <Clock size={16} color="var(--primary-600)" />
                      <span>{nextAppointment.startTime} - {nextAppointment.endTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem 1.5rem', textAlign: 'center' }}>
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
                  No Appointments Scheduled
                </h3>
                <p
                  style={{
                    color: 'var(--slate-500)',
                    fontSize: '0.925rem',
                    maxWidth: '460px',
                    margin: '0 auto 1.5rem auto',
                    lineHeight: 1.6,
                  }}
                >
                  You currently have no scheduled medical consultations. Browse our network of certified physicians and book a suitable time.
                </p>
                <Link to="/doctors" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                  <Search size={16} />
                  <span>Explore Doctor Directory</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}

            {/* Quick Medical Snapshot Card */}
            <div className="card">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1.25rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} color="var(--primary-600)" />
                  Your Profile Snapshot
                </h3>
                <Link
                  to="/patient/profile"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}
                >
                  Edit Profile →
                </Link>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  fontSize: '0.9rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>
                    Email
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{user?.email}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>
                    Phone
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                    {user?.phone || 'Not set'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>
                    Blood Group
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-rose)' }}>
                    {profile?.bloodGroup || 'UNKNOWN'}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--slate-400)', display: 'block', fontSize: '0.78rem' }}>
                    Known Allergies
                  </span>
                  <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
                    {profile?.allergies?.length > 0 ? profile.allergies.join(', ') : 'None documented'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default PatientDashboard;
