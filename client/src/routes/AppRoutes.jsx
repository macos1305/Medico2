import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import DoctorListPage from '../pages/public/DoctorListPage';
import DoctorDetailPage from '../pages/public/DoctorDetailPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PatientRegisterPage from '../pages/auth/PatientRegisterPage';
import DoctorRegisterPage from '../pages/auth/DoctorRegisterPage';

// Patient Module Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientProfilePage from '../pages/patient/PatientProfilePage';
import PatientAppointmentsPage from '../pages/patient/PatientAppointmentsPage';

// Doctor Module Pages
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointmentsPage from '../pages/doctor/DoctorAppointmentsPage';
import DoctorAvailabilityPage from '../pages/doctor/DoctorAvailabilityPage';
import DoctorProfilePage from '../pages/doctor/DoctorProfilePage';

// Admin Module Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminDoctorsPage from '../pages/admin/AdminDoctorsPage';
import AdminPatientsPage from '../pages/admin/AdminPatientsPage';
import AdminAppointmentsPage from '../pages/admin/AdminAppointmentsPage';

// 404 Component
const NotFoundPage = () => (
  <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', minHeight: '60vh' }}>
    <h1 style={{ fontSize: '3rem', color: 'var(--primary-600)', marginBottom: '1rem' }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: 'var(--slate-500)', marginBottom: '2rem' }}>
      The healthcare page or clinical resource you requested could not be located.
    </p>
    <Link to="/" className="btn btn-primary">
      Return to Homepage
    </Link>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/doctors" element={<DoctorListPage />} />
      <Route path="/doctors/:id" element={<DoctorDetailPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/patient" element={<PatientRegisterPage />} />
      <Route path="/register/doctor" element={<DoctorRegisterPage />} />

      {/* Protected Patient Routes */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/appointments"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/profile"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Doctor Routes */}
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/availability"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorAvailabilityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDoctorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/patients"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPatientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAppointmentsPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
