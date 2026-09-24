import api from './api';

const reviewService = {
  /** Submit a new review (patient only – must have completed appointment) */
  create: (data) => api.post('/reviews', data),

  /** Get all visible reviews for a doctor (public) */
  getDoctorReviews: (doctorId, params = {}) =>
    api.get(`/reviews/doctor/${doctorId}`, { params }),

  /** Get the authenticated patient's own reviews */
  getMyReviews: () => api.get('/reviews/my-reviews'),

  /** Check whether the patient has already reviewed a specific appointment */
  checkExists: (appointmentId) => api.get(`/reviews/check/${appointmentId}`),

  /** Delete a review (patient deletes own; admin can delete any) */
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),

  /** Admin: list all reviews with optional filters */
  adminGetAll: (params = {}) => api.get('/reviews/admin/all', { params }),

  /** Admin: toggle review visibility (hide / restore) */
  adminSetVisibility: (reviewId, isVisible) =>
    api.patch(`/reviews/${reviewId}/visibility`, { isVisible }),
};

export default reviewService;
