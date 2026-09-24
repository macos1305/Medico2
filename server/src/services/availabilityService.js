const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// Helper to convert "HH:mm" to total minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper to convert minutes since midnight to "HH:mm"
const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

/**
 * Retrieve doctor availability configuration (or default if unconfigured)
 */
const getDoctorAvailability = async (doctorId) => {
  let availability = await Availability.findOne({ doctor: doctorId });
  if (!availability) {
    // Ensure default availability exists
    availability = await Availability.create({
      doctor: doctorId,
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      breakStartTime: '13:00',
      breakEndTime: '14:00',
      isActive: true,
    });
  }
  return availability;
};

/**
 * Update or set doctor availability
 */
const updateDoctorAvailability = async (doctorId, data) => {
  const {
    workingDays,
    startTime,
    endTime,
    slotDuration,
    breakStartTime,
    breakEndTime,
    blockedDates,
    isActive,
  } = data;

  const currentAvailability = await getDoctorAvailability(doctorId);

  const effectiveStartTime = startTime || currentAvailability.startTime;
  const effectiveEndTime = endTime || currentAvailability.endTime;

  if (timeToMinutes(effectiveStartTime) >= timeToMinutes(effectiveEndTime)) {
    const error = new Error('Start time must be before end time');
    error.statusCode = 400;
    throw error;
  }

  const effectiveBreakStart = breakStartTime !== undefined ? breakStartTime : currentAvailability.breakStartTime;
  const effectiveBreakEnd = breakEndTime !== undefined ? breakEndTime : currentAvailability.breakEndTime;

  if (effectiveBreakStart && effectiveBreakEnd) {
    if (timeToMinutes(effectiveBreakStart) >= timeToMinutes(effectiveBreakEnd)) {
      const error = new Error('Break start time must be before break end time');
      error.statusCode = 400;
      throw error;
    }
    if (
      timeToMinutes(effectiveBreakStart) < timeToMinutes(effectiveStartTime) ||
      timeToMinutes(effectiveBreakEnd) > timeToMinutes(effectiveEndTime)
    ) {
      const error = new Error('Break hours must be within working hours');
      error.statusCode = 400;
      throw error;
    }
  }

  const updateFields = {};
  if (workingDays !== undefined) updateFields.workingDays = workingDays;
  if (startTime !== undefined) updateFields.startTime = startTime;
  if (endTime !== undefined) updateFields.endTime = endTime;
  if (slotDuration !== undefined) {
    const durationNum = Number(slotDuration);
    if (isNaN(durationNum) || durationNum < 10 || durationNum > 120) {
      const error = new Error('Slot duration must be between 10 and 120 minutes');
      error.statusCode = 400;
      throw error;
    }
    updateFields.slotDuration = durationNum;
  }
  if (breakStartTime !== undefined) updateFields.breakStartTime = breakStartTime;
  if (breakEndTime !== undefined) updateFields.breakEndTime = breakEndTime;
  if (blockedDates !== undefined) updateFields.blockedDates = blockedDates;
  if (isActive !== undefined) updateFields.isActive = isActive;

  const availability = await Availability.findOneAndUpdate(
    { doctor: doctorId },
    updateFields,
    { new: true, upsert: true, runValidators: true }
  );

  return availability;
};

/**
 * Reset doctor availability to default schedule
 */
const resetDoctorAvailability = async (doctorId) => {
  const defaultSchedule = {
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    breakStartTime: '13:00',
    breakEndTime: '14:00',
    blockedDates: [],
    isActive: true,
  };

  const availability = await Availability.findOneAndUpdate(
    { doctor: doctorId },
    defaultSchedule,
    { new: true, upsert: true, runValidators: true }
  );

  return availability;
};

/**
 * Block a specific date for a doctor
 */
const blockDoctorDate = async (doctorId, dateString) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const error = new Error('Invalid date format. Expected YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  const availability = await Availability.findOneAndUpdate(
    { doctor: doctorId },
    { $addToSet: { blockedDates: dateString } },
    { new: true, upsert: true }
  );

  return availability;
};

