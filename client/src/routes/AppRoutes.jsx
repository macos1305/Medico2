import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import DoctorListPage from '../pages/public/DoctorListPage';
import DoctorDetailPage from '../pages/public/DoctorDetailPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import NotificationsPage from '../pages/common/NotificationsPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import PatientRegisterPage from '../pages/auth/PatientRegisterPage';
import DoctorRegisterPage from '../pages/auth/DoctorRegisterPage';

// Patient Module Pages
import PatientDashboard from '../pages/patient/PatientDashboard';
import PatientProfilePage from '../pages/patient/PatientProfilePage';
import PatientAppointmentsPage from '../pages/patient/PatientAppointmentsPage';
import RecommendDoctorPage from '../pages/patient/RecommendDoctorPage';

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
import AdminReviewsPage from '../pages/admin/AdminReviewsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/doctors" element={<DoctorListPage />} />
      <Route path="/doctors/:id" element={<DoctorDetailPage />} />

      {/* ── Auth Routes ───────────────────────────────────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/patient" element={<PatientRegisterPage />} />
      <Route path="/register/doctor" element={<DoctorRegisterPage />} />

      {/* ── System Pages ──────────────────────────────────────────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* ── Protected Common Notifications Route ─────────────────────────── */}
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* ── Protected Patient Routes ──────────────────────────────────────── */}
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/recommend-doctor"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <RecommendDoctorPage />
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

      {/* ── Protected Doctor Routes ───────────────────────────────────────── */}
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

      {/* ── Protected Admin Routes ────────────────────────────────────────── */}
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
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminReviewsPage />
          </ProtectedRoute>
        }
      />

      {/* ── 404 Catch-All ─────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
