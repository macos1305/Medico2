const appointmentService = require('../services/appointmentService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Book / Create Appointment (POST /api/appointments)
 */
const createAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.createAppointment(req.user._id, req.body);
    return sendSuccess(res, 201, 'Appointment booked successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Patient's Appointments (GET /api/appointments/my-appointments)
 */
const getMyAppointments = async (req, res, next) => {
  try {
    const { tab } = req.query;
    const appointments = await appointmentService.getPatientAppointments(req.user._id, tab);
    return sendSuccess(res, 200, 'Appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single appointment details (GET /api/appointments/:id)
 */
const getAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentById(
      req.params.id,
      req.user._id,
      req.user.role
    );
    return sendSuccess(res, 200, 'Appointment details retrieved successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment (PATCH /api/appointments/:id/cancel)
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await appointmentService.cancelAppointment(
      req.params.id,
      req.user._id,
      cancellationReason
    );
    return sendSuccess(res, 200, 'Appointment cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Reschedule appointment (PATCH /api/appointments/:id/reschedule)
 */
const rescheduleAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.rescheduleAppointment(
      req.params.id,
      req.user._id,
      req.body
    );
    return sendSuccess(res, 200, 'Appointment rescheduled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Doctor's Appointments (GET /api/appointments/doctor-appointments)
 */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getDoctorAppointments(
      req.user._id,
      req.query
    );
    return sendSuccess(res, 200, 'Doctor appointments retrieved successfully', appointments);
  } catch (error) {
    next(error);
  }
};

/**
 * Get Doctor's Statistics (GET /api/appointments/doctor-stats)
 */
const getDoctorStats = async (req, res, next) => {
  try {
    const stats = await appointmentService.getDoctorStats(req.user._id);
    return sendSuccess(res, 200, 'Doctor statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Confirm Appointment by Doctor (PATCH /api/appointments/:id/confirm)
 */
const confirmDoctorAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatusByDoctor(
      req.params.id,
      req.user._id,
      { status: 'CONFIRMED' }
    );
    return sendSuccess(res, 200, 'Appointment confirmed successfully', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Complete Appointment by Doctor (PATCH /api/appointments/:id/complete)
 */
const completeDoctorAppointment = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateAppointmentStatusByDoctor(
      req.params.id,
      req.user._id,
      { status: 'COMPLETED' }
    );
    return sendSuccess(res, 200, 'Appointment marked as completed', appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * Reject / Cancel Appointment by Doctor (PATCH /api/appointments/:id/reject)
 */
const rejectDoctorAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await appointmentService.updateAppointmentStatusByDoctor(
      req.params.id,
      req.user._id,
      {
        status: 'CANCELLED',
        cancellationReason: cancellationReason || 'Declined by doctor',
      }
    );
    return sendSuccess(res, 200, 'Appointment rejected/cancelled successfully', appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  getDoctorStats,
  confirmDoctorAppointment,
  completeDoctorAppointment,
  rejectDoctorAppointment,
};
