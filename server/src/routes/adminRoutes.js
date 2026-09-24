const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Enforce strict authentication and ADMIN role on all admin routes
router.use(protect);
router.use(authorizeRoles('ADMIN'));

// Platform statistics
router.get('/stats', adminController.getStats);

// Doctor management
router.get('/doctors', adminController.getDoctors);
router.get('/doctors/:id', adminController.getDoctor);
router.patch('/doctors/:id/approve', adminController.approveDoctor);
router.patch('/doctors/:id/reject', adminController.rejectDoctor);
router.patch('/doctors/:id/status', adminController.toggleDoctorStatus);

// Patient management
router.get('/patients', adminController.getPatients);
router.get('/patients/:id', adminController.getPatient);
router.patch('/patients/:id/status', adminController.togglePatientStatus);

// Platform-wide appointment management
router.get('/appointments', adminController.getAppointments);
router.patch('/appointments/:id/cancel', adminController.cancelAppointment);

module.exports = router;
