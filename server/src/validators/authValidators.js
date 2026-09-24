const { body } = require('express-validator');

const validatePatientRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone number must be between 7 and 15 digits'),
  body('gender')
    .optional({ checkFalsy: true })
    .isIn(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'])
    .withMessage('Gender must be MALE, FEMALE, OTHER, or PREFER_NOT_TO_SAY'),
  body('bloodGroup')
    .optional({ checkFalsy: true })
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'])
    .withMessage('Invalid blood group provided'),
  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Date of birth must be a valid ISO8601 date'),
];

const validateDoctorRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('specialization')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required'),
  body('licenseNumber')
    .trim()
    .notEmpty()
    .withMessage('Medical license number is required'),
  body('experienceYears')
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Experience years must be a positive integer'),
  body('consultationFee')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a non-negative number'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 7, max: 15 })
    .withMessage('Phone number must be between 7 and 15 digits'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .custom((value) => {
      const upper = String(value).toUpperCase();
      if (upper === 'ADMIN') {
        throw new Error('Admin registration is not allowed through the public registration API');
      }
      if (!['PATIENT', 'DOCTOR'].includes(upper)) {
        throw new Error('Role must be either PATIENT or DOCTOR');
      }
      return true;
    }),
  body('specialization')
    .if((value, { req }) => String(req.body.role).toUpperCase() === 'DOCTOR')
    .trim()
    .notEmpty()
    .withMessage('Specialization is required for doctor registration'),
  body('licenseNumber')
    .if((value, { req }) => String(req.body.role).toUpperCase() === 'DOCTOR')
    .trim()
    .notEmpty()
    .withMessage('Medical license number is required for doctor registration'),
];

module.exports = {
  validateRegister,
  validatePatientRegister,
  validateDoctorRegister,
  validateLogin,
};
