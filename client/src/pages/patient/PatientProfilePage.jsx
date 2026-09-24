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
        // Fallback to authContext data
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
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 0 3rem' }}>
      <div className="container">
        <div className="dashboard-layout">
          {/* Left Sidebar */}
          <PatientSidebar />

          <main>
            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-patient">Medical Record</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--slate-400)' }}>Confidential & Encrypted</span>
              </div>
              <h1 style={{ fontSize: 'var(--text-3xl)', color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                Patient Profile & Medical Info
              </h1>
              <p style={{ color: 'var(--slate-500)', fontSize: 'var(--text-sm)' }}>
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
