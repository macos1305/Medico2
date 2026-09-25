const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
      index: true,
    },
    specializationRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Specialization',
    },
    licenseNumber: {
      type: String,
      required: [true, 'Medical license number is required'],
      unique: true,
      trim: true,
    },
    qualifications: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience years cannot be negative'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      default: 50,
      min: [0, 'Fee cannot be negative'],
    },
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    hospitalAffiliation: {
      type: String,
      default: '',
      trim: true,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', ''],
      default: '',
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties for universal field compatibility
doctorSchema.virtual('name').get(function () {
  return this.user?.name;
});

doctorSchema.virtual('email').get(function () {
  return this.user?.email;
});

doctorSchema.virtual('role').get(function () {
  return this.user?.role || 'DOCTOR';
});

doctorSchema.virtual('profileImage').get(function () {
  return this.user?.profileImage || this.user?.avatar;
});

doctorSchema.virtual('qualification').get(function () {
  return Array.isArray(this.qualifications) && this.qualifications.length > 0
    ? this.qualifications.join(', ')
    : '';
});

doctorSchema.virtual('experience').get(function () {
  return this.experienceYears;
});

doctorSchema.virtual('hospital').get(function () {
  return this.hospitalAffiliation;
});

doctorSchema.virtual('about').get(function () {
  return this.bio;
});

doctorSchema.virtual('status').get(function () {
  return this.approvalStatus;
});

doctorSchema.virtual('totalReviews').get(function () {
  return this.rating?.count || 0;
});

doctorSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Doctor', doctorSchema);
