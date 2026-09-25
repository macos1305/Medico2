const Doctor = require('../models/Doctor');
const User = require('../models/User');

/**
 * Query doctors with search, filters, and sorting
 * Publicly returns ONLY approved and active doctors
 */
const getAllDoctors = async (query = {}) => {
  const {
    search,
    specialization,
    minExperience,
    maxExperience,
    experience,
    minFee,
    maxFee,
    fee,
    location,
    sort,
    sortBy,
    approvalStatus,
    gender,
    minRating,
  } = query;

  // Build filter object
  const filter = {};

  // Status filter (default to APPROVED for public queries)
  filter.approvalStatus = approvalStatus || 'APPROVED';
  filter.isActive = { $ne: false };

  // Specialization filter
  if (specialization && specialization !== 'All' && specialization.trim()) {
    filter.specialization = new RegExp(`^${specialization.trim()}$`, 'i');
  }

  // Location filter
  if (location && location.trim()) {
    filter.location = new RegExp(location.trim(), 'i');
  }

  // Experience filter (supports minExperience, maxExperience, or experience alias)
  const minExp = Number(minExperience || experience);
  const maxExp = Number(maxExperience);
  if (!isNaN(minExp) || !isNaN(maxExp)) {
    filter.experienceYears = {};
    if (!isNaN(minExp) && minExp > 0) filter.experienceYears.$gte = minExp;
    if (!isNaN(maxExp) && maxExp > 0) filter.experienceYears.$lte = maxExp;
    if (Object.keys(filter.experienceYears).length === 0) {
      delete filter.experienceYears;
    }
  }

  // Fee filter (supports minFee, maxFee, or fee alias)
  const minF = Number(minFee);
  const maxF = Number(maxFee || fee);
  if (!isNaN(minF) || !isNaN(maxF)) {
    filter.consultationFee = {};
    if (!isNaN(minF) && minF > 0) filter.consultationFee.$gte = minF;
    if (!isNaN(maxF) && maxF > 0) filter.consultationFee.$lte = maxF;
    if (Object.keys(filter.consultationFee).length === 0) {
      delete filter.consultationFee;
    }
  }

  // Gender filter
  if (gender && gender !== 'All' && gender.trim()) {
    filter.gender = gender.trim();
  }

  // Rating filter
  const ratingValue = Number(minRating);
  if (!isNaN(ratingValue) && ratingValue > 0) {
    filter['rating.average'] = { $gte: ratingValue };
  }

  // Build query
  let mongoQuery = Doctor.find(filter).populate({
    path: 'user',
    select: 'name email phone profileImage avatar isActive role',
  });

  // Sorting - support both 'sort' and 'sortBy' params
  const sortParam = sortBy || sort;
  if (sortParam === 'fee_asc' || sortParam === 'fee-asc' || sortParam === 'fee_low') {
    mongoQuery = mongoQuery.sort({ consultationFee: 1 });
  } else if (sortParam === 'fee_desc' || sortParam === 'fee-desc' || sortParam === 'fee_high') {
    mongoQuery = mongoQuery.sort({ consultationFee: -1 });
  } else if (sortParam === 'experience_desc' || sortParam === 'experience-desc' || sortParam === 'experience') {
    mongoQuery = mongoQuery.sort({ experienceYears: -1 });
  } else if (sortParam === 'rating' || sortParam === 'rating_desc' || sortParam === 'rating-desc') {
    mongoQuery = mongoQuery.sort({ 'rating.average': -1, 'rating.count': -1 });
  } else if (sortParam === 'newest') {
    mongoQuery = mongoQuery.sort({ createdAt: -1 });
  } else {
    mongoQuery = mongoQuery.sort({ 'rating.average': -1, 'rating.count': -1, createdAt: -1 });
  }

  let doctors = await mongoQuery;

  // Filter out any entries where linked user is inactive or missing
  doctors = doctors.filter((doc) => doc.user && doc.user.isActive !== false && doc.isActive !== false);

  // Search keyword filter across user name, specialization, hospital, bio, or location
  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    doctors = doctors.filter((doc) => {
      const nameMatch = doc.user?.name?.toLowerCase().includes(term);
      const specMatch = doc.specialization?.toLowerCase().includes(term);
      const hospitalMatch = doc.hospitalAffiliation?.toLowerCase().includes(term);
      const bioMatch = doc.bio?.toLowerCase().includes(term);
      const locationMatch = doc.location?.toLowerCase().includes(term);
      return nameMatch || specMatch || hospitalMatch || bioMatch || locationMatch;
    });
  }

  return doctors;
};

/**
 * Get featured doctors (top-rated, approved, active)
 */
const getFeaturedDoctors = async (limit = 6) => {
  const doctors = await Doctor.find({
    approvalStatus: 'APPROVED',
    isActive: { $ne: false },
    'rating.average': { $gt: 0 },
  })
    .populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive role',
    })
    .sort({ 'rating.average': -1, 'rating.count': -1 })
    .limit(limit);

  return doctors.filter((doc) => doc.user && doc.user.isActive !== false && doc.isActive !== false);
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
      select: 'name email phone profileImage avatar isActive role',
    });
  }

  // If not found, try finding by linked user _id
  if (!doctor && id.match(/^[0-9a-fA-F]{24}$/)) {
    doctor = await Doctor.findOne({ user: id }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive role',
    });
  }

  if (!doctor) {
    const error = new Error('Doctor profile not found');
    error.statusCode = 404;
    throw error;
  }

  const docObj = doctor.toObject ? doctor.toObject() : doctor;
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
    gender,
    languages,
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
  if (gender !== undefined) doctorUpdates.gender = gender;
  if (languages !== undefined) {
    doctorUpdates.languages = Array.isArray(languages)
      ? languages
      : String(languages).split(',').map((l) => l.trim()).filter(Boolean);
  }

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
  getFeaturedDoctors,
  getDoctorById,
  getDoctorProfileByUserId,
  updateDoctorProfile,
};
