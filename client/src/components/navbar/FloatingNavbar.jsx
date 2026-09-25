import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Activity, Menu, X, ArrowRight, LayoutDashboard, LogOut, Calendar, Stethoscope, Users } from 'lucide-react';
import { GlassButton } from '../common/buttons';
import NotificationBell from '../notification/NotificationBell';

const FloatingNavbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    success('You have logged out successfully', 'Logged Out');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    return '/patient/dashboard';
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isHome = location.pathname === '/';
  const isDoctors = location.pathname.startsWith('/doctors');

  return (
    <header className="floating-nav-container">
      <nav className="floating-nav-dock" aria-label="Main Navigation">
        {/* Left: Geometric Medico Logo */}
        <Link to="/" className="floating-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="floating-nav-logo-icon">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '0.04em' }}>MEDICO</span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <ul className="floating-nav-links">
          <li>
            <Link
              to="/"
              className={`floating-nav-link ${isHome ? 'active-pill' : ''}`}
              onClick={() => {
                if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link to="/doctors" className={`floating-nav-link ${isDoctors ? 'active-pill' : ''}`}>
              Find Doctors
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="floating-nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit' }}
              onClick={() => scrollToSection('specialties')}
            >
              Specializations
            </button>
          </li>
          <li>
            <button
              type="button"
              className="floating-nav-link"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', font: 'inherit' }}
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </button>
          </li>
          {isAuthenticated && role === 'PATIENT' && (
            <li>
              <Link to="/patient/appointments" className={`floating-nav-link ${location.pathname.includes('/appointments') ? 'active-pill' : ''}`}>
                Appointments
              </Link>
            </li>
          )}
          {isAuthenticated && role === 'DOCTOR' && (
            <li>
              <Link to="/doctor/appointments" className={`floating-nav-link ${location.pathname.includes('/appointments') ? 'active-pill' : ''}`}>
                Schedule
              </Link>
            </li>
          )}
          {isAuthenticated && role === 'ADMIN' && (
            <li>
              <Link to="/admin/doctors" className={`floating-nav-link ${location.pathname.includes('/admin/doctors') ? 'active-pill' : ''}`}>
                Physicians
              </Link>
            </li>
          )}
        </ul>

        {/* Right: Actions */}
        <div className="floating-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              {/* Role Badge */}
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background:
                    role === 'ADMIN'
                      ? 'rgba(168, 85, 247, 0.15)'
                      : role === 'DOCTOR'
                      ? 'rgba(59, 130, 246, 0.15)'
                      : 'rgba(16, 185, 129, 0.15)',
                  color:
                    role === 'ADMIN'
                      ? '#c084fc'
                      : role === 'DOCTOR'
                      ? '#60a5fa'
                      : '#34d399',
                  border:
                    role === 'ADMIN'
                      ? '1px solid rgba(168, 85, 247, 0.3)'
                      : role === 'DOCTOR'
                      ? '1px solid rgba(59, 130, 246, 0.3)'
                      : '1px solid rgba(16, 185, 129, 0.3)',
                }}
              >
                {role}
              </span>

              {/* Dashboard Button */}
              <GlassButton
                as={Link}
                to={getDashboardPath()}
                variant="primary"
                size="sm"
                icon={LayoutDashboard}
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0f172a',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
                }}
              >
                Dashboard
              </GlassButton>

              {/* Sign Out Button */}
              <GlassButton
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                style={{ borderRadius: '24px', color: 'rgba(255, 255, 255, 0.75)' }}
                title="Sign Out"
              >
                Sign Out
              </GlassButton>
            </>
          ) : (
            <>
              <Link to="/login" className="floating-nav-signin">
                Sign In
              </Link>
              <GlassButton
                as={Link}
                to="/register"
                variant="primary"
                size="sm"
                style={{
                  borderRadius: '24px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#0f172a',
                  fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(255, 255, 255, 0.2)',
                }}
              >
                Get Started
                <ArrowRight size={15} style={{ marginLeft: 6 }} />
              </GlassButton>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="floating-nav-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="floating-mobile-menu">
          <Link
            to="/"
            className={`floating-nav-link ${isHome ? 'active-pill' : ''}`}
            style={{ textAlign: 'center' }}
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className={`floating-nav-link ${isDoctors ? 'active-pill' : ''}`}
            style={{ textAlign: 'center' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Doctors
          </Link>
          <button
            type="button"
            className="floating-nav-link"
            style={{ background: 'transparent', border: 'none', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => scrollToSection('specialties')}
          >
            Specializations
          </button>
          <button
            type="button"
            className="floating-nav-link"
            style={{ background: 'transparent', border: 'none', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>

          {isAuthenticated && (
            <Link
              to={getDashboardPath()}
              className="floating-nav-link"
              style={{ textAlign: 'center' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <GlassButton
                as={Link}
                to={getDashboardPath()}
                variant="primary"
                onClick={() => setMobileMenuOpen(false)}
                icon={LayoutDashboard}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Dashboard
              </GlassButton>
              <GlassButton
                variant="ghost"
                onClick={handleLogout}
                icon={LogOut}
                style={{ width: '100%', justifyContent: 'center', color: '#f43f5e' }}
              >
                Sign Out
              </GlassButton>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <GlassButton
                as={Link}
                to="/login"
                variant="secondary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In
              </GlassButton>
              <GlassButton
                as={Link}
                to="/register"
                variant="primary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Get Started →
              </GlassButton>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default FloatingNavbar;
