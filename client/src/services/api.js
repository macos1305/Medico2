import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medico_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors cleanly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorResponse = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected network error occurred',
      statusCode: error.response?.status || 500,
      details: error.response?.data?.error || null,
    };

    // Auto-logout if token is expired or invalid
    if (errorResponse.statusCode === 401) {
      if (localStorage.getItem('medico_token')) {
        localStorage.removeItem('medico_token');
        localStorage.removeItem('medico_user');
        // Let application state handle navigation smoothly
        window.dispatchEvent(new Event('medico-auth-expired'));
      }
    }

    return Promise.reject(errorResponse);
  }
);

export default api;
