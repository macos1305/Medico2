import api from './api';

const notificationService = {
  /** Get paginated notifications for current user */
  getNotifications: (params = {}) => api.get('/notifications', { params }),

  /** Get count of unread notifications */
  getUnreadCount: () => api.get('/notifications/unread-count'),

  /** Mark a single notification as read */
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),

  /** Mark all user notifications as read */
  markAllAsRead: () => api.patch('/notifications/read-all'),

  /** Delete a single notification */
  delete: (id) => api.delete(`/notifications/${id}`),

  /** Clear all notifications */
  clearAll: () => api.delete('/notifications'),
};

export default notificationService;
