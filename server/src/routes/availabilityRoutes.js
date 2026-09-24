const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Logged-in Doctor availability management (Role: DOCTOR)
router.get('/me', protect, authorizeRoles('DOCTOR'), availabilityController.getMyAvailability);
router.put('/me', protect, authorizeRoles('DOCTOR'), availabilityController.updateMyAvailability);
router.delete('/me', protect, authorizeRoles('DOCTOR'), availabilityController.resetMyAvailability);
router.post('/me/block-date', protect, authorizeRoles('DOCTOR'), availabilityController.blockMyDate);
router.post('/me/unblock-date', protect, authorizeRoles('DOCTOR'), availabilityController.unblockMyDate);

// Public endpoints to query availability and slots
router.get('/doctor/:doctorId', availabilityController.getDoctorAvailability);
router.get('/doctor/:doctorId/slots', availabilityController.getAvailableSlots);

// Protected endpoint to update doctor availability by doctorId
router.put(
  '/doctor/:doctorId',
  protect,
  authorizeRoles('DOCTOR', 'ADMIN'),
  availabilityController.updateDoctorAvailability
);

module.exports = router;
