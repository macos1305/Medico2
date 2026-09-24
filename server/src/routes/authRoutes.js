const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const {
  validateRegister,
  validatePatientRegister,
  validateDoctorRegister,
  validateLogin,
} = require('../validators/authValidators');

// Unified Registration endpoint
router.post(
  '/register',
  validateRegister,
  validate,
  authController.register
);
router.post(
  '/register/patient',
  validatePatientRegister,
  validate,
  authController.registerPatient
);

router.post(
  '/register/doctor',
  validateDoctorRegister,
  validate,
  authController.registerDoctor
);

router.post(
  '/login',
  validateLogin,
  validate,
  authController.login
);

// Protected Auth Endpoint
router.get('/me', protect, authController.getCurrentUser);

module.exports = router;
