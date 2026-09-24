const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/* ─────────────────────────────────────────────────────────────────────────────
   POST /api/reviews
   Create a new review — patient only, must have a COMPLETED appointment
   ───────────────────────────────────────────────────────────────────────────── */
const createReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    // 1. Validate required fields
    if (!appointmentId) {
      return sendError(res, 400, 'Appointment ID is required');
    }
    if (!rating || rating < 1 || rating > 5) {
      return sendError(res, 400, 'Rating must be a number between 1 and 5');
    }

    // 2. Load the requesting patient's record
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return sendError(res, 404, 'Patient profile not found');
    }

    // 3. Load the appointment and verify ownership + status
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor')
      .populate('patient');

    if (!appointment) {
      return sendError(res, 404, 'Appointment not found');
    }

    if (appointment.patient._id.toString() !== patient._id.toString()) {
      return sendError(res, 403, 'You can only review your own appointments');
    }

    if (appointment.status !== 'COMPLETED') {
      return sendError(res, 400, 'You can only review a completed appointment');
    }

    // 4. Prevent duplicate review for the same appointment
    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return sendError(res, 409, 'You have already submitted a review for this appointment');
    }

    // 5. Create the review
    const review = await Review.create({
      patient: patient._id,
      doctor: appointment.doctor._id,
      appointment: appointment._id,
      rating: Number(rating),
      comment: (comment || '').trim(),
    });

    // Populate for the response
    const populated = await Review.findById(review._id)
      .populate({ path: 'patient', populate: { path: 'user', select: 'name profileImage' } })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name profileImage' } });

    return sendSuccess(res, 201, 'Review submitted successfully', populated);
  } catch (err) {
    if (err.code === 11000) {
      return sendError(res, 409, 'A review for this appointment already exists');
    }
    console.error('createReview error:', err);
    return sendError(res, 500, err.message || 'Failed to create review');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reviews/doctor/:doctorId
   Public — get all visible reviews for a doctor (paginated)
   ───────────────────────────────────────────────────────────────────────────── */
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ doctor: doctorId, isVisible: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name profileImage' } }),
      Review.countDocuments({ doctor: doctorId, isVisible: true }),
    ]);

    return sendSuccess(res, 200, 'Doctor reviews retrieved', {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('getDoctorReviews error:', err);
    return sendError(res, 500, err.message || 'Failed to retrieve reviews');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reviews/my-reviews
   Patient — get own reviews
   ───────────────────────────────────────────────────────────────────────────── */
const getMyReviews = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return sendError(res, 404, 'Patient profile not found');
    }

    const reviews = await Review.find({ patient: patient._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name profileImage' } })
      .populate('appointment', 'date startTime endTime reason status');

    return sendSuccess(res, 200, 'Your reviews retrieved', reviews);
  } catch (err) {
    console.error('getMyReviews error:', err);
    return sendError(res, 500, err.message || 'Failed to retrieve your reviews');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reviews/check/:appointmentId
   Patient — check if a review already exists for an appointment
   ───────────────────────────────────────────────────────────────────────────── */
const checkReviewExists = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) return sendError(res, 404, 'Patient profile not found');

    const review = await Review.findOne({
      appointment: req.params.appointmentId,
      patient: patient._id,
    });

    return sendSuccess(res, 200, 'Review check complete', {
      reviewed: !!review,
      review: review || null,
    });
  } catch (err) {
    console.error('checkReviewExists error:', err);
    return sendError(res, 500, err.message || 'Check failed');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   DELETE /api/reviews/:id
   Patient — delete own review  |  Admin — delete any review (moderation)
   ───────────────────────────────────────────────────────────────────────────── */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return sendError(res, 404, 'Review not found');

    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin) {
      // Patient can only delete their own
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || review.patient.toString() !== patient._id.toString()) {
        return sendError(res, 403, 'You are not authorized to delete this review');
      }
    }

    await Review.findByIdAndDelete(req.params.id);
    // Rating re-aggregation is handled by the post-hook in the model

    return sendSuccess(res, 200, 'Review removed successfully');
  } catch (err) {
    console.error('deleteReview error:', err);
    return sendError(res, 500, err.message || 'Failed to delete review');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   PATCH /api/reviews/:id/visibility  (Admin only)
   Hide or restore a review without permanent deletion
   ───────────────────────────────────────────────────────────────────────────── */
const setReviewVisibility = async (req, res) => {
  try {
    const { isVisible } = req.body;
    if (typeof isVisible !== 'boolean') {
      return sendError(res, 400, 'isVisible must be a boolean');
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      {
        isVisible,
        moderatedAt: new Date(),
        moderatedBy: req.user._id,
      },
      { new: true }
    );

    if (!review) return sendError(res, 404, 'Review not found');

    return sendSuccess(
      res,
      200,
      `Review ${isVisible ? 'restored' : 'hidden'} successfully`,
      review
    );
  } catch (err) {
    console.error('setReviewVisibility error:', err);
    return sendError(res, 500, err.message || 'Failed to update review visibility');
  }
};

/* ─────────────────────────────────────────────────────────────────────────────
   GET /api/reviews/admin/all  (Admin only)
   List all reviews with pagination and optional filters
   ───────────────────────────────────────────────────────────────────────────── */
const adminGetAllReviews = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const { isVisible, doctorId } = req.query;

    const filter = {};
    if (isVisible !== undefined) filter.isVisible = isVisible === 'true';
    if (doctorId) filter.doctor = doctorId;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: 'patient', populate: { path: 'user', select: 'name email' } })
        .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } })
        .populate('appointment', 'date startTime status'),
      Review.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'All reviews retrieved', {
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('adminGetAllReviews error:', err);
    return sendError(res, 500, err.message || 'Failed to retrieve reviews');
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  getMyReviews,
  checkReviewExists,
  deleteReview,
  setReviewVisibility,
  adminGetAllReviews,
};
