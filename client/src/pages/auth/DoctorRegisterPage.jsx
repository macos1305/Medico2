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
  DollarSign,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Activity,
} from 'lucide-react';

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
    consultationFee: 100,
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
          // Fallback defaults if DB is cold
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
        padding: '3rem 1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '640px' }}>
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
          <span className="badge badge-doctor" style={{ marginBottom: '0.5rem' }}>
            Physician Network
          </span>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Join the Medico Clinical Network</h1>
          <p style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
            Register your medical credentials to receive verified patient consultations.
          </p>
        </div>

        {/* Verification notice alert */}
        <div
          style={{
            backgroundColor: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <ShieldCheck size={20} color="var(--primary-600)" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-900)' }}>
            <strong>Board Verification Protocol:</strong> All doctor accounts are initially set to <em>PENDING</em> review by our clinical administration team before public listing in the appointment directory.
          </div>
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
            {/* 2-col: Name & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
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
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                  <Stethoscope
                    size={18}
                    color="var(--slate-400)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
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
            </div>

            {/* 2-col: Password & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
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

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
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
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                  <Phone
                    size={18}
                    color="var(--slate-400)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            </div>

            {/* 2-col: Specialization & License Number */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="specialization">
                  Medical Specialization *
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  className="form-select"
                  value={formData.specialization}
                  onChange={handleChange}
                  disabled={loading || loadingSpecs}
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
                {errors.specialization && <div className="form-error">{errors.specialization}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="licenseNumber">
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
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                  <Award
                    size={18}
                    color="var(--slate-400)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
                {errors.licenseNumber && <div className="form-error">{errors.licenseNumber}</div>}
              </div>
            </div>

            {/* 2-col: Experience & Fee */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="experienceYears">
                  Years of Clinical Experience
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
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="consultationFee">
                  Consultation Fee (USD $)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="consultationFee"
                    type="number"
                    min="0"
                    step="5"
                    name="consultationFee"
                    className="form-input"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                    disabled={loading}
                  />
                  <DollarSign
                    size={18}
                    color="var(--slate-400)"
                    style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            </div>

            {/* Hospital Affiliation */}
            <div className="form-group">
              <label className="form-label" htmlFor="hospitalAffiliation">
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
                  style={{ paddingLeft: '2.5rem' }}
                  disabled={loading}
                />
                <Building2
                  size={18}
                  color="var(--slate-400)"
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>
            </div>

            {/* Bio / Summary */}
            <div className="form-group">
              <label className="form-label" htmlFor="bio">
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
              ></textarea>
            </div>

            {/* Submit */}
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
                  <span>Submit Application for Credentialing</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--primary-600)' }}>
            Sign In to Doctor Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorRegisterPage;
