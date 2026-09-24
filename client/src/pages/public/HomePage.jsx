import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  HeartPulse,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Award,
  ArrowRight,
} from 'lucide-react';

const specialties = [
  { name: 'Cardiology', desc: 'Heart & vascular conditions', icon: HeartPulse, count: '12 Specialists' },
  { name: 'Dermatology', desc: 'Skin health and cosmetics', icon: Sparkles, count: '8 Specialists' },
  { name: 'Pediatrics', desc: 'Infant and child wellness', icon: Users, count: '15 Specialists' },
  { name: 'General Medicine', desc: 'Routine and preventive health', icon: Stethoscope, count: '24 Specialists' },
  { name: 'Orthopedics', desc: 'Bones, joints, and spine care', icon: Award, count: '9 Specialists' },
  { name: 'Neurology', desc: 'Brain and nervous system', icon: Clock, count: '7 Specialists' },
];

const HomePage = () => {
  const { isAuthenticated, role } = useAuth();

  const getStartedLink = () => {
    if (!isAuthenticated) return '/register/patient';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    if (role === 'ADMIN') return '/admin/dashboard';
    return '/patient/dashboard';
  };

  return (
    <div className="page-wrapper animate-fade-in">
      {/* Hero Section */}
      <section
        style={{
          padding: '4.5rem 0 3.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.9rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                }}
              >
                <ShieldCheck size={16} />
                <span>Verified Medical Professionals Only</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.3rem, 5vw, 3.4rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '1.25rem',
                }}
              >
                Healthcare Designed Around <span className="text-gradient">Your Well-being.</span>
              </h1>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--slate-600)',
                  lineHeight: 1.65,
                  marginBottom: '2rem',
                  maxWidth: '540px',
                }}
              >
                Connect instantly with top-rated medical specialists, schedule verified clinic or virtual appointments, and track your clinical health journey without hassle.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <Link to={getStartedLink()} className="btn btn-primary btn-lg">
                  <span>Get Started Now</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/doctors" className="btn btn-secondary btn-lg">
                  <Search size={18} />
                  <span>Browse Specialists</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--primary-600)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                    Licensed Practitioners
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={18} color="var(--primary-600)" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                    Encrypted Health Records
                  </span>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div style={{ position: 'relative' }}>
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: 'var(--radius-xl)',
                  position: 'relative',
                  border: '1px solid rgba(20, 184, 166, 0.2)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                {/* Floating highlight pills */}
                <div
                  style={{
                    backgroundColor: 'var(--slate-900)',
                    color: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--primary-400)' }}>
                      Quick Availability
                    </div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                      Consult with Doctors Today
                    </div>
                  </div>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(20, 184, 166, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-400)',
                    }}
                  >
                    <Calendar size={22} />
                  </div>
                </div>

                {/* Simulated Doctor Preview Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-700)',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                    }}
                  >
                    RS
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>Dr. Robert Smith</h4>
                      <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>Verified</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      Senior Cardiologist • 12 Yrs Exp
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>$120 / Visit</span>
                      <span style={{ color: 'var(--slate-400)' }}>•</span>
                      <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>Available Tomorrow</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Patient Appointment Pill */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#e0f2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--secondary-600)',
                    }}
                  >
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Instant Slot Confirmation</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Zero waiting line & direct SMS/Email reminder</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialty Highlights */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>Explore Clinical Specialties</h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '1rem' }}>
              Select a field of medicine to connect with qualified, background-vetted specialists.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {specialties.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="card card-interactive"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--primary-600)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <IconComp size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>{item.name}</h3>
                    <p style={{ color: 'var(--slate-500)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                      {item.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid var(--slate-100)',
                      paddingTop: '0.85rem',
                      fontSize: '0.825rem',
                      color: 'var(--slate-500)',
                      fontWeight: 600,
                    }}
                  >
                    <span>{item.count}</span>
                    <span style={{ color: 'var(--primary-600)' }}>Explore →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role Feature Cards: Patient, Doctor, Admin */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-app)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>Built for Every Healthcare Role</h2>
            <p style={{ color: 'var(--slate-600)', fontSize: '1rem' }}>
              Role-based permissions and tailored workflows for patients, doctors, and clinic administrators.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Patient Card */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <span className="badge badge-patient" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
                For Patients
              </span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Hassle-Free Care</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                Register in seconds, discover board-certified doctors, book appointment slots with transparent consultation fees, and access your visit records.
              </p>
              <Link to="/register/patient" className="btn btn-outline btn-block">
                Register as Patient
              </Link>
            </div>

            {/* Doctor Card */}
            <div
              className="card"
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid var(--primary-300)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <span className="badge badge-doctor" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
                For Medical Doctors
              </span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Expand Your Practice</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                Submit medical licensing credentials, customize your consultation pricing and availability schedule, and accept patient bookings efficiently.
              </p>
              <Link to="/register/doctor" className="btn btn-primary btn-block">
                Join as a Doctor
              </Link>
            </div>

            {/* Admin Card */}
            <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <span className="badge badge-admin" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>
                For Clinic Administrators
              </span>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>Platform Governance</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>
                Review and approve doctor registrations, monitor clinic metrics, oversee patient safety standards, and manage system operations.
              </p>
              <Link to="/login" className="btn btn-secondary btn-block">
                Administrator Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
