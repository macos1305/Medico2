import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Home, ArrowLeft, Search, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrimaryGlassButton, SecondaryGlassButton, GlassButton } from '../../components/common/buttons';

const NotFoundPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    if (role === 'PATIENT') return '/patient/dashboard';
    return null;
  };

  const dashboardPath = getDashboardPath();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '580px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          padding: '3rem 2rem',
          borderRadius: '24px',
          background: 'rgba(18, 20, 29, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            }}
          >
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            Med<span style={{ color: '#60a5fa' }}>ico</span>
          </span>
        </div>

        {/* 404 Display */}
        <div
          style={{
            fontSize: 'clamp(5rem, 15vw, 7.5rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            letterSpacing: '-0.04em',
            textShadow: '0 0 40px rgba(96, 165, 250, 0.3)',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '0.75rem',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.65)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
            maxWidth: '460px',
            margin: '0 auto 2.25rem auto',
          }}
        >
          The clinical resource or healthcare page you are looking for does not exist or may have been relocated.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <SecondaryGlassButton onClick={() => navigate(-1)} icon={<ArrowLeft size={16} />}>
            Go Back
          </SecondaryGlassButton>

          <PrimaryGlassButton to="/" icon={<Home size={16} />}>
            Return Home
          </PrimaryGlassButton>

          {isAuthenticated && dashboardPath && (
            <GlassButton to={dashboardPath} variant="outline" icon={<Search size={16} />}>
              Dashboard
            </GlassButton>
          )}
        </div>

        {/* Quick Links */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.25rem',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <p
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.75rem',
            }}
          >
            Helpful Destinations
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                color: '#60a5fa',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Home size={14} /> Home
            </Link>
            <Link
              to="/doctors"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.875rem',
                color: '#60a5fa',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Stethoscope size={14} /> Find Doctors
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: '0.875rem',
                    color: '#60a5fa',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register/patient"
                  style={{
                    fontSize: '0.875rem',
                    color: '#60a5fa',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
