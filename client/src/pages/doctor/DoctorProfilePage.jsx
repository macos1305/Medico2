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
  DollarSign,
  Building2,
  MapPin,
  FileText,
  Save,
  CheckCircle2,
  ShieldCheck,
  Camera,
} from 'lucide-react';

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
  const [consultationFee, setConsultationFee] = useState(50);
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
        setConsultationFee(doc.consultationFee || 50);
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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 0' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-doctor">Practice Management</span>
              </div>
              <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                Doctor Practice Profile
              </h1>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Update your professional credentials, consultation fee, hospital affiliation, and public biography.
              </p>
            </div>

            {loading ? (
              <LoadingSpinner text="Retrieving profile credentials..." />
            ) : (
              <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
                {/* 1. Personal Identity */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <User size={18} color="var(--primary-600)" />
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
                    <label className="form-label" htmlFor="docName">
                      Full Practitioner Name *
                    </label>
                    <input
                      id="docName"
                      type="text"
                      className="form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="docPhone">
                      Official Contact Phone
                    </label>
                    <input
                      id="docPhone"
                      type="tel"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Profile Image URL */}
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                    <label className="form-label" htmlFor="docImg">
                      Profile Image URL
                    </label>
                    <input
                      id="docImg"
                      type="url"
                      className="form-input"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      placeholder="https://images.unsplash.com/... or hosted avatar link"
                    />
                  </div>
                </div>

                {/* 2. Professional & Medical Credentials */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <Stethoscope size={18} color="var(--primary-600)" />
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
                    <label className="form-label" htmlFor="specialization">
                      Clinical Specialization *
                    </label>
                    <input
                      id="specialization"
                      type="text"
                      className="form-input"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Cardiology, Neurology, Pediatrics"
                      required
                    />
                  </div>

                  {/* Medical License ID (Read-only for security) */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="license">
                      Medical License Number (Verified)
                    </label>
                    <input
                      id="license"
                      type="text"
                      className="form-input"
                      value={licenseNumber}
                      disabled
                      style={{ backgroundColor: 'var(--slate-100)', cursor: 'not-allowed' }}
                    />
                  </div>

                  {/* Experience */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="experience">
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
                    />
                  </div>

                  {/* Consultation Fee */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="fee">
                      Consultation Fee (USD $) *
                    </label>
                    <input
                      id="fee"
                      type="number"
                      min="0"
                      className="form-input"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      required
                    />
                  </div>

                  {/* Hospital Affiliation */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="hospital">
                      Hospital / Clinic Affiliation
                    </label>
                    <input
                      id="hospital"
                      type="text"
                      className="form-input"
                      value={hospitalAffiliation}
                      onChange={(e) => setHospitalAffiliation(e.target.value)}
                      placeholder="e.g. St. Jude Medical Center, Metro Health"
                    />
                  </div>

                  {/* Practice Location */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="location">
                      Practice Location / City
                    </label>
                    <input
                      id="location"
                      type="text"
                      className="form-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or Downtown Wing"
                    />
                  </div>

                  {/* Qualifications */}
                  <div className="form-group" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                    <label className="form-label" htmlFor="qualifications">
                      Degrees & Medical Qualifications (comma separated)
                    </label>
                    <input
                      id="qualifications"
                      type="text"
                      className="form-input"
                      value={qualificationsText}
                      onChange={(e) => setQualificationsText(e.target.value)}
                      placeholder="e.g. MD (Harvard Medical), FACS, Board Certified in Internal Medicine"
                    />
                  </div>
                </div>

                {/* 3. Biography & Clinical About */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <FileText size={18} color="var(--primary-600)" />
                  <span>Clinical Biography & Background</span>
                </h3>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" htmlFor="bio">
                    About the Physician (Public Patient View)
                  </label>
                  <textarea
                    id="bio"
                    rows="4"
                    className="form-textarea"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Provide a comprehensive introduction to your clinical expertise, care philosophy, and background..."
                  />
                </div>

                {/* Submit Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingTop: '1.25rem',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={saving}
                    style={{ minWidth: '180px', gap: '0.5rem' }}
                  >
                    <Save size={18} />
                    <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 840px) {
          .dashboard-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorProfilePage;
