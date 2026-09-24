const doctorService = require('../services/doctorService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get all doctors with filters and search
 */
const getDoctors = async (req, res, next) => {
  try {
    const list = await doctorService.getAllDoctors(req.query);
    return sendSuccess(res, 200, 'Doctors retrieved successfully', list);
  } catch (error) {
    next(error);
  }
};

/**
 * Get doctor by ID
 */
const getDoctor = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    return sendSuccess(res, 200, 'Doctor profile retrieved successfully', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in doctor's profile (GET /api/doctors/profile/me)
 */
const getMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorProfileByUserId(req.user._id);
    return sendSuccess(res, 200, 'Doctor profile retrieved successfully', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current logged in doctor's profile (PUT /api/doctors/profile/me)
 */
const updateMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctorProfile(req.user._id, req.body);
    return sendSuccess(res, 200, 'Doctor profile updated successfully', doctor);
  } catch (error) {
    next(error);
  }
};

const aiRecommendationService = require('../services/aiRecommendationService');

/**
 * AI Doctor Recommendation based on natural language symptoms
 * POST /api/doctors/recommend
 */
const recommendDoctors = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    const result = await aiRecommendationService.recommendDoctors(symptoms);
    return sendSuccess(res, 200, 'Doctor recommendations generated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getDoctor,
  getMyDoctorProfile,
  updateMyDoctorProfile,
  recommendDoctors,
};
