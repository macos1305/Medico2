import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { role, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'DOCTOR') return '/doctor/dashboard';
    if (role === 'PATIENT') return '/patient/dashboard';
    return '/login';
  };

  const getRoleDescription = () => {
    if (role === 'ADMIN') return 'Administrator';
    if (role === 'DOCTOR') return 'Doctor';
    if (role === 'PATIENT') return 'Patient';
    return 'Guest';
  };

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
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
            color: 'var(--accent-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto',
            border: '3px solid #fecdd3',
            boxShadow: '0 8px 24px rgba(244,63,94,0.15)',
          }}
        >
          <ShieldAlert size={44} />
        </div>

        {/* 403 Label */}
        <div
          style={{
            display: 'inline-block',
            padding: '0.3rem 0.9rem',
            background: '#fff1f2',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #fecdd3',
            color: 'var(--accent-rose)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
          }}
        >
          403 — Access Denied
        </div>

        <h1
          style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: 800,
            color: 'var(--slate-900)',
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Access Restricted
        </h1>

        <p
          style={{
            color: 'var(--slate-500)',
            fontSize: 'var(--text-base)',
            lineHeight: 1.7,
            marginBottom: '0.5rem',
          }}
        >
          {isAuthenticated ? (
            <>
              Your current role{' '}
              <strong style={{ color: 'var(--slate-700)' }}>({getRoleDescription()})</strong>{' '}
              does not have permission to access this section of the platform.
            </>
          ) : (
            'You need to be logged in to access this section.'
          )}
        </p>

        <p
          style={{
            color: 'var(--slate-400)',
            fontSize: 'var(--text-sm)',
            marginBottom: '2rem',
          }}
        >
          If you believe this is an error, please contact your administrator.
        </p>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft size={16} />
            Go Back
          </button>

          <Link to={getDashboardPath()} className="btn btn-primary">
            <LayoutDashboard size={16} />
            {isAuthenticated ? 'My Dashboard' : 'Sign In'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
