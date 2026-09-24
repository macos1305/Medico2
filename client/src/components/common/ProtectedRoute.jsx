import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Authenticating session..." fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to login page and remember destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify match
  if (allowedRoles && !allowedRoles.includes(role)) {
    const getFallbackPath = () => {
      if (role === 'ADMIN') return '/admin/dashboard';
      if (role === 'DOCTOR') return '/doctor/dashboard';
      return '/patient/dashboard';
    };

    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <div
          className="card"
          style={{
            maxWidth: '520px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '2.5rem',
            borderTop: '4px solid var(--accent-rose)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#ffe4e6',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
            }}
          >
            <ShieldAlert size={30} />
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.65rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            Your account role is <strong>{role}</strong>, which does not have permission to view this section.
          </p>

          <Link
            to={getFallbackPath()}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            Return to Authorized Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
