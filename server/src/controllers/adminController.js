const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Get platform statistics (GET /api/admin/stats)
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getPlatformStats();
    return sendSuccess(res, 200, 'Platform statistics retrieved successfully', stats);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all doctors with filters (GET /api/admin/doctors)
 */
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await adminService.getAllDoctors(req.query);
    return sendSuccess(res, 200, 'Doctors retrieved successfully', doctors);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single doctor dossier (GET /api/admin/doctors/:id)
 */
const getDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.getDoctorById(req.params.id);
    return sendSuccess(res, 200, 'Doctor profile retrieved successfully', doctor);
  } catch (error) {
    next(error);
  }
};

/**
 * Approve doctor credentials (PATCH /api/admin/doctors/:id/approve)
 */
const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.updateDoctorApproval(req.params.id, {
      approvalStatus: 'APPROVED',
    });
    return sendSuccess(
      res,
      200,
      `Doctor ${doctor.user?.name || ''} has been approved`,
      doctor
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Reject doctor credentials (PATCH /api/admin/doctors/:id/reject)
 */
const rejectDoctor = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const doctor = await adminService.updateDoctorApproval(req.params.id, {
      approvalStatus: 'REJECTED',
      rejectionReason,
    });
    return sendSuccess(
      res,
      200,
      `Doctor ${doctor.user?.name || ''} application has been rejected`,
      doctor
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Activate or deactivate doctor user account (PATCH /api/admin/doctors/:id/status)
 */
const toggleDoctorStatus = async (req, res, next) => {
  try {
    const doctor = await adminService.getDoctorById(req.params.id);
    const userId = doctor.user?._id;
    const updatedUser = await adminService.toggleUserActive(userId, req.body);
    return sendSuccess(
      res,
      200,
      `Doctor account has been ${updatedUser.isActive ? 'activated' : 'deactivated'}`,
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all patients (GET /api/admin/patients)
 */
const getPatients = async (req, res, next) => {
  try {
    const patients = await adminService.getAllPatients(req.query);
    return sendSuccess(res, 200, 'Patients retrieved successfully', patients);
  } catch (error) {
    next(error);
  }
};

/**
 * Get single patient dossier (GET /api/admin/patients/:id)
 */
const getPatient = async (req, res, next) => {
  try {
    const patient = await adminService.getPatientById(req.params.id);
    return sendSuccess(res, 200, 'Patient dossier retrieved successfully', patient);
  } catch (error) {
    next(error);
  }
};

/**
 * Activate or deactivate patient user account (PATCH /api/admin/patients/:id/status)
 */
const togglePatientStatus = async (req, res, next) => {
  try {
    const patient = await adminService.getPatientById(req.params.id);
    const userId = patient.user?._id;
    const updatedUser = await adminService.toggleUserActive(userId, req.body);
    return sendSuccess(
      res,
      200,
      `Patient account has been ${updatedUser.isActive ? 'activated' : 'deactivated'}`,
      updatedUser
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all appointments platform-wide (GET /api/admin/appointments)
 */
const getAppointments = async (req, res, next) => {
  try {
    const appointments = await adminService.getAllAppointments(req.query);
    return sendSuccess(
      res,
      200,
      'Platform appointments retrieved successfully',
      appointments
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel appointment by administrator (PATCH /api/admin/appointments/:id/cancel)
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const appointment = await adminService.cancelAppointmentByAdmin(
      req.params.id,
      cancellationReason
    );
    return sendSuccess(
      res,
      200,
      'Appointment cancelled by administrator successfully',
      appointment
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getDoctors,
  getDoctor,
  approveDoctor,
  rejectDoctor,
  toggleDoctorStatus,
  getPatients,
  getPatient,
  togglePatientStatus,
  getAppointments,
  cancelAppointment,
};
