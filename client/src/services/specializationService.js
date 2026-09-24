import api from './api';

export const specializationService = {
  getAll: async () => {
    return api.get('/specializations');
  },
};

export default specializationService;
