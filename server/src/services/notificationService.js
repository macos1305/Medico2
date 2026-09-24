const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Create a single in-app notification
 */
const createNotification = async ({ recipient, type, title, message, data = {} }) => {
  try {
    if (!recipient) return null;
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data,
    });
    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

/**
 * Dispatch notification to all active platform administrators
 */
const notifyAdmins = async ({ type, title, message, data = {} }) => {
  try {
    const adminUsers = await User.find({ role: 'ADMIN', isActive: true }).select('_id');
    if (!adminUsers || adminUsers.length === 0) return [];

    const notifications = await Promise.all(
      adminUsers.map((admin) =>
        Notification.create({
          recipient: admin._id,
          type,
          title,
          message,
          data,
        })
      )
    );
    return notifications;
  } catch (error) {
    console.error('Failed to notify admins:', error.message);
    return [];
  }
};

/**
 * Get paginated list of notifications for a user
 */
const getUserNotifications = async (userId, query = {}) => {
  const filter = { recipient: userId };
  if (query.isRead !== undefined && query.isRead !== '') {
    filter.isRead = query.isRead === 'true' || query.isRead === true;
  }

  const limit = Math.min(parseInt(query.limit, 10) || 50, 100);
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ]);

  return {
    notifications,
    unreadCount,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get total unread notifications count for a user
 */
const getUnreadCount = async (userId) => {
  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });
  return { unreadCount };
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  return notification;
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return {
    modifiedCount: result.modifiedCount || 0,
    message: 'All notifications marked as read',
  };
};

/**
 * Delete a single notification
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    const error = new Error('Notification not found');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Notification deleted successfully' };
};

/**
 * Clear all notifications for a user
 */
const clearAllNotifications = async (userId) => {
  const result = await Notification.deleteMany({ recipient: userId });
  return {
    deletedCount: result.deletedCount || 0,
    message: 'All notifications cleared',
  };
};

module.exports = {
  createNotification,
  notifyAdmins,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
};
