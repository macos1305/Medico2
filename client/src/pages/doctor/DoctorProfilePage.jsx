import React, { useState, useEffect } from 'react';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import doctorService from '../../services/doctorService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Phone,
  Mail,
  Stethoscope,
  GraduationCap,
  Award,
  IndianRupee,
  Building2,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import { PrimaryGlassButton } from '../../components/common/buttons';

const inputDarkStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.82rem',
  fontWeight: 600,
  color: 'rgba(200, 205, 225, 0.8)',
  marginBottom: '0.4rem',
};

const DoctorProfilePage = () => {
  const { user, profile, updateUserData } = useAuth();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualificationsText, setQualificationsText] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [consultationFee, setConsultationFee] = useState(500);
  const [hospitalAffiliation, setHospitalAffiliation] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await doctorService.getMyProfile();
      if (res.data) {
        const doc = res.data;
        const u = doc.user || user;
        setName(u?.name || '');
        setPhone(u?.phone || '');
        setProfileImage(u?.profileImage || u?.avatar || '');
        setSpecialization(doc.specialization || '');
        setQualificationsText(
          Array.isArray(doc.qualifications)
            ? doc.qualifications.join(', ')
            : ''
        );
        setExperienceYears(doc.experienceYears || 0);
        setConsultationFee(doc.consultationFee || 500);
        setHospitalAffiliation(doc.hospitalAffiliation || '');
        setLocation(doc.location || '');
        setBio(doc.bio || '');
        setLicenseNumber(doc.licenseNumber || '');
      }
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
      toastError(err.message || 'Could not load your doctor profile', 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toastError('Doctor name cannot be empty', 'Validation Error');
      return;
    }
    if (!specialization.trim()) {
      toastError('Specialization is required', 'Validation Error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        profileImage: profileImage.trim(),
        specialization: specialization.trim(),
        qualifications: qualificationsText
          .split(',')
          .map((q) => q.trim())
          .filter(Boolean),
        experienceYears: Number(experienceYears) || 0,
        consultationFee: Number(consultationFee) || 0,
        hospitalAffiliation: hospitalAffiliation.trim(),
        location: location.trim(),
        bio: bio.trim(),
      };

      const res = await doctorService.updateMyProfile(payload);
      success('Your practice profile has been updated successfully!', 'Profile Updated');

      if (res.data?.user && updateUserData) {
        updateUserData(res.data.user, res.data.profile || null);
      }
      fetchProfile();
    } catch (err) {
      toastError(err.message || 'Failed to update profile', 'Update Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 300px) 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="dashboard-layout"
        >
          {/* Left Doctor Sidebar */}
          <DoctorSidebar />

          {/* Main Profile Form */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    color: '#c084fc',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Practice Management
                </span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                  fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                Doctor Practice Profile
              </h1>
              <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
                Update your professional credentials, consultation fee, hospital affiliation, and public biography.
              </p>
            </div>

            {loading ? (
              <LoadingSpinner text="Retrieving profile credentials..." />
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-card"
                style={{
                  padding: '2rem',
                  background: 'rgba(18, 20, 29, 0.65)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                }}
              >
                {/* 1. Personal Identity */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <User size={18} color="#38bdf8" />
                  <span>Personal & Contact Identity</span>
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2rem',
                  }}
                >
                  {/* Full Name */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="docName" style={labelStyle}>
                      Full Practitioner Name *
                    </label>
                    <input
                      id="docName"
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={inputDarkStyle}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="docPhone" style={labelStyle}>
                      Official Contact Phone
                    </label>
                    <input
                      id="docPhone"
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={inputDarkStyle}
                    />
                  </div>

                  {/* Profile Image URL */}
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                    <label className="form-label" htmlFor="docImg" style={labelStyle}>
                      Profile Image URL
                    </label>
                    <input
                      id="docImg"
                      type="url"
                      className="form-input"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or direct image link"
                      style={inputDarkStyle}
                    />
                  </div>
                </div>

                {/* 2. Professional & Medical Credentials */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Stethoscope size={18} color="#38bdf8" />
                  <span>Medical Credentials & Specialization</span>
                </h3>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1.25rem',
                    marginBottom: '2rem',
                  }}
                >
                  {/* Specialization */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="specialization" style={labelStyle}>
                      Clinical Specialization *
                    </label>
                    <input
                      id="specialization"
                      type="text"
                      className="form-input"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Cardiology, Neurology, Pediatrics"
                      style={inputDarkStyle}
                      required
                    />
                  </div>

                  {/* Medical License ID (Read-only for security) */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="license" style={labelStyle}>
                      Medical License Number (Verified)
                    </label>
                    <input
                      id="license"
                      type="text"
                      className="form-input"
                      value={licenseNumber}
                      disabled
                      style={{
                        ...inputDarkStyle,
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        color: 'rgba(200, 205, 225, 0.6)',
                        cursor: 'not-allowed',
                      }}
                    />
                  </div>

                  {/* Experience */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="experience" style={labelStyle}>
                      Years of Clinical Experience
                    </label>
                    <input
                      id="experience"
                      type="number"
                      min="0"
                      max="70"
                      className="form-input"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      style={inputDarkStyle}
                    />
                  </div>

                  {/* Consultation Fee */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="fee" style={labelStyle}>
                      Consultation Fee (INR ₹) *
                    </label>
                    <input
                      id="fee"
                      type="number"
                      min="0"
                      className="form-input"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      style={inputDarkStyle}
                      required
                    />
                  </div>

                  {/* Hospital Affiliation */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="hospital" style={labelStyle}>
                      Hospital / Clinic Affiliation
                    </label>
                    <input
                      id="hospital"
                      type="text"
                      className="form-input"
                      value={hospitalAffiliation}
                      onChange={(e) => setHospitalAffiliation(e.target.value)}
                      placeholder="e.g. St. Jude Medical Center, Metro Health"
                      style={inputDarkStyle}
                    />
                  </div>

                  {/* Practice Location */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="location" style={labelStyle}>
                      Practice Location / City
                    </label>
                    <input
                      id="location"
                      type="text"
                      className="form-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai, MH or Downtown Clinic"
                      style={inputDarkStyle}
                    />
                  </div>

                  {/* Qualifications */}
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                    <label className="form-label" htmlFor="qualifications" style={labelStyle}>
                      Degrees & Medical Qualifications (comma separated)
                    </label>
                    <input
                      id="qualifications"
                      type="text"
                      className="form-input"
                      value={qualificationsText}
                      onChange={(e) => setQualificationsText(e.target.value)}
                      placeholder="e.g. MBBS, MD (Internal Medicine), DM (Cardiology)"
                      style={inputDarkStyle}
                    />
                  </div>
                </div>

                {/* 3. Biography & Clinical About */}
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    marginBottom: '1.25rem',
                    paddingBottom: '0.85rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <FileText size={18} color="#38bdf8" />
                  <span>Clinical Biography & Background</span>
                </h3>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" htmlFor="bio" style={labelStyle}>
                    About the Physician (Public Patient View)
                  </label>
                  <textarea
                    id="bio"
                    rows="4"
                    className="form-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Provide a comprehensive introduction to your clinical expertise, care philosophy, and background..."
                    style={{
                      ...inputDarkStyle,
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Submit Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <PrimaryGlassButton
                    type="submit"
                    size="lg"
                    loading={saving}
                    icon={<Save size={18} />}
                    style={{ minWidth: '200px' }}
                  >
                    Save Profile Changes
                  </PrimaryGlassButton>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
