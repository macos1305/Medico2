import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import doctorService from '../../services/doctorService';
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
  Star,
  Building2,
  MapPin,
} from 'lucide-react';
import { GlassButton, MedicoAiButton } from '../../components/common/buttons';

const FALLBACK_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#e0f2f1"/><circle cx="100" cy="78" r="38" fill="#80cbc4"/><ellipse cx="100" cy="170" rx="60" ry="45" fill="#80cbc4"/><text x="100" y="88" text-anchor="middle" fill="white" font-size="36" font-family="Arial" font-weight="bold">👨‍⚕️</text></svg>`);

const specialties = [
  { name: 'Cardiology', desc: 'Heart & vascular conditions', icon: HeartPulse },
  { name: 'Dermatology', desc: 'Skin health and cosmetics', icon: Sparkles },
  { name: 'Pediatrics', desc: 'Infant and child wellness', icon: Users },
  { name: 'General Medicine', desc: 'Routine and preventive health', icon: Stethoscope },
  { name: 'Orthopedics', desc: 'Bones, joints, and spine care', icon: Award },
  { name: 'Neurology', desc: 'Brain and nervous system', icon: Clock },
];

const FeaturedDoctorCard = ({ doctor }) => {
  const name = doctor.user?.name || doctor.name || 'Medical Specialist';
  const profileImg = doctor.user?.profileImage || doctor.user?.avatar;
  const specialization = doctor.specialization || 'General Practice';
  const experienceYears = doctor.experienceYears || 0;
  const avgRating = doctor.rating?.average || 0;
  const hospital = doctor.hospitalAffiliation || '';
  const location = doctor.location || '';
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      to={`/doctors/${doctor._id}`}
      className="card card-interactive"
      style={{
        padding: 0,
        textDecoration: 'none',
        color: 'inherit',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          height: '160px',
          backgroundColor: 'var(--primary-50)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          src={imgError || !profileImg ? FALLBACK_AVATAR : profileImg}
          alt={name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
        />
        {/* Rating Badge */}
        {avgRating > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.2rem',
              backgroundColor: 'rgba(255,255,255,0.93)',
              backdropFilter: 'blur(8px)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--slate-800)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <Star size={12} fill="#f59e0b" color="#f59e0b" />
            {avgRating.toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '1rem 1.15rem 1.15rem' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', margin: '0 0 0.2rem 0' }}>
          {name}
        </h4>
        <div style={{ fontSize: '0.78rem', color: 'var(--primary-600)', fontWeight: 600, marginBottom: '0.4rem' }}>
          {specialization}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--slate-500)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Award size={11} />
            {experienceYears} Yrs
          </span>
          {location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={11} />
              {location.split(',')[0]}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const { isAuthenticated, role } = useAuth();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await doctorService.getFeatured(6);
        if (res.data) setFeaturedDoctors(res.data);
      } catch (err) {
        console.error('Failed to load featured doctors:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchFeatured();
  }, []);

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
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem', alignItems: 'center' }}>
                <GlassButton
                  to={getStartedLink()}
                  variant="primary"
                  size="large"
                  glow
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Get Started Now
                </GlassButton>

                <GlassButton
                  to="/doctors"
                  variant="secondary"
                  size="large"
                  icon={<Search size={18} />}
                >
                  Browse Specialists
                </GlassButton>

                <MedicoAiButton
                  to="/patient/recommend-doctor"
                  size="large"
                >
                  Find Doctors Using AI
                </MedicoAiButton>
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

                {/* Preview using actual featured doctor if available */}
                {featuredDoctors.length > 0 ? (
                  <Link
                    to={`/doctors/${featuredDoctors[0]._id}`}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                      display: 'flex',
                      gap: '1rem',
                      alignItems: 'center',
                      marginBottom: '1rem',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-100)',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={featuredDoctors[0].user?.profileImage || FALLBACK_AVATAR}
                        alt={featuredDoctors[0].user?.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h4 style={{ fontSize: '1rem', margin: 0 }}>{featuredDoctors[0].user?.name}</h4>
                        <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>Verified</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        {featuredDoctors[0].specialization} • {featuredDoctors[0].experienceYears} Yrs Exp
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>₹{featuredDoctors[0].consultationFee} / Visit</span>
                        <span style={{ color: 'var(--slate-400)' }}>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 600 }}>
                          <Star size={11} fill="#f59e0b" />
                          {featuredDoctors[0].rating?.average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ) : (
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
                      <Stethoscope size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', margin: 0 }}>Find Your Doctor</h4>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        25+ verified specialists across 15 medical fields
                      </div>
                    </div>
                  </div>
                )}

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

      {/* ── Featured Doctors Section ─────────────────────────────────────── */}
      {featuredDoctors.length > 0 && (
        <section style={{ padding: '4rem 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
              <span
                className="badge badge-doctor"
                style={{ marginBottom: '0.65rem', display: 'inline-flex' }}
              >
                Top Rated
              </span>
              <h2 style={{ fontSize: '2.1rem', marginBottom: '0.75rem' }}>Featured Doctors</h2>
              <p style={{ color: 'var(--slate-600)', fontSize: '1rem' }}>
                Our highest-rated, verified medical specialists ready to provide quality healthcare.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              {featuredDoctors.map((doc) => (
                <FeaturedDoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <GlassButton
                to="/doctors"
                variant="outline"
                size="large"
                icon={<ArrowRight size={16} />}
                iconPosition="right"
              >
                View All Doctors
              </GlassButton>
            </div>
          </div>
        </section>
      )}

      {/* Specialty Highlights */}
      <section style={{ padding: '4rem 0', backgroundColor: featuredDoctors.length > 0 ? 'var(--bg-app)' : '#ffffff', borderTop: '1px solid var(--border-subtle)' }}>
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
                <Link
                  key={idx}
                  to={`/doctors?specialization=${encodeURIComponent(item.name.replace('ology', 'ologist').replace('rics', 'rician').replace('ine', 'Physician'))}`}
                  className="card card-interactive"
                  style={{
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    color: 'inherit',
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
                    <span>View Specialists</span>
                    <span style={{ color: 'var(--primary-600)' }}>Explore →</span>
                  </div>
                </Link>
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
              <GlassButton to="/register/patient" variant="outline" fullWidth>
                Register as Patient
              </GlassButton>
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
              <GlassButton to="/register/doctor" variant="primary" fullWidth>
                Join as a Doctor
              </GlassButton>
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
              <GlassButton to="/login" variant="secondary" fullWidth>
                Administrator Sign In
              </GlassButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
