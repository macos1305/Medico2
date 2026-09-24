const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All patient routes require authentication and PATIENT role
router.use(protect, authorizeRoles('PATIENT'));

router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);

module.exports = router;
