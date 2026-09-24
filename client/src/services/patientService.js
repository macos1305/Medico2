import api from './api';

export const patientService = {
  getProfile: async () => {
    return api.get('/patient/profile');
  },

  updateProfile: async (profileData) => {
    return api.put('/patient/profile', profileData);
  },
};

export default patientService;
