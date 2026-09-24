const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All appointment operations require authentication
router.use(protect);

// Patient booking and personal appointments management
router.post(
  '/',
  authorizeRoles('PATIENT'),
  appointmentController.createAppointment
);

router.get(
  '/my-appointments',
  authorizeRoles('PATIENT'),
  appointmentController.getMyAppointments
);

// Doctor appointments and stats management (Role: DOCTOR)
router.get(
  '/doctor-appointments',
  authorizeRoles('DOCTOR'),
  appointmentController.getDoctorAppointments
);

router.get(
  '/doctor-stats',
  authorizeRoles('DOCTOR'),
  appointmentController.getDoctorStats
);

router.patch(
  '/:id/confirm',
  authorizeRoles('DOCTOR'),
  appointmentController.confirmDoctorAppointment
);

router.patch(
  '/:id/complete',
  authorizeRoles('DOCTOR'),
  appointmentController.completeDoctorAppointment
);

router.patch(
  '/:id/reject',
  authorizeRoles('DOCTOR'),
  appointmentController.rejectDoctorAppointment
);

// Individual appointment details (accessible to Patient/Doctor/Admin with ownership verification)
router.get('/:id', appointmentController.getAppointment);

router.patch(
  '/:id/cancel',
  authorizeRoles('PATIENT'),
  appointmentController.cancelAppointment
);

router.patch(
  '/:id/reschedule',
  authorizeRoles('PATIENT'),
  appointmentController.rescheduleAppointment
);

module.exports = router;
