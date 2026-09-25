import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Activity,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShieldCheck,
  Stethoscope,
  ChevronDown,
  Calendar,
  Bell,
} from 'lucide-react';
import NotificationBell from '../notification/NotificationBell';
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton, IconGlassButton } from './buttons';

const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('You have logged out successfully', 'Logged Out');
    navigate('/login');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const getRoleBadge = () => {
    if (role === 'ADMIN') return <span className="badge badge-admin">Admin</span>;
    if (role === 'DOCTOR') return <span className="badge badge-doctor">Doctor</span>;
    return <span className="badge badge-patient">Patient</span>;
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(8, 10, 18, 0.75)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.25s ease',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
          }}
        >
          {/* Logo / Brand */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(139, 92, 246, 0.7))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 18px rgba(56, 189, 248, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
            >
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                Med<span style={{ color: '#38bdf8' }}>ico</span>
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'rgba(200, 205, 225, 0.55)',
                  textTransform: 'uppercase',
                  marginTop: '-3px',
                }}
              >
                Health Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="desktop-nav"
          >
            <Link
              to="/"
              style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: location.pathname === '/' ? '#38bdf8' : 'rgba(200, 205, 225, 0.72)',
                transition: 'color 0.2s ease',
              }}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              style={{
                fontSize: '0.95rem',
                fontWeight: 500,
                color: location.pathname === '/doctors' ? '#38bdf8' : 'rgba(200, 205, 225, 0.72)',
                transition: 'color 0.2s ease',
              }}
            >
              Find Doctors
            </Link>
          </nav>

          {/* User Auth Actions (Desktop) */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1rem',
            }}
            className="desktop-actions"
          >
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <PrimaryGlassButton
                  to={getDashboardPath()}
                  size="small"
                  icon={<LayoutDashboard size={15} />}
                >
                  Dashboard
                </PrimaryGlassButton>

                {role === 'PATIENT' && (
                  <>
                    <SecondaryGlassButton
                      to="/patient/appointments"
                      size="small"
                      icon={<Calendar size={14} />}
                    >
                      Appointments
                    </SecondaryGlassButton>
                    <GlassButton
                      to="/patient/profile"
                      variant="ghost"
                      size="small"
                      icon={<User size={14} />}
                    >
                      Profile
                    </GlassButton>
                  </>
                )}

                {role === 'DOCTOR' && (
                  <>
                    <SecondaryGlassButton
                      to="/doctor/appointments"
                      size="small"
                      icon={<Calendar size={14} />}
                    >
                      Appointments
                    </SecondaryGlassButton>
                    <GlassButton
                      to="/doctor/availability"
                      variant="ghost"
                      size="small"
                    >
                      Availability
                    </GlassButton>
                  </>
                )}

                {role === 'ADMIN' && (
                  <>
                    <SecondaryGlassButton
                      to="/admin/doctors"
                      size="small"
                      icon={<Stethoscope size={14} />}
                    >
                      Doctors
                    </SecondaryGlassButton>
                    <SecondaryGlassButton
                      to="/admin/patients"
                      size="small"
                      icon={<User size={14} />}
                    >
                      Patients
                    </SecondaryGlassButton>
                    <GlassButton
                      to="/admin/appointments"
                      variant="ghost"
                      size="small"
                      icon={<Calendar size={14} />}
                    >
                      Appointments
                    </GlassButton>
                  </>
                )}

                {/* In-app Notification Bell */}
                <NotificationBell />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.35rem 0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '14px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                      {user?.name}
                    </span>
                    <span style={{ fontSize: '0.7rem' }}>{getRoleBadge()}</span>
                  </div>
                </div>

                <IconGlassButton
                  onClick={handleLogout}
                  title="Log out"
                  icon={<LogOut size={16} />}
                />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <GlassButton to="/login" variant="ghost" size="small">
                  Sign In
                </GlassButton>

                {/* Register Dropdown */}
                <div style={{ position: 'relative' }}>
                  <PrimaryGlassButton
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    size="small"
                    icon={<ChevronDown size={14} />}
                    iconPosition="right"
                  >
                    Create Account
                  </PrimaryGlassButton>

                  {dropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '120%',
                        backgroundColor: 'rgba(18, 20, 30, 0.92)',
                        backdropFilter: 'blur(28px)',
                        WebkitBackdropFilter: 'blur(28px)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.08)',
                        borderRadius: '18px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        width: '220px',
                        padding: '0.5rem',
                        zIndex: 100,
                        animation: 'fadeIn 0.2s ease-out',
                      }}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <Link
                        to="/register/patient"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '14px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <User size={16} color="#38bdf8" />
                        <div>
                          <div style={{ fontWeight: 600 }}>As Patient</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(200, 205, 225, 0.5)' }}>Book consultations</div>
                        </div>
                      </Link>

                      <Link
                        to="/register/doctor"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          padding: '0.7rem 0.85rem',
                          borderRadius: '14px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          transition: 'background 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Stethoscope size={16} color="#38bdf8" />
                        <div>
                          <div style={{ fontWeight: 600 }}>As Doctor</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(200, 205, 225, 0.5)' }}>Join medical network</div>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="mobile-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(200, 205, 225, 0.8)',
                padding: '0.4rem',
              }}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem 0',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: '#ffffff' }}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '0.5rem 0', fontWeight: 600, color: '#ffffff' }}
            >
              Find Doctors
            </Link>

            {isAuthenticated ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>{user?.name}</span>
                  {getRoleBadge()}
                </div>
                <PrimaryGlassButton
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                >
                  Go to Dashboard
                </PrimaryGlassButton>
                {role === 'PATIENT' && (
                  <SecondaryGlassButton
                    to="/patient/appointments"
                    onClick={() => setMobileMenuOpen(false)}
                    fullWidth
                  >
                    My Appointments
                  </SecondaryGlassButton>
                )}
                {role === 'DOCTOR' && (
                  <>
                    <SecondaryGlassButton
                      to="/doctor/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      fullWidth
                    >
                      Appointments
                    </SecondaryGlassButton>
                    <GlassButton
                      to="/doctor/availability"
                      onClick={() => setMobileMenuOpen(false)}
                      variant="outline"
                      fullWidth
                    >
                      Availability Settings
                    </GlassButton>
                    <GlassButton
                      to="/doctor/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      variant="outline"
                      fullWidth
                    >
                      Practice Profile
                    </GlassButton>
                  </>
                )}
                {role === 'ADMIN' && (
                  <>
                    <SecondaryGlassButton
                      to="/admin/doctors"
                      onClick={() => setMobileMenuOpen(false)}
                      fullWidth
                    >
                      Manage Doctors
                    </SecondaryGlassButton>
                    <SecondaryGlassButton
                      to="/admin/patients"
                      onClick={() => setMobileMenuOpen(false)}
                      fullWidth
                    >
                      Manage Patients
                    </SecondaryGlassButton>
                    <GlassButton
                      to="/admin/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      variant="outline"
                      fullWidth
                    >
                      All Appointments
                    </GlassButton>
                  </>
                )}
                <SecondaryGlassButton
                  to="/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                  icon={<Bell size={16} />}
                >
                  Notifications
                </SecondaryGlassButton>
                <GlassButton onClick={handleLogout} variant="outline" fullWidth>
                  Log Out
                </GlassButton>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                }}
              >
                <SecondaryGlassButton
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                >
                  Sign In
                </SecondaryGlassButton>
                <PrimaryGlassButton
                  to="/register/patient"
                  onClick={() => setMobileMenuOpen(false)}
                  fullWidth
                >
                  Register as Patient
                </PrimaryGlassButton>
                <GlassButton
                  to="/register/doctor"
                  onClick={() => setMobileMenuOpen(false)}
                  variant="outline"
                  fullWidth
                >
                  Register as Doctor
                </GlassButton>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
