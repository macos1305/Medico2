const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

/**
 * Get platform-wide governance statistics
 */
const getPlatformStats = async () => {
  const [
    totalPatients,
    totalDoctors,
    totalAppointments,
    pendingApprovals,
    completedAppointments,
    cancelledAppointments,
  ] = await Promise.all([
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Appointment.countDocuments(),
    Doctor.countDocuments({ approvalStatus: 'PENDING' }),
    Appointment.countDocuments({ status: 'COMPLETED' }),
    Appointment.countDocuments({ status: 'CANCELLED' }),
  ]);

  return {
    totalPatients,
    totalDoctors,
    totalAppointments,
    pendingApprovals,
    completedAppointments,
    cancelledAppointments,
  };
};

/**
 * List all doctors with search, status filters, and user population
 */
const getAllDoctors = async (query = {}) => {
  const { search, approvalStatus, isActive, specialization } = query;

  const filter = {};
  if (approvalStatus && approvalStatus !== 'All') {
    filter.approvalStatus = approvalStatus;
  }
  if (specialization && specialization !== 'All') {
    filter.specialization = new RegExp(`^${specialization.trim()}$`, 'i');
  }

  let doctors = await Doctor.find(filter)
    .populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive createdAt',
    })
    .sort({ createdAt: -1 });

  // Filter by user active state if requested
  if (isActive !== undefined && isActive !== '') {
    const activeBool = String(isActive) === 'true';
    doctors = doctors.filter((doc) => doc.user?.isActive === activeBool);
  }

  // Keyword search
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    doctors = doctors.filter((doc) => {
      const name = doc.user?.name?.toLowerCase() || '';
      const email = doc.user?.email?.toLowerCase() || '';
      const spec = doc.specialization?.toLowerCase() || '';
      const license = doc.licenseNumber?.toLowerCase() || '';
      const hospital = doc.hospitalAffiliation?.toLowerCase() || '';
      return (
        name.includes(term) ||
        email.includes(term) ||
        spec.includes(term) ||
        license.includes(term) ||
        hospital.includes(term)
      );
    });
  }

  return doctors;
};

/**
 * Get full doctor profile by ID with availability and appointments count
 */
const getDoctorById = async (id) => {
  let doctor = await Doctor.findById(id).populate({
    path: 'user',
    select: 'name email phone profileImage avatar isActive createdAt updatedAt',
  });

  if (!doctor) {
    doctor = await Doctor.findOne({ user: id }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive createdAt updatedAt',
    });
  }

  if (!doctor) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  const [availability, totalAppointments] = await Promise.all([
    Availability.findOne({ doctor: doctor._id }),
    Appointment.countDocuments({ doctor: doctor._id }),
  ]);

  const docObj = doctor.toObject();
  docObj.availability = availability;
  docObj.totalAppointments = totalAppointments;

  return docObj;
};

/**
 * Approve or Reject a doctor
 */
const updateDoctorApproval = async (id, approvalData) => {
  const { approvalStatus, rejectionReason } = approvalData;

  const validStatuses = ['APPROVED', 'REJECTED', 'PENDING'];
  if (!validStatuses.includes(approvalStatus)) {
    const error = new Error(
      `Invalid approval status. Must be one of: ${validStatuses.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const updateFields = { approvalStatus };
  if (approvalStatus === 'REJECTED') {
    updateFields.rejectionReason = rejectionReason
      ? rejectionReason.trim()
      : 'Application declined by administrator';
  } else if (approvalStatus === 'APPROVED') {
    updateFields.rejectionReason = '';
  }

  const doctor = await Doctor.findByIdAndUpdate(id, updateFields, {
    new: true,
  }).populate('user');

  if (!doctor) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

/**
 * Activate or Deactivate any User (Doctor or Patient)
 */
const toggleUserActive = async (userId, activeData) => {
  const { isActive } = activeData;

  if (typeof isActive !== 'boolean') {
    const error = new Error('Field "isActive" must be a boolean');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true }
  ).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * List all patients with search and populated medical profile
 */
const getAllPatients = async (query = {}) => {
  const { search, isActive } = query;

  let patients = await Patient.find()
    .populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive createdAt',
    })
    .sort({ createdAt: -1 });

  if (isActive !== undefined && isActive !== '') {
    const activeBool = String(isActive) === 'true';
    patients = patients.filter((p) => p.user?.isActive === activeBool);
  }

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    patients = patients.filter((p) => {
      const name = p.user?.name?.toLowerCase() || '';
      const email = p.user?.email?.toLowerCase() || '';
      const phone = p.user?.phone?.toLowerCase() || '';
      const blood = p.bloodGroup?.toLowerCase() || '';
      return (
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term) ||
        blood.includes(term)
      );
    });
  }

  return patients;
};

/**
 * Get detailed patient profile with appointment history
 */
const getPatientById = async (id) => {
  let patient = await Patient.findById(id).populate({
    path: 'user',
    select: 'name email phone profileImage avatar isActive createdAt updatedAt',
  });

  if (!patient) {
    patient = await Patient.findOne({ user: id }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive createdAt updatedAt',
    });
  }

  if (!patient) {
    const error = new Error('Patient not found');
    error.statusCode = 404;
    throw error;
  }

  const appointments = await Appointment.find({ patient: patient._id })
    .populate({
      path: 'doctor',
      select: 'specialization consultationFee hospitalAffiliation',
      populate: { path: 'user', select: 'name email phone' },
    })
    .sort({ date: -1, startTime: -1 });

  const patientObj = patient.toObject();
  patientObj.appointments = appointments;
  patientObj.totalAppointments = appointments.length;

  return patientObj;
};

/**
 * List all appointments platform-wide with search and filtering
 */
const getAllAppointments = async (query = {}) => {
  const { search, status, date, doctorId, patientId } = query;

  const filter = {};
  if (status && status !== 'All') {
    filter.status = status;
  }
  if (date) {
    filter.date = date;
  }
  if (doctorId) {
    filter.doctor = doctorId;
  }
  if (patientId) {
    filter.patient = patientId;
  }

  let appointments = await Appointment.find(filter)
    .populate({
      path: 'doctor',
      select: 'specialization consultationFee hospitalAffiliation',
      populate: { path: 'user', select: 'name email phone' },
    })
    .populate({
      path: 'patient',
      select: 'gender dateOfBirth bloodGroup allergies',
      populate: { path: 'user', select: 'name email phone' },
    })
    .sort({ date: -1, startTime: -1 });

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    appointments = appointments.filter((appt) => {
      const docName = appt.doctor?.user?.name?.toLowerCase() || '';
      const patName = appt.patient?.user?.name?.toLowerCase() || '';
      const reason = appt.reason?.toLowerCase() || '';
      const spec = appt.doctor?.specialization?.toLowerCase() || '';
      return (
        docName.includes(term) ||
        patName.includes(term) ||
        reason.includes(term) ||
        spec.includes(term)
      );
    });
  }

  return appointments;
};

/**
 * Cancel appointment by administrator
 */
const cancelAppointmentByAdmin = async (appointmentId, cancellationReason) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  appointment.status = 'CANCELLED';
  appointment.cancellationReason = cancellationReason
    ? cancellationReason.trim()
    : 'Cancelled by administrator';

  await appointment.save();

  return Appointment.findById(appointment._id)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone' },
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' },
    });
};

module.exports = {
  getPlatformStats,
  getAllDoctors,
  getDoctorById,
  updateDoctorApproval,
  toggleUserActive,
  getAllPatients,
  getPatientById,
  getAllAppointments,
  cancelAppointmentByAdmin,
};
