const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// ── Public ────────────────────────────────────────────────────────────────────
// Get all visible reviews for a specific doctor (used on doctor profile page)
router.get('/doctor/:doctorId', reviewController.getDoctorReviews);

// ── Authenticated (Patient) ───────────────────────────────────────────────────
// Submit a new review
router.post('/', protect, authorizeRoles('PATIENT'), reviewController.createReview);

// Get own submitted reviews
router.get(
  '/my-reviews',
  protect,
  authorizeRoles('PATIENT'),
  reviewController.getMyReviews
);

// Check if a review exists for a specific appointment
router.get(
  '/check/:appointmentId',
  protect,
  authorizeRoles('PATIENT'),
  reviewController.checkReviewExists
);

// Delete own review (patient) — admin deletion handled via admin routes
router.delete(
  '/:id',
  protect,
  authorizeRoles('PATIENT', 'ADMIN'),
  reviewController.deleteReview
);

// ── Admin ─────────────────────────────────────────────────────────────────────
// List all reviews (any visibility state)
router.get(
  '/admin/all',
  protect,
  authorizeRoles('ADMIN'),
  reviewController.adminGetAllReviews
);

// Toggle a review's visibility (hide / restore)
router.patch(
  '/:id/visibility',
  protect,
  authorizeRoles('ADMIN'),
  reviewController.setReviewVisibility
);

module.exports = router;
