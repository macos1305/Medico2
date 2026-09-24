const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const availabilityService = require('./availabilityService');
const { createNotification } = require('./notificationService');

// Helper to get today's date formatted as YYYY-MM-DD
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Create a new appointment
 */
const createAppointment = async (userId, data) => {
  const doctorId = data.doctorId || data.doctor;
  const { date, startTime, reason, symptoms } = data;

  // 1. Verify Patient
  let patient = await Patient.findOne({ user: userId });
  if (!patient) {
    // Auto-create patient profile if user is a registered patient without profile
    patient = await Patient.create({ user: userId });
  }

  // 2. Verify Doctor
  const doctor = await Doctor.findById(doctorId).populate('user');
  if (!doctor) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  if (doctor.approvalStatus !== 'APPROVED') {
    const error = new Error('Cannot schedule consultation: Doctor is pending administrative credential verification');
    error.statusCode = 400;
    throw error;
  }

  if (doctor.user && !doctor.user.isActive) {
    const error = new Error('Cannot schedule consultation: Doctor account is currently inactive');
    error.statusCode = 400;
    throw error;
  }

  // 3. Verify Date
  const todayStr = getTodayString();
  if (!date || date < todayStr) {
    const error = new Error('Cannot schedule an appointment for a past date');
    error.statusCode = 400;
    throw error;
  }

  // 4. Verify slot belongs to doctor's availability
  const slotsData = await availabilityService.getAvailableSlotsForDate(doctorId, date);
  if (!slotsData.isWorkingDay) {
    const error = new Error(slotsData.message || 'Doctor is not available on this day');
    error.statusCode = 400;
    throw error;
  }

  const slot = slotsData.slots.find((s) => s.startTime === startTime);
  if (!slot) {
    const error = new Error(
      'Selected slot does not match doctor schedule or operating hours'
    );
    error.statusCode = 400;
    throw error;
  }

  if (slot.isPast) {
    const error = new Error('Cannot book a consultation slot in the past');
    error.statusCode = 400;
    throw error;
  }

  // 5. Verify slot is not already booked (prevent double booking)
  const existingBooking = await Appointment.findOne({
    doctor: doctorId,
    date,
    startTime,
    status: { $nin: ['CANCELLED'] },
  });

  if (existingBooking) {
    const error = new Error(
      'This consultation slot has already been booked. Please select another time slot.'
    );
    error.statusCode = 400;
    throw error;
  }

  // 6. Create appointment
  const appointment = await Appointment.create({
    patient: patient._id,
    doctor: doctorId,
    date,
    startTime,
    endTime: slot.endTime,
    reason: reason.trim(),
    symptoms: symptoms ? symptoms.trim() : '',
    status: 'CONFIRMED',
  });

  // Populate doctor and patient details
  const populated = await Appointment.findById(appointment._id)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone profileImage avatar' },
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' },
    });

  // Notify Patient: appointment booked
  if (populated.patient?.user?._id) {
    createNotification({
      recipient: populated.patient.user._id,
      type: 'APPOINTMENT_BOOKED',
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${populated.doctor?.user?.name || 'Doctor'} on ${date} at ${startTime} has been successfully booked.`,
      data: {
        appointmentId: populated._id,
        doctorId: populated.doctor?._id,
        link: '/patient/appointments',
      },
    });
  }

  // Notify Doctor: new appointment
  if (populated.doctor?.user?._id) {
    createNotification({
      recipient: populated.doctor.user._id,
      type: 'NEW_APPOINTMENT',
      title: 'New Appointment Scheduled',
      message: `New appointment scheduled by ${populated.patient?.user?.name || 'a patient'} for ${date} at ${startTime}.`,
      data: {
        appointmentId: populated._id,
        patientId: populated.patient?._id,
        link: '/doctor/appointments',
      },
    });
  }

  return populated;
};

/**
 * Fetch patient appointments by tab (upcoming, past, cancelled)
 */
const getPatientAppointments = async (userId, tab = 'all') => {
  const patient = await Patient.findOne({ user: userId });
  if (!patient) {
    return [];
  }

  const filter = { patient: patient._id };
  const todayStr = getTodayString();

  if (tab === 'upcoming') {
    filter.status = { $in: ['CONFIRMED', 'PENDING', 'RESCHEDULED'] };
    filter.date = { $gte: todayStr };
  } else if (tab === 'past') {
    // Completed or past date non-cancelled
    filter.$or = [
      { status: 'COMPLETED' },
      { date: { $lt: todayStr }, status: { $ne: 'CANCELLED' } },
    ];
  } else if (tab === 'cancelled') {
    filter.status = 'CANCELLED';
  }

  const appointments = await Appointment.find(filter)
    .populate({
      path: 'doctor',
      select: 'specialization licenseNumber consultationFee hospitalAffiliation bio',
      populate: { path: 'user', select: 'name email phone profileImage avatar' },
    })
    .sort(tab === 'upcoming' ? { date: 1, startTime: 1 } : { date: -1, startTime: -1 });

  return appointments;
};

/**
 * Fetch single appointment details with security ownership check
 */
const getAppointmentById = async (appointmentId, userId, userRole) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone profileImage avatar' },
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' },
    });

  if (!appointment) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  // Security check: verify caller is either the patient, the doctor, or an admin
  if (userRole === 'PATIENT') {
    if (!appointment.patient?.user?._id?.equals(userId)) {
      const error = new Error('Access denied. You cannot view another patient’s appointment.');
      error.statusCode = 403;
      throw error;
    }
  } else if (userRole === 'DOCTOR') {
    if (!appointment.doctor?.user?._id?.equals(userId)) {
      const error = new Error('Access denied. You cannot view another doctor’s appointment.');
      error.statusCode = 403;
      throw error;
    }
  }

  return appointment;
};

/**
 * Cancel an appointment
 */
const cancelAppointment = async (appointmentId, userId, cancellationReason) => {
  const patient = await Patient.findOne({ user: userId });
  if (!patient) {
    const error = new Error('Patient profile not found');
    error.statusCode = 404;
    throw error;
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patient: patient._id,
  });

  if (!appointment) {
    const error = new Error('Appointment not found or you are not authorized to cancel it');
    error.statusCode = 404;
    throw error;
  }

  if (appointment.status === 'CANCELLED') {
    const error = new Error('This appointment has already been cancelled');
    error.statusCode = 400;
    throw error;
  }

  appointment.status = 'CANCELLED';
  if (cancellationReason) {
    appointment.cancellationReason = cancellationReason.trim();
  }

  await appointment.save();

  // Return populated appointment
  const populated = await Appointment.findById(appointment._id)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone' },
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' },
    });

  // Notify Doctor: appointment cancelled
  if (populated?.doctor?.user?._id) {
    createNotification({
      recipient: populated.doctor.user._id,
      type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Patient ${populated.patient?.user?.name || 'A patient'} cancelled their appointment on ${populated.date} at ${populated.startTime}.${populated.cancellationReason ? ` Reason: ${populated.cancellationReason}` : ''}`,
      data: {
        appointmentId: populated._id,
        link: '/doctor/appointments',
      },
    });
  }

  // Notify Patient: appointment cancelled
  if (populated?.patient?.user?._id) {
    createNotification({
      recipient: populated.patient.user._id,
      type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${populated.doctor?.user?.name || 'Doctor'} on ${populated.date} at ${populated.startTime} has been cancelled.`,
      data: {
        appointmentId: populated._id,
        link: '/patient/appointments',
      },
    });
  }

  return populated;
};

/**
 * Reschedule an appointment
 */
const rescheduleAppointment = async (appointmentId, userId, rescheduleData) => {
  const { newDate, newStartTime, reason } = rescheduleData;

  const patient = await Patient.findOne({ user: userId });
  if (!patient) {
    const error = new Error('Patient profile not found');
    error.statusCode = 404;
    throw error;
  }

  const appointment = await Appointment.findOne({
    _id: appointmentId,
    patient: patient._id,
  });

  if (!appointment) {
    const error = new Error('Appointment not found or you are not authorized to reschedule it');
    error.statusCode = 404;
    throw error;
  }

  if (appointment.status === 'CANCELLED') {
    const error = new Error('Cannot reschedule a cancelled appointment');
    error.statusCode = 400;
    throw error;
  }

  const todayStr = getTodayString();
  if (!newDate || newDate < todayStr) {
    const error = new Error('Cannot reschedule to a past date');
    error.statusCode = 400;
    throw error;
  }

  // Verify availability on new date
  const slotsData = await availabilityService.getAvailableSlotsForDate(
    appointment.doctor,
    newDate
  );

  if (!slotsData.isWorkingDay) {
    const error = new Error('Doctor is not available on the selected reschedule date');
    error.statusCode = 400;
    throw error;
  }

  const slot = slotsData.slots.find((s) => s.startTime === newStartTime);
  if (!slot) {
    const error = new Error('Selected slot is not within doctor operating hours');
    error.statusCode = 400;
    throw error;
  }

  if (slot.isPast) {
    const error = new Error('Cannot reschedule to a past time slot');
    error.statusCode = 400;
    throw error;
  }

  // Prevent double booking on new slot (ignoring this appointment itself if same day/time)
  const conflict = await Appointment.findOne({
    _id: { $ne: appointment._id },
    doctor: appointment.doctor,
    date: newDate,
    startTime: newStartTime,
    status: { $nin: ['CANCELLED'] },
  });

  if (conflict) {
    const error = new Error('The selected reschedule slot has already been booked');
    error.statusCode = 400;
    throw error;
  }

  // Record previous slot info and update
  appointment.rescheduledFrom = {
    previousDate: appointment.date,
    previousStartTime: appointment.startTime,
    previousEndTime: appointment.endTime,
  };

  appointment.date = newDate;
  appointment.startTime = newStartTime;
  appointment.endTime = slot.endTime;
  appointment.status = 'RESCHEDULED';
  if (reason) {
    appointment.reason = reason.trim();
  }

  await appointment.save();

  const populated = await Appointment.findById(appointment._id)
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone' },
    })
    .populate({
      path: 'patient',
      populate: { path: 'user', select: 'name email phone' },
    });

  // Notify Patient: appointment rescheduled
  if (populated?.patient?.user?._id) {
    createNotification({
      recipient: populated.patient.user._id,
      type: 'APPOINTMENT_RESCHEDULED',
      title: 'Appointment Rescheduled',
      message: `Your appointment with Dr. ${populated.doctor?.user?.name || 'Doctor'} was rescheduled to ${newDate} at ${newStartTime}.`,
      data: {
        appointmentId: populated._id,
        link: '/patient/appointments',
      },
    });
  }

  // Notify Doctor: appointment rescheduled
  if (populated?.doctor?.user?._id) {
    createNotification({
      recipient: populated.doctor.user._id,
      type: 'APPOINTMENT_RESCHEDULED',
      title: 'Appointment Rescheduled',
      message: `Patient ${populated.patient?.user?.name || 'A patient'} rescheduled their appointment to ${newDate} at ${newStartTime}.`,
      data: {
        appointmentId: populated._id,
        link: '/doctor/appointments',
      },
    });
  }

  return populated;
};

/**
 * Fetch doctor appointments by tab (today, upcoming, completed, cancelled, all)
 */
const getDoctorAppointments = async (userId, filters = {}) => {
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  const query = { doctor: doctor._id };
  const todayStr = getTodayString();
  const tab = filters.tab || 'all';

  if (tab === 'today') {
    query.date = todayStr;
    query.status = { $ne: 'CANCELLED' };
  } else if (tab === 'upcoming') {
    query.date = { $gte: todayStr };
    query.status = { $in: ['CONFIRMED', 'PENDING', 'RESCHEDULED'] };
  } else if (tab === 'completed') {
    query.status = 'COMPLETED';
  } else if (tab === 'cancelled') {
    query.status = 'CANCELLED';
  }

  if (filters.date) {
    query.date = filters.date;
  }
  if (filters.status) {
    query.status = filters.status;
  }

  const appointments = await Appointment.find(query)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone profileImage avatar',
      },
      select: 'dateOfBirth gender bloodGroup allergies emergencyContact address',
    })
    .sort(tab === 'upcoming' || tab === 'today' ? { date: 1, startTime: 1 } : { date: -1, startTime: -1 });

  return appointments;
};

/**
 * Get statistical overview for doctor dashboard
 */
const getDoctorStats = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  const todayStr = getTodayString();

  const [todayCount, upcomingCount, completedCount, cancelledCount, uniquePatients] =
    await Promise.all([
      Appointment.countDocuments({
        doctor: doctor._id,
        date: todayStr,
        status: { $ne: 'CANCELLED' },
      }),
      Appointment.countDocuments({
        doctor: doctor._id,
        date: { $gte: todayStr },
        status: { $in: ['CONFIRMED', 'PENDING', 'RESCHEDULED'] },
      }),
      Appointment.countDocuments({
        doctor: doctor._id,
        status: 'COMPLETED',
      }),
      Appointment.countDocuments({
        doctor: doctor._id,
        status: 'CANCELLED',
      }),
      Appointment.distinct('patient', { doctor: doctor._id }),
    ]);

  return {
    today: todayCount,
    upcoming: upcomingCount,
    completed: completedCount,
    cancelled: cancelledCount,
    totalPatients: uniquePatients.length,
  };
};

/**
 * Update appointment status by doctor (CONFIRMED, COMPLETED, CANCELLED)
 */
const updateAppointmentStatusByDoctor = async (
  appointmentId,
  userId,
  statusData
) => {
  const { status, cancellationReason } = statusData;

  const validStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    const error = new Error(
      `Invalid status. Status must be one of: ${validStatuses.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    const error = new Error('Appointment not found');
    error.statusCode = 404;
    throw error;
  }

  // Security check: verify appointment belongs to this doctor
  if (!appointment.doctor.equals(doctor._id)) {
    const error = new Error(
      'Access denied. You can only manage appointments scheduled with your practice.'
    );
    error.statusCode = 403;
    throw error;
  }

  appointment.status = status;
  if (status === 'CANCELLED' && cancellationReason) {
    appointment.cancellationReason = cancellationReason.trim();
  }

  await appointment.save();

  const populated = await Appointment.findById(appointment._id)
    .populate({
      path: 'patient',
      populate: {
        path: 'user',
        select: 'name email phone profileImage avatar',
      },
      select: 'dateOfBirth gender bloodGroup allergies emergencyContact',
    })
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'name email phone' },
    });

  if (status === 'CONFIRMED' && populated?.patient?.user?._id) {
    createNotification({
      recipient: populated.patient.user._id,
      type: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: `Dr. ${populated.doctor?.user?.name || 'Doctor'} has confirmed your appointment on ${populated.date} at ${populated.startTime}.`,
      data: {
        appointmentId: populated._id,
        link: '/patient/appointments',
      },
    });
  } else if (status === 'CANCELLED') {
    if (populated?.patient?.user?._id) {
      createNotification({
        recipient: populated.patient.user._id,
        type: 'APPOINTMENT_CANCELLED',
        title: 'Appointment Cancelled by Doctor',
        message: `Dr. ${populated.doctor?.user?.name || 'Doctor'} cancelled your appointment scheduled for ${populated.date} at ${populated.startTime}.${populated.cancellationReason ? ` Reason: ${populated.cancellationReason}` : ''}`,
        data: {
          appointmentId: populated._id,
          link: '/patient/appointments',
        },
      });
    }
    if (populated?.doctor?.user?._id) {
      createNotification({
        recipient: populated.doctor.user._id,
        type: 'APPOINTMENT_CANCELLED',
        title: 'Appointment Cancelled',
        message: `Appointment with ${populated.patient?.user?.name || 'Patient'} on ${populated.date} at ${populated.startTime} was cancelled.`,
        data: {
          appointmentId: populated._id,
          link: '/doctor/appointments',
        },
      });
    }
  }

  return populated;
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  getDoctorStats,
  updateAppointmentStatusByDoctor,
};
