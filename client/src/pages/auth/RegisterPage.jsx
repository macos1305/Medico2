import React, { useState } from 'react';
import PatientRegisterPage from './PatientRegisterPage';
import DoctorRegisterPage from './DoctorRegisterPage';
import { User, Stethoscope } from 'lucide-react';

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState('PATIENT');

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Role Selector Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '0.35rem',
            borderRadius: '9999px',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
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
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              border: selectedRole === 'PATIENT' ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.25s ease',
              backgroundColor: selectedRole === 'PATIENT' ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
              color: selectedRole === 'PATIENT' ? '#38bdf8' : 'rgba(200, 205, 225, 0.7)',
              boxShadow: selectedRole === 'PATIENT' ? '0 0 20px rgba(56, 189, 248, 0.15)' : 'none',
            }}
          >
            <User size={17} />
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
              padding: '0.75rem 1.25rem',
              borderRadius: '9999px',
              border: selectedRole === 'DOCTOR' ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.25s ease',
              backgroundColor: selectedRole === 'DOCTOR' ? 'rgba(139, 92, 246, 0.12)' : 'transparent',
              color: selectedRole === 'DOCTOR' ? '#c084fc' : 'rgba(200, 205, 225, 0.7)',
              boxShadow: selectedRole === 'DOCTOR' ? '0 0 20px rgba(139, 92, 246, 0.15)' : 'none',
            }}
          >
            <Stethoscope size={17} />
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
