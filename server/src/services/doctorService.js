const Doctor = require('../models/Doctor');
const User = require('../models/User');

/**
 * Query doctors with search, filters, and sorting
 */
const getAllDoctors = async (query = {}) => {
  const {
    search,
    specialization,
    minExperience,
    experience,
    maxFee,
    fee,
    sort,
    approvalStatus,
  } = query;

  // Build filter object
  const filter = {};

  // Status filter (in development, allow showing all or specific status)
  if (approvalStatus) {
    filter.approvalStatus = approvalStatus;
  }

  // Specialization filter
  if (specialization && specialization !== 'All') {
    filter.specialization = new RegExp(`^${specialization.trim()}$`, 'i');
  }

  // Experience filter
  const expValue = Number(experience || minExperience);
  if (!isNaN(expValue) && expValue > 0) {
    filter.experienceYears = { $gte: expValue };
  }

  // Fee filter
  const feeValue = Number(fee || maxFee);
  if (!isNaN(feeValue) && feeValue > 0) {
    filter.consultationFee = { $lte: feeValue };
  }

  // Build query
  let mongoQuery = Doctor.find(filter).populate({
    path: 'user',
    select: 'name email phone profileImage avatar isActive',
  });

  // Sorting
  if (sort === 'fee_asc') {
    mongoQuery = mongoQuery.sort({ consultationFee: 1 });
  } else if (sort === 'fee_desc') {
    mongoQuery = mongoQuery.sort({ consultationFee: -1 });
  } else if (sort === 'experience_desc') {
    mongoQuery = mongoQuery.sort({ experienceYears: -1 });
  } else {
    mongoQuery = mongoQuery.sort({ createdAt: -1 });
  }

  let doctors = await mongoQuery;

  // Search keyword filter across populated user name or bio/hospital
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    doctors = doctors.filter((doc) => {
      const nameMatch = doc.user?.name?.toLowerCase().includes(term);
      const specMatch = doc.specialization?.toLowerCase().includes(term);
      const hospitalMatch = doc.hospitalAffiliation?.toLowerCase().includes(term);
      const bioMatch = doc.bio?.toLowerCase().includes(term);
      return nameMatch || specMatch || hospitalMatch || bioMatch;
    });
  }

  return doctors;
};

/**
 * Get doctor by ID with populated details
 */
const getDoctorById = async (id) => {
  let doctor = null;

  // Find by Doctor _id
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    doctor = await Doctor.findById(id).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive',
    });
  }

  // If not found, try finding by linked user _id
  if (!doctor && id.match(/^[0-9a-fA-F]{24}$/)) {
    doctor = await Doctor.findOne({ user: id }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive',
    });
  }

  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  // Ensure availability overview is present
  const docObj = doctor.toObject();
  docObj.availability = docObj.availability || {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    hours: '09:00 AM - 05:00 PM',
    slotDurationMinutes: 30,
  };

  return docObj;
};

/**
 * Get doctor profile by user ID
 */
const getDoctorProfileByUserId = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId }).populate({
    path: 'user',
    select: 'name email phone profileImage avatar role isActive',
  });

  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

/**
 * Update doctor profile (both User and Doctor fields)
 */
const updateDoctorProfile = async (userId, data) => {
  const {
    name,
    phone,
    profileImage,
    specialization,
    qualifications,
    experienceYears,
    consultationFee,
    hospitalAffiliation,
    location,
    bio,
  } = data;

  // 1. Update User fields if provided
  const userUpdates = {};
  if (name !== undefined) userUpdates.name = name.trim();
  if (phone !== undefined) userUpdates.phone = phone.trim();
  if (profileImage !== undefined) {
    userUpdates.profileImage = profileImage;
    userUpdates.avatar = profileImage;
  }

  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(userId, userUpdates, {
      new: true,
      runValidators: true,
    });
  }

  // 2. Update Doctor fields
  const doctorUpdates = {};
  if (specialization !== undefined) doctorUpdates.specialization = specialization.trim();
  if (qualifications !== undefined) {
    doctorUpdates.qualifications = Array.isArray(qualifications)
      ? qualifications
      : String(qualifications)
          .split(',')
          .map((q) => q.trim())
          .filter(Boolean);
  }
  if (experienceYears !== undefined) doctorUpdates.experienceYears = Number(experienceYears);
  if (consultationFee !== undefined) doctorUpdates.consultationFee = Number(consultationFee);
  if (hospitalAffiliation !== undefined) doctorUpdates.hospitalAffiliation = hospitalAffiliation.trim();
  if (location !== undefined) doctorUpdates.location = location.trim();
  if (bio !== undefined) doctorUpdates.bio = bio.trim();

  const doctor = await Doctor.findOneAndUpdate(
    { user: userId },
    doctorUpdates,
    { new: true, runValidators: true }
  ).populate({
    path: 'user',
    select: 'name email phone profileImage avatar role isActive',
  });

  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorProfileByUserId,
  updateDoctorProfile,
};
