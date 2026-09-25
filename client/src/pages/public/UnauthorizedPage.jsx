import React from 'react';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PrimaryGlassButton, SecondaryGlassButton } from '../../components/common/buttons';

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
        className="glass-card"
        style={{
          maxWidth: '540px',
          width: '100%',
          textAlign: 'center',
          animation: 'fadeIn 0.5s ease-out',
          padding: '3rem 2rem',
          borderRadius: '24px',
          background: 'rgba(18, 20, 29, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(244, 63, 94, 0.15)',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.12)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.75rem auto',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 0 30px rgba(244, 63, 94, 0.25)',
          }}
        >
          <ShieldAlert size={42} />
        </div>

        {/* 403 Label */}
        <div
          style={{
            display: 'inline-block',
            padding: '0.25rem 0.85rem',
            background: 'rgba(239, 68, 68, 0.15)',
            borderRadius: '9999px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.8rem',
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
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          Access Restricted
        </h1>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginBottom: '0.5rem',
          }}
        >
          {isAuthenticated ? (
            <>
              Your current role{' '}
              <strong style={{ color: '#ffffff' }}>({getRoleDescription()})</strong>{' '}
              does not have authorization to access this area of the healthcare network.
            </>
          ) : (
            'Active authentication credentials are required to view this clinical section.'
          )}
        </p>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: '0.85rem',
            marginBottom: '2.25rem',
          }}
        >
          If you believe this is a platform error, please contact network administration.
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
          <SecondaryGlassButton
            onClick={() => window.history.back()}
            icon={<ArrowLeft size={16} />}
          >
            Go Back
          </SecondaryGlassButton>

          <PrimaryGlassButton
            to={getDashboardPath()}
            icon={<LayoutDashboard size={16} />}
          >
            {isAuthenticated ? 'My Dashboard' : 'Sign In'}
          </PrimaryGlassButton>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
