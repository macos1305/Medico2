import React, { useState, useEffect } from 'react';
import PatientSidebar from '../../components/patient/PatientSidebar';
import ProfileForm from '../../components/patient/ProfileForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import patientService from '../../services/patientService';
import { User, ShieldCheck } from 'lucide-react';

const PatientProfilePage = () => {
  const { user, profile, updateUserData } = useAuth();
  const { success, error: toastError } = useToast();

  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await patientService.getProfile();
        if (res.data) {
          setPatientData(res.data);
          updateUserData(res.data.user, res.data.profile);
        }
      } catch (err) {
        console.error('Failed to load patient profile:', err);
        setPatientData({ user, profile });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, profile, updateUserData]);

  const handleSave = async (updatedFields) => {
    setSaving(true);
    try {
      const res = await patientService.updateProfile(updatedFields);
      setPatientData(res.data);
      updateUserData(res.data.user, res.data.profile);
      success('Your medical profile has been updated successfully', 'Profile Saved');
    } catch (err) {
      const msg = err.message || 'Failed to update profile. Please try again.';
      toastError(msg, 'Update Error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading patient medical profile..." fullScreen />;
  }

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 4rem' }}>
      <div className="container">
        <div className="dashboard-layout">
          {/* Left Sidebar */}
          <PatientSidebar />

          <main>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: '#38bdf8',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Medical Record
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(148, 163, 184, 0.6)' }}>• Confidential & Encrypted</span>
              </div>
              <h1
                style={{
                  fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
                  fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.35rem',
                  letterSpacing: '-0.02em',
                }}
              >
                Patient Profile & Medical Info
              </h1>
              <p style={{ color: 'rgba(200, 205, 225, 0.7)', fontSize: '0.92rem' }}>
                Keep your personal, clinical, and emergency contact information current.
              </p>
            </div>

            <ProfileForm
              initialData={patientData}
              onSave={handleSave}
              loading={saving}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PatientProfilePage;
