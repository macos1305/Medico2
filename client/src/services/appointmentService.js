import api from './api';

export const appointmentService = {
  create: async (appointmentData) => {
    return api.post('/appointments', appointmentData);
  },

  getMyAppointments: async (tab = 'upcoming') => {
    return api.get('/appointments/my-appointments', {
      params: { tab },
    });
  },

  getById: async (id) => {
    return api.get(`/appointments/${id}`);
  },

  cancel: async (id, cancellationReason = '') => {
    return api.patch(`/appointments/${id}/cancel`, { cancellationReason });
  },

  reschedule: async (id, rescheduleData) => {
    return api.patch(`/appointments/${id}/reschedule`, rescheduleData);
  },

  getDoctorAppointments: async (params = {}) => {
    return api.get('/appointments/doctor-appointments', { params });
  },

  getDoctorStats: async () => {
    return api.get('/appointments/doctor-stats');
  },

  confirmDoctorAppointment: async (id) => {
    return api.patch(`/appointments/${id}/confirm`);
  },

  completeDoctorAppointment: async (id) => {
    return api.patch(`/appointments/${id}/complete`);
  },

  rejectDoctorAppointment: async (id, cancellationReason = '') => {
    return api.patch(`/appointments/${id}/reject`, { cancellationReason });
  },
};

export default appointmentService;
