import React, { useState } from 'react';
import PatientRegisterPage from './PatientRegisterPage';
import DoctorRegisterPage from './DoctorRegisterPage';
import { User, Stethoscope, Activity } from 'lucide-react';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState('PATIENT');

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--slate-100)',
            padding: '0.4rem',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedRole('PATIENT')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all var(--transition-fast)',
              backgroundColor: selectedRole === 'PATIENT' ? '#ffffff' : 'transparent',
              color: selectedRole === 'PATIENT' ? 'var(--primary-700)' : 'var(--slate-600)',
              boxShadow: selectedRole === 'PATIENT' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <User size={18} />
            <span>Register as Patient</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('DOCTOR')}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.95rem',
              transition: 'all var(--transition-fast)',
              backgroundColor: selectedRole === 'DOCTOR' ? '#ffffff' : 'transparent',
              color: selectedRole === 'DOCTOR' ? 'var(--primary-700)' : 'var(--slate-600)',
              boxShadow: selectedRole === 'DOCTOR' ? 'var(--shadow-sm)' : 'none',
            }}
          >
            <Stethoscope size={18} />
            <span>Register as Doctor</span>
          </button>
        </div>

        {/* Selected Form */}
        {selectedRole === 'PATIENT' ? <PatientRegisterPage /> : <DoctorRegisterPage />}
      </div>
    </div>
  );
};

export default RegisterPage;
