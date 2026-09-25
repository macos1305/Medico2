import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Activity, Menu, X, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { GlassButton } from '../common/buttons';

const FloatingNavbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="floating-nav-container">
      <nav className="floating-nav-dock" aria-label="Main Navigation">
        {/* Left: Geometric Medico Logo */}
        <Link to="/" className="floating-nav-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="floating-nav-logo-icon">
            <Activity size={20} strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 700, letterSpacing: '0.04em' }}>MEDICO</span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <ul className="floating-nav-links">
          <li>
            <a
              href="#home"
              className="floating-nav-link active-pill"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Home
            </a>
          </li>
          <li>
            <Link to="/doctors" className="floating-nav-link">
              Find Doctors
            </Link>
          </li>
          <li>
            <a
              href="#specialties"
              className="floating-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('specialties');
              }}
            >
              Specializations
            </a>
          </li>
          <li>
            <a
              href="#how-it-works"
              className="floating-nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('how-it-works');
              }}
            >
              How It Works
            </a>
          </li>
        </ul>

        {/* Right: Actions */}
        <div className="floating-nav-actions">
          {isAuthenticated ? (
            <>
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
                }}
              >
                Dashboard
              </GlassButton>
              <GlassButton
                variant="ghost"
                size="sm"
                icon={LogOut}
                onClick={handleLogout}
                style={{ borderRadius: '24px', color: 'rgba(255,255,255,0.7)' }}
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
            className="floating-nav-link active-pill"
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
            className="floating-nav-link"
            style={{ textAlign: 'center' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Doctors
          </Link>
          <button
            className="floating-nav-link"
            style={{ background: 'transparent', border: 'none', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => scrollToSection('specialties')}
          >
            Specializations
          </button>
          <button
            className="floating-nav-link"
            style={{ background: 'transparent', border: 'none', textAlign: 'center', cursor: 'pointer' }}
            onClick={() => scrollToSection('how-it-works')}
          >
            How It Works
          </button>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />

          {isAuthenticated ? (
            <>
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
            </>
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
