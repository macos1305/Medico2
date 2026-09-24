const notificationService = require('../services/notificationService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get paginated list of notifications for the authenticated user
 * GET /api/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user._id, req.query);
    return sendSuccess(res, 200, 'Notifications retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get unread notifications count for authenticated user
 * GET /api/notifications/unread-count
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user._id);
    return sendSuccess(res, 200, 'Unread notification count retrieved', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a single notification as read
 * PATCH /api/notifications/:id/read
 */
const markAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Notification marked as read', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 * POST /api/notifications/read-all
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);
    return sendSuccess(res, 200, 'All notifications marked as read', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a notification
 * DELETE /api/notifications/:id
 */
const deleteNotification = async (req, res, next) => {
  try {
    const result = await notificationService.deleteNotification(req.params.id, req.user._id);
    return sendSuccess(res, 200, 'Notification deleted successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications
 * DELETE /api/notifications
 */
const clearAllNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.clearAllNotifications(req.user._id);
    return sendSuccess(res, 200, 'All notifications cleared successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
