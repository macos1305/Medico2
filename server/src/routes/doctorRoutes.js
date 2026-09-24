const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Logged-in doctor profile management
router.get(
  '/profile/me',
  protect,
  authorizeRoles('DOCTOR'),
  doctorController.getMyDoctorProfile
);

router.put(
  '/profile/me',
  protect,
  authorizeRoles('DOCTOR'),
  doctorController.updateMyDoctorProfile
);

// Public doctor browsing and profiles
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctor);

module.exports = router;
