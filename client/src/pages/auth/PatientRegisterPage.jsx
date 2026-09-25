import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Mail, Lock, Phone, Heart, Calendar, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import { PrimaryGlassButton } from '../../components/common/buttons';

const PatientRegisterPage = () => {
  const { registerPatient } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: 'PREFER_NOT_TO_SAY',
    bloodGroup: 'UNKNOWN',
    dateOfBirth: '',
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
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email';
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
      const result = await registerPatient(formData);
      success(`Welcome to Medico, ${result.user.name}! Account created.`, 'Registration Successful');
      navigate('/patient/dashboard', { replace: true });
    } catch (err) {
      const message = err.message || 'Registration failed. Please try again.';
      toastError(message, 'Registration Error');
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-wrapper animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem 0 3rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 8px 24px rgba(14, 165, 233, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Activity size={30} strokeWidth={2.5} />
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#38bdf8',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Patient Portal
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
              fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
              fontWeight: 700,
              color: '#ffffff',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            Create Patient Account
          </h1>
          <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Register to book certified doctors, schedule slots, and track your health records.
          </p>
        </div>

        {/* Glass Card */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            background: 'rgba(18, 20, 29, 0.65)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.45)',
          }}
        >
          {errors.form && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="form-label"
                htmlFor="name"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: errors.name ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  disabled={loading}
                />
                <User
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
              {errors.name && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="form-label"
                htmlFor="email"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Email Address *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: errors.email ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  disabled={loading}
                />
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
              {errors.email && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.email}</div>}
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="form-label"
                htmlFor="password"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Password * (min. 6 characters)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: errors.password ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  disabled={loading}
                />
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
              {errors.password && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.password}</div>}
            </div>

            {/* Phone Number */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="form-label"
                htmlFor="phone"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  disabled={loading}
                />
                <Phone
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
            </div>

            {/* 2-col layout: Gender & Blood Group */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="gender"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="form-select"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#12141d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="bloodGroup"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#12141d',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option value="UNKNOWN">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label
                className="form-label"
                htmlFor="dateOfBirth"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Date of Birth
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="dateOfBirth"
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    colorScheme: 'dark',
                  }}
                  disabled={loading}
                />
                <Calendar
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
            </div>

            {/* Submit */}
            <PrimaryGlassButton
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              icon={<ArrowRight size={18} />}
            >
              Complete Patient Registration
            </PrimaryGlassButton>
          </form>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'rgba(200, 205, 225, 0.65)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: '#38bdf8' }}>
            Sign In
          </Link>
          <span style={{ margin: '0 0.65rem', opacity: 0.4 }}>•</span>
          Are you a physician?{' '}
          <Link to="/register/doctor" style={{ fontWeight: 600, color: '#c084fc' }}>
            Join as Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientRegisterPage;
