import api from './api';

export const adminService = {
  getStats: async () => {
    return api.get('/admin/stats');
  },

  getDoctors: async (params = {}) => {
    return api.get('/admin/doctors', { params });
  },

  getDoctor: async (id) => {
    return api.get(`/admin/doctors/${id}`);
  },

  approveDoctor: async (id) => {
    return api.patch(`/admin/doctors/${id}/approve`);
  },

  rejectDoctor: async (id, rejectionReason = '') => {
    return api.patch(`/admin/doctors/${id}/reject`, { rejectionReason });
  },

  toggleDoctorStatus: async (id, isActive) => {
    return api.patch(`/admin/doctors/${id}/status`, { isActive });
  },

  getPatients: async (params = {}) => {
    return api.get('/admin/patients', { params });
  },

  getPatient: async (id) => {
    return api.get(`/admin/patients/${id}`);
  },

  togglePatientStatus: async (id, isActive) => {
    return api.patch(`/admin/patients/${id}/status`, { isActive });
  },

  getAppointments: async (params = {}) => {
    return api.get('/admin/appointments', { params });
  },

  cancelAppointment: async (id, cancellationReason = '') => {
    return api.patch(`/admin/appointments/${id}/cancel`, { cancellationReason });
  },
};

export default adminService;
