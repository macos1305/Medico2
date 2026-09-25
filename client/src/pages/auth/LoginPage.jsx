import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Activity,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Stethoscope,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { GlassButton, SecondaryGlassButton } from '../../components/common/buttons';

const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (errors.form) setErrors((prev) => ({ ...prev, form: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
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
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      success(`Welcome back, ${result.user.name}!`, 'Signed In');

      const destination = location.state?.from?.pathname;
      if (destination) { navigate(destination, { replace: true }); return; }

      if (result.user.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (result.user.role === 'DOCTOR') navigate('/doctor/dashboard', { replace: true });
      else navigate('/patient/dashboard', { replace: true });
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      toastError(message, 'Authentication Error');
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

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
        minHeight: '80vh',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(139, 92, 246, 0.7))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1rem auto',
              boxShadow: '0 6px 25px rgba(56, 189, 248, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', marginBottom: '0.4rem', color: '#ffffff' }}>Sign In to Medico</h1>
          <p style={{ color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.95rem' }}>
            Access your health dashboard, appointments, and medical network.
          </p>
        </div>

        {/* Glass Card */}
        <div
          className="glass-card"
          style={{ padding: '2rem' }}
        >
          {/* Form-level error */}
          {errors.form && (
            <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Email Address <span style={{ color: '#fb7185' }}>*</span>
              </label>
              <div className="form-input-wrapper">
                <span className="form-input-icon" style={{ color: 'rgba(200, 205, 225, 0.45)' }}>
                  <Mail size={17} />
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  className={`form-input${errors.email ? ' error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && <div className="form-error"><AlertCircle size={12} />{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span style={{ color: '#fb7185' }}>*</span>
              </label>
              <div className="form-input-wrapper" style={{ position: 'relative' }}>
                <span className="form-input-icon" style={{ color: 'rgba(200, 205, 225, 0.45)' }}>
                  <Lock size={17} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  className={`form-input${errors.password ? ' error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingRight: '2.75rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(200, 205, 225, 0.45)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <div className="form-error"><AlertCircle size={12} />{errors.password}</div>}
            </div>

            {/* Submit */}
            <div style={{ marginTop: '1.25rem' }}>
              <GlassButton
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                icon={<ArrowRight size={18} />}
                iconPosition="right"
                id="login-submit-btn"
              >
                Sign In
              </GlassButton>
            </div>
          </form>

          {/* Quick-Fill Demo Roles */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <p
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'rgba(200, 205, 225, 0.4)',
                marginBottom: '0.65rem',
                textAlign: 'center',
              }}
            >
              Quick Test Credentials
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <SecondaryGlassButton
                size="small"
                onClick={() => fillCredentials('patient@test.com', 'Password123')}
                icon={<UserCheck size={12} />}
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem' }}
              >
                Patient
              </SecondaryGlassButton>
              <SecondaryGlassButton
                size="small"
                onClick={() => fillCredentials('doctor@test.com', 'Doctor123')}
                icon={<Stethoscope size={12} />}
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem' }}
              >
                Doctor
              </SecondaryGlassButton>
              <SecondaryGlassButton
                size="small"
                onClick={() => fillCredentials('admin@medico.com', 'Admin@12345')}
                icon={<ShieldCheck size={12} />}
                style={{ fontSize: '0.72rem', padding: '0.35rem 0.5rem' }}
              >
                Admin
              </SecondaryGlassButton>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.92rem', color: 'rgba(200, 205, 225, 0.55)' }}>
          Don't have an account?{' '}
          <Link to="/register/patient" style={{ fontWeight: 700, color: '#38bdf8' }}>
            Register as Patient
          </Link>{' '}
          or{' '}
          <Link to="/register/doctor" style={{ fontWeight: 700, color: '#38bdf8' }}>
            Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
