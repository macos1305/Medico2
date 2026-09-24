import api from './api';

export const availabilityService = {
  getDoctorAvailability: async (doctorId) => {
    return api.get(`/availability/doctor/${doctorId}`);
  },

  getAvailableSlots: async (doctorId, date) => {
    return api.get(`/availability/doctor/${doctorId}/slots`, {
      params: { date },
    });
  },

  updateAvailability: async (doctorId, data) => {
    return api.put(`/availability/doctor/${doctorId}`, data);
  },

  getMyAvailability: async () => {
    return api.get('/availability/me');
  },

  updateMyAvailability: async (data) => {
    return api.put('/availability/me', data);
  },

  resetMyAvailability: async () => {
    return api.delete('/availability/me');
  },

  blockDate: async (date) => {
    return api.post('/availability/me/block-date', { date });
  },

  unblockDate: async (date) => {
    return api.post('/availability/me/unblock-date', { date });
  },
};

export default availabilityService;
