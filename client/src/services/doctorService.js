import api from './api';

export const doctorService = {
  getAll: async (params = {}) => {
    return api.get('/doctors', { params });
  },

  getMyProfile: async () => {
    return api.get('/doctors/profile/me');
  },

  updateMyProfile: async (data) => {
    return api.put('/doctors/profile/me', data);
  },
};

export default doctorService;
