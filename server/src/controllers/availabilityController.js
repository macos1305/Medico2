const availabilityService = require('../services/availabilityService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get doctor availability config
 */
const getDoctorAvailability = async (req, res, next) => {
  try {
    const result = await availabilityService.getDoctorAvailability(req.params.doctorId);
    return sendSuccess(res, 200, 'Doctor availability retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update doctor availability config
 */
const updateDoctorAvailability = async (req, res, next) => {
  try {
    const result = await availabilityService.updateDoctorAvailability(
      req.params.doctorId,
      req.body
    );
    return sendSuccess(res, 200, 'Doctor availability updated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get available slots for a doctor on a specific date
 */
const getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "date" (YYYY-MM-DD) is required',
      });
    }

    const result = await availabilityService.getAvailableSlotsForDate(doctorId, date);
    return sendSuccess(res, 200, 'Available slots calculated successfully', result);
  } catch (error) {
    next(error);
  }
};

const Doctor = require('../models/Doctor');

const getMyDoctorId = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }
  return doctor._id;
};

/**
 * Get current logged in doctor's availability
 */
const getMyAvailability = async (req, res, next) => {
  try {
    const doctorId = await getMyDoctorId(req.user._id);
    const result = await availabilityService.getDoctorAvailability(doctorId);
    return sendSuccess(res, 200, 'Doctor availability retrieved successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Update current logged in doctor's availability
 */
const updateMyAvailability = async (req, res, next) => {
  try {
    const doctorId = await getMyDoctorId(req.user._id);
    const result = await availabilityService.updateDoctorAvailability(doctorId, req.body);
    return sendSuccess(res, 200, 'Doctor availability updated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Reset current doctor's availability to default
 */
const resetMyAvailability = async (req, res, next) => {
  try {
    const doctorId = await getMyDoctorId(req.user._id);
    const result = await availabilityService.resetDoctorAvailability(doctorId);
    return sendSuccess(res, 200, 'Doctor availability reset to standard schedule', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Block a specific date
 */
const blockMyDate = async (req, res, next) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Field "date" (YYYY-MM-DD) is required',
      });
    }
    const doctorId = await getMyDoctorId(req.user._id);
    const result = await availabilityService.blockDoctorDate(doctorId, date);
    return sendSuccess(res, 200, `Date ${date} successfully blocked from bookings`, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Unblock a specific date
 */
const unblockMyDate = async (req, res, next) => {
  try {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Field "date" (YYYY-MM-DD) is required',
      });
    }
    const doctorId = await getMyDoctorId(req.user._id);
    const result = await availabilityService.unblockDoctorDate(doctorId, date);
    return sendSuccess(res, 200, `Date ${date} successfully unblocked`, result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctorAvailability,
  updateDoctorAvailability,
  getAvailableSlots,
  getMyAvailability,
  updateMyAvailability,
  resetMyAvailability,
  blockMyDate,
  unblockMyDate,
};
