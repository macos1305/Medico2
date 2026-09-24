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
          {/* Left Sidebar */}
          <PatientSidebar />

          {/* Main Content Area */}
          <div>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge badge-patient">Medical Record</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  Confidential & Encrypted
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', color: 'var(--slate-900)' }}>
                Patient Profile & Medical Info
              </h1>
              <p style={{ color: 'var(--slate-600)', fontSize: '0.95rem' }}>
                Keep your personal, clinical, and emergency contact information current.
              </p>
            </div>

            {/* Profile Form */}
            <ProfileForm
              initialData={patientData}
              onSave={handleSave}
              loading={saving}
            />
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

export default PatientProfilePage;
