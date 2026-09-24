import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Activity, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      success(`Welcome back, ${result.user.name}!`, 'Authentication Successful');

      // Determine redirect path
      const destination = location.state?.from?.pathname;
      if (destination) {
        navigate(destination, { replace: true });
        return;
      }

      if (result.user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (result.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      toastError(message, 'Authentication Error');
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  // Quick-fill helper for test credentials
  const fillCredentials = (email, password) => {
    setFormData({ email, password });
    setErrors({});
  };

  return (
    <div
      className="page-wrapper animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem auto',
              boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)',
            }}
          >
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Sign In to Medico</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Access your health dashboard, appointments, and medical network.
          </p>
        </div>

        {/* Card */}
        <div className="card glass-card" style={{ padding: '2rem' }}>
          {errors.form && (
            <div
              style={{
                backgroundColor: '#ffe4e6',
                border: '1px solid #fecdd3',
                color: 'var(--accent-rose)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={loading}
                />
                <Mail
                  size={18}
                  color="var(--slate-400)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={loading}
                />
                <Lock
                  size={18}
                  color="var(--slate-400)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ marginTop: '1.5rem', height: '46px' }}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Roles for Testing */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--slate-400)',
                marginBottom: '0.65rem',
                textAlign: 'center',
              }}
            >
              Quick Test Credentials
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('patient@test.com', 'Password123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                <UserCheck size={12} />
                Patient
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('doctor@test.com', 'Doctor123')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                <Stethoscope size={12} />
                Doctor
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('admin@medico.com', 'Admin@12345')}
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
              >
                <ShieldCheck size={12} />
                Admin
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          Don't have an account?{' '}
          <Link to="/register/patient" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
            Register as Patient
          </Link>{' '}
          or{' '}
          <Link to="/register/doctor" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
            Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
