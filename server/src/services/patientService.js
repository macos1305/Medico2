const User = require('../models/User');
const Patient = require('../models/Patient');

/**
 * Fetch patient profile and user details
 */
const getPatientProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  let profile = await Patient.findOne({ user: userId });
  if (!profile) {
    // Auto-create patient profile if missing
    profile = await Patient.create({ user: userId });
  }

  return {
    user,
    profile,
  };
};

/**
 * Update patient profile and user details
 */
const updatePatientProfile = async (userId, updateData) => {
  const {
    name,
    phone,
    profileImage,
    avatar,
    dateOfBirth,
    gender,
    address,
    bloodGroup,
    allergies,
    emergencyContact,
  } = updateData;

  // 1. Update User base fields
  const userUpdates = {};
  if (name !== undefined) userUpdates.name = name;
  if (phone !== undefined) userUpdates.phone = phone;
  if (profileImage !== undefined) {
    userUpdates.profileImage = profileImage;
    userUpdates.avatar = profileImage;
  } else if (avatar !== undefined) {
    userUpdates.profileImage = avatar;
    userUpdates.avatar = avatar;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, userUpdates, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // 2. Update Patient profile fields
  const patientUpdates = {};
  if (dateOfBirth !== undefined) patientUpdates.dateOfBirth = dateOfBirth;
  if (gender !== undefined) patientUpdates.gender = gender;
  if (bloodGroup !== undefined) patientUpdates.bloodGroup = bloodGroup;
  if (address !== undefined) patientUpdates.address = address;
  if (emergencyContact !== undefined) patientUpdates.emergencyContact = emergencyContact;
  if (allergies !== undefined) {
    patientUpdates.allergies = Array.isArray(allergies)
      ? allergies
      : typeof allergies === 'string'
      ? allergies.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
  }

  const updatedProfile = await Patient.findOneAndUpdate(
    { user: userId },
    patientUpdates,
    { new: true, upsert: true, runValidators: true }
  );

  return {
    user: updatedUser,
    profile: updatedProfile,
  };
};

module.exports = {
  getPatientProfile,
  updatePatientProfile,
};
