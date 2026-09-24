const User = require('../models/User');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const { signToken } = require('../utils/jwt');

/**
 * Service to register a new Patient
 */
const registerPatient = async (data) => {
  const {
    name,
    email,
    password,
    phone,
    gender,
    bloodGroup,
    dateOfBirth,
    address,
    emergencyContact,
  } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 400;
    throw error;
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role: 'PATIENT',
    phone,
  });

  // Create Patient Profile
  const patient = await Patient.create({
    user: user._id,
    gender: gender || 'PREFER_NOT_TO_SAY',
    bloodGroup: bloodGroup || 'UNKNOWN',
    dateOfBirth: dateOfBirth || null,
    address: address || {},
    emergencyContact: emergencyContact || {},
  });

  // Generate JWT Token
  const token = signToken({ id: user._id, role: user.role });

  return {
    user,
    profile: patient,
    token,
  };
};

/**
 * Service to register a new Doctor
 */
const registerDoctor = async (data) => {
  const {
    name,
    email,
    password,
    phone,
    specialization,
    licenseNumber,
    qualifications,
    experienceYears,
    consultationFee,
    bio,
    hospitalAffiliation,
  } = data;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 400;
    throw error;
  }

  // Check if license number already exists
  const existingLicense = await Doctor.findOne({ licenseNumber });
  if (existingLicense) {
    const error = new Error('A doctor with this medical license number already exists');
    error.statusCode = 400;
    throw error;
  }

  // Create User
  const user = await User.create({
    name,
    email,
    password,
    role: 'DOCTOR',
    phone,
  });

  // Create Doctor Profile (Defaults to PENDING approval)
  const doctor = await Doctor.create({
    user: user._id,
    specialization,
    licenseNumber,
    qualifications: qualifications || [],
    experienceYears: experienceYears || 0,
    consultationFee: consultationFee || 50,
    bio: bio || '',
    hospitalAffiliation: hospitalAffiliation || '',
    approvalStatus: 'PENDING',
  });

  // Generate JWT Token
  const token = signToken({ id: user._id, role: user.role });

  return {
    user,
    profile: doctor,
    token,
  };
};

/**
 * Unified Register Service (supports PATIENT & DOCTOR; blocks ADMIN)
 */
const register = async (data) => {
  const role = (data.role || 'PATIENT').toUpperCase();
  if (role === 'ADMIN') {
    const error = new Error('Admin registration is not permitted via public registration');
    error.statusCode = 403;
    throw error;
  }
  if (role === 'DOCTOR') {
    return registerDoctor(data);
  }
  return registerPatient(data);
};

/**
 * Service to authenticate user login
 */
const login = async ({ email, password }) => {
  // Find user by email with password included
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Check if user is active
  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Fetch role-specific profile
  let profile = null;
  if (user.role === 'PATIENT') {
    profile = await Patient.findOne({ user: user._id });
  } else if (user.role === 'DOCTOR') {
    profile = await Doctor.findOne({ user: user._id });
  }

  // Generate JWT Token
  const token = signToken({ id: user._id, role: user.role });

  return {
    user,
    profile,
    token,
  };
};

/**
 * Service to get current authenticated user data
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  let profile = null;
  if (user.role === 'PATIENT') {
    profile = await Patient.findOne({ user: user._id });
  } else if (user.role === 'DOCTOR') {
    profile = await Doctor.findOne({ user: user._id });
  }

  return {
    user,
    profile,
  };
};

module.exports = {
  register,
  registerPatient,
  registerDoctor,
  login,
  getCurrentUser,
};
