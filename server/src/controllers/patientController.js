const patientService = require('../services/patientService');
const aiRecommendationService = require('../services/aiRecommendationService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get authenticated patient profile
 */
const getProfile = async (req, res, next) => {
  try {
    const result = await patientService.getPatientProfile(req.user._id);
    return sendSuccess(res, 200, 'Patient profile retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated patient profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const result = await patientService.updatePatientProfile(req.user._id, req.body);
    return sendSuccess(res, 200, 'Patient profile updated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * AI Doctor Recommendation based on patient's symptoms
 * POST /api/patient/recommend-doctor
 */
const recommendDoctor = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    const result = await aiRecommendationService.recommendDoctors(symptoms);
    return sendSuccess(res, 200, 'Doctor recommendations generated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  recommendDoctor,
};
