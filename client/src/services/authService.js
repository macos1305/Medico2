import api from './api';

export const authService = {
  // Unified Register
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  // Register Patient
  registerPatient: async (patientData) => {
    return api.post('/auth/register/patient', patientData);
  },

  // Register Doctor
  registerDoctor: async (doctorData) => {
    return api.post('/auth/register/doctor', doctorData);
  },

  // Login (Patient, Doctor, or Admin)
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  // Fetch Current Authenticated User & Profile
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

export default authService;
