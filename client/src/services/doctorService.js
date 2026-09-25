import api from './api';

export const doctorService = {
  getAll: async (params = {}) => {
    return api.get('/doctors', { params });
  },

  getById: async (id) => {
    return api.get(`/doctors/${id}`);
  },

  getFeatured: async (limit = 6) => {
    return api.get('/doctors/featured', { params: { limit } });
  },

  getMyProfile: async () => {
    return api.get('/doctors/profile/me');
  },

  updateMyProfile: async (data) => {
    return api.put('/doctors/profile/me', data);
  },
};

export default doctorService;