/**
 * Unblock a specific date for a doctor
 */
const unblockDoctorDate = async (doctorId, dateString) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const error = new Error('Invalid date format. Expected YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  const availability = await Availability.findOneAndUpdate(
    { doctor: doctorId },
    { $pull: { blockedDates: dateString } },
    { new: true, upsert: true }
  );

  return availability;
};

/**
 * Generate slots and calculate booked/available status for a specific date
 */
const getAvailableSlotsForDate = async (doctorId, dateString) => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const error = new Error('Invalid date format. Expected YYYY-MM-DD');
    error.statusCode = 400;
    throw error;
  }

  // Parse date and day of week
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const dayOfWeek = dayNames[targetDate.getDay()];

  // Verify doctor approval and active state
  const doctor = await Doctor.findById(doctorId).populate('user');
  if (doctor) {
    if (doctor.approvalStatus !== 'APPROVED') {
      return {
        date: dateString,
        dayOfWeek,
        isWorkingDay: false,
        message: 'Doctor is awaiting administrative credential verification',
        slots: [],
      };
    }
    if (doctor.user && !doctor.user.isActive) {
      return {
        date: dateString,
        dayOfWeek,
        isWorkingDay: false,
        message: 'Doctor account is currently deactivated',
        slots: [],
      };
    }
  }

  // Fetch Doctor Availability
  const availability = await getDoctorAvailability(doctorId);

  // Check if date is explicitly blocked by doctor
  if (availability.blockedDates && availability.blockedDates.includes(dateString)) {
    return {
      date: dateString,
      dayOfWeek,
      isWorkingDay: false,
      message: 'Doctor has blocked consultations on this date',
      slots: [],
    };
  }

  // Check if doctor works on this day
  const isWorkingDay = availability.workingDays.includes(dayOfWeek);
  if (!isWorkingDay || !availability.isActive) {
    return {
      date: dateString,
      dayOfWeek,
      isWorkingDay: false,
      message: `Doctor does not schedule consultations on ${dayOfWeek}s`,
      slots: [],
    };
  }

  // Generate slot intervals
  const startMin = timeToMinutes(availability.startTime);
  const endMin = timeToMinutes(availability.endTime);
  const duration = availability.slotDuration || 30;
  const breakStartMin = availability.breakStartTime
    ? timeToMinutes(availability.breakStartTime)
    : null;
  const breakEndMin = availability.breakEndTime
    ? timeToMinutes(availability.breakEndTime)
    : null;

  const generatedSlots = [];
  for (let current = startMin; current + duration <= endMin; current += duration) {
    const slotEnd = current + duration;

    // Check if slot overlaps with break time
    if (
      breakStartMin !== null &&
      breakEndMin !== null &&
      current < breakEndMin &&
      slotEnd > breakStartMin
    ) {
      continue; // Skip break time slot
    }

    generatedSlots.push({
      startTime: minutesToTime(current),
      endTime: minutesToTime(slotEnd),
    });
  }

  // Fetch existing non-cancelled appointments for this doctor on this date
  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    date: dateString,
    status: { $nin: ['CANCELLED'] },
  }).select('startTime endTime status');

  const bookedMap = new Set(bookedAppointments.map((a) => a.startTime));

  // Determine current local time if date is today
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = dateString === todayStr;
  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  const slots = generatedSlots.map((slot) => {
    const slotStartMin = timeToMinutes(slot.startTime);
    const isBooked = bookedMap.has(slot.startTime);
    const isPast = isToday && slotStartMin <= currentMinutes;

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked,
      isPast,
      isAvailable: !isBooked && !isPast,
    };
  });

  return {
    date: dateString,
    dayOfWeek,
    isWorkingDay: true,
    totalSlots: slots.length,
    availableCount: slots.filter((s) => s.isAvailable).length,
    slots,
  };
};

module.exports = {
  getDoctorAvailability,
  updateDoctorAvailability,
  resetDoctorAvailability,
  blockDoctorDate,
  unblockDoctorDate,
  getAvailableSlotsForDate,
  timeToMinutes,
  minutesToTime,
};
