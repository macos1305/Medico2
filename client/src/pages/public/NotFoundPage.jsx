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
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(13,148,136,0.28)',
            }}
          >
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--slate-900)',
              letterSpacing: '-0.02em',
            }}
          >
            Med<span style={{ color: 'var(--primary-600)' }}>ico</span>
          </span>
        </div>

        {/* 404 Display */}
        <div
          style={{
            fontSize: 'clamp(5rem, 18vw, 8rem)',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--primary-600), var(--primary-400))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '0.75rem',
          }}
        >
          Page Not Found
        </h1>

        <p
          style={{
            color: 'var(--slate-500)',
            fontSize: 'var(--text-base)',
            lineHeight: 1.7,
            marginBottom: '2.25rem',
          }}
        >
          The healthcare resource or clinical page you're looking for doesn't exist or may have been moved.
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
              Go to Dashboard
            </GlassButton>
          )}
        </div>

        {/* Quick Links */}
        <div
          style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            background: 'var(--slate-50)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <p
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--slate-600)',
              marginBottom: '0.875rem',
            }}
          >
            Helpful Links
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: 'var(--text-sm)',
                color: 'var(--primary-600)',
                fontWeight: 600,
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
                fontSize: 'var(--text-sm)',
                color: 'var(--primary-600)',
                fontWeight: 600,
              }}
            >
              <Stethoscope size={14} /> Find Doctors
            </Link>
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--primary-600)',
                    fontWeight: 600,
                  }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register/patient"
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--primary-600)',
                    fontWeight: 600,
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
