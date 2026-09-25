import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import specializationService from '../../services/specializationService';
import {
  Stethoscope,
  Mail,
  Lock,
  Phone,
  Award,
  IndianRupee,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Activity,
} from 'lucide-react';
import { PrimaryGlassButton } from '../../components/common/buttons';

const DoctorRegisterPage = () => {
  const { registerDoctor } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecs, setLoadingSpecs] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experienceYears: 5,
    consultationFee: 500,
    hospitalAffiliation: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await specializationService.getAll();
        if (res.data && res.data.length > 0) {
          setSpecializations(res.data);
          setFormData((prev) => ({ ...prev, specialization: res.data[0].name }));
        } else {
          const defaults = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Medicine', 'Neurology'];
          setSpecializations(defaults.map((n) => ({ name: n })));
          setFormData((prev) => ({ ...prev, specialization: defaults[0] }));
        }
      } catch (err) {
        console.warn('Could not load dynamic specializations, using defaults:', err.message);
        const defaults = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Medicine', 'Neurology'];
        setSpecializations(defaults.map((n) => ({ name: n })));
        setFormData((prev) => ({ ...prev, specialization: defaults[0] }));
      } finally {
        setLoadingSpecs(false);
      }
    };

    fetchSpecializations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Doctor name is required';
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
    if (!formData.specialization.trim()) {
      errs.specialization = 'Specialization is required';
    }
    if (!formData.licenseNumber.trim()) {
      errs.licenseNumber = 'Medical license number is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        experienceYears: Number(formData.experienceYears) || 0,
        consultationFee: Number(formData.consultationFee) || 0,
      };

      const result = await registerDoctor(payload);
      success(
        `Welcome Dr. ${result.user.name}! Your profile was created and is pending verification.`,
        'Application Submitted'
      );
      navigate('/doctor/dashboard', { replace: true });
    } catch (err) {
      const message = err.message || 'Registration failed. Please check your details.';
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
      <div style={{ width: '100%', maxWidth: '640px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              margin: '0 auto 1.25rem auto',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Stethoscope size={28} strokeWidth={2.2} />
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              color: '#c084fc',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            Physician Network
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
            Join Clinical Network
          </h1>
          <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            Register your medical credentials to receive verified patient consultations.
          </p>
        </div>

        {/* Verification notice alert */}
        <div
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.08)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            marginBottom: '1.75rem',
            backdropFilter: 'blur(12px)',
          }}
        >
          <ShieldCheck size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'rgba(200, 205, 225, 0.85)', lineHeight: 1.5 }}>
            <strong style={{ color: '#ffffff' }}>Board Verification Protocol:</strong> All doctor accounts are initially reviewed by our clinical administration team before public listing in the appointment directory.
          </div>
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
            {/* 2-col: Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="name"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Full Name (with Dr. prefix) *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="e.g. Dr. Sarah Jenkins"
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
                    }}
                    disabled={loading}
                  />
                  <Stethoscope
                    size={18}
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                  />
                </div>
                {errors.name && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.name}</div>}
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="email"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Official Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="doctor@hospital.org"
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
            </div>

            {/* 2-col: Password & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="password"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Password * (min. 6 chars)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="••••••••"
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

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="phone"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Contact Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+1 (555) 019-2831"
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
            </div>

            {/* 2-col: Specialization & License Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="specialization"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Medical Specialization *
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  className="form-select"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={loading || loadingSpecs}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#12141d',
                    border: errors.specialization ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  {loadingSpecs ? (
                    <option>Loading specialties...</option>
                  ) : (
                    specializations.map((spec, i) => (
                      <option key={spec._id || i} value={spec.name}>
                        {spec.name}
                      </option>
                    ))
                  )}
                </select>
                {errors.specialization && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.specialization}</div>}
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="licenseNumber"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Medical License ID Number *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="licenseNumber"
                    type="text"
                    name="licenseNumber"
                    className="form-input"
                    placeholder="e.g. MED-NYC-2024-991"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.6rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      border: errors.licenseNumber ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                    disabled={loading}
                  />
                  <Award
                    size={18}
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                  />
                </div>
                {errors.licenseNumber && <div style={{ color: '#fb7185', fontSize: '0.8rem', marginTop: '0.35rem' }}>{errors.licenseNumber}</div>}
              </div>
            </div>

            {/* 2-col: Experience & Fee */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="experienceYears"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Years of Experience
                </label>
                <input
                  id="experienceYears"
                  type="number"
                  min="0"
                  max="60"
                  name="experienceYears"
                  className="form-input"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="consultationFee"
                  style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
                >
                  Consultation Fee (INR ₹)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="consultationFee"
                    type="number"
                    min="0"
                    step="50"
                    name="consultationFee"
                    className="form-input"
                    value={formData.consultationFee}
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
                  <IndianRupee
                    size={18}
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                  />
                </div>
              </div>
            </div>

            {/* Hospital Affiliation */}
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label
                className="form-label"
                htmlFor="hospitalAffiliation"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Hospital or Clinic Affiliation
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="hospitalAffiliation"
                  type="text"
                  name="hospitalAffiliation"
                  className="form-input"
                  placeholder="e.g. Mount Sinai Medical Center"
                  value={formData.hospitalAffiliation}
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
                <Building2
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(148, 163, 184, 0.6)' }}
                />
              </div>
            </div>

            {/* Bio / Summary */}
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label
                className="form-label"
                htmlFor="bio"
                style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'rgba(200, 205, 225, 0.8)', marginBottom: '0.4rem' }}
              >
                Professional Bio & Clinical Philosophy
              </label>
              <textarea
                id="bio"
                name="bio"
                rows="3"
                className="form-textarea"
                placeholder="Brief summary of your clinical expertise, education, and patient care approach..."
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              ></textarea>
            </div>

            {/* Submit */}
            <PrimaryGlassButton
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              icon={<ArrowRight size={18} />}
            >
              Submit Application for Credentialing
            </PrimaryGlassButton>
          </form>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'rgba(200, 205, 225, 0.65)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: '#38bdf8' }}>
            Sign In to Doctor Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
