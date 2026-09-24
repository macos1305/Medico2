const authService = require('../services/authService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Unified Registration handler (POST /api/auth/register)
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    const message =
      result.user.role === 'DOCTOR'
        ? 'Doctor registered successfully. Account pending administrative approval.'
        : 'Patient registered successfully.';
    return sendSuccess(res, 201, message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Patient registration
 */
const registerPatient = async (req, res, next) => {
  try {
    const result = await authService.registerPatient(req.body);
    return sendSuccess(res, 201, 'Patient registered successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Doctor registration
 */
const registerDoctor = async (req, res, next) => {
  try {
    const result = await authService.registerDoctor(req.body);
    return sendSuccess(
      res,
      201,
      'Doctor registered successfully. Your profile is pending administrative approval.',
      result
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Handle user login
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle fetch current authenticated user
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const result = await authService.getCurrentUser(req.user._id);
    return sendSuccess(res, 200, 'Authenticated profile retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  registerPatient,
  registerDoctor,
  login,
  getCurrentUser,
};
