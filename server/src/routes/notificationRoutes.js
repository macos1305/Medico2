const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require('../controllers/notificationController');

const router = express.Router();

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.delete('/', clearAllNotifications);
router.get('/unread-count', getUnreadCount);
router.patch('/read-all', markAllAsRead);
router.post('/read-all', markAllAsRead); // alias for post
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
