const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: [true, 'Patient reference is required'],
      index: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
      index: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment reference is required'],
      // Unique: prevents duplicate reviews for the same appointment
      unique: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    isVisible: {
      type: Boolean,
      default: true, // Admin can hide/remove inappropriate reviews
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for quick doctor review lookups
reviewSchema.index({ doctor: 1, isVisible: 1, createdAt: -1 });
reviewSchema.index({ patient: 1, createdAt: -1 });

// ─── Static: recompute and persist doctor rating aggregation ──────────────────
reviewSchema.statics.updateDoctorRating = async function (doctorId) {
  const Doctor = mongoose.model('Doctor');

  const result = await this.aggregate([
    {
      $match: {
        doctor: new mongoose.Types.ObjectId(doctorId),
        isVisible: true,
      },
    },
    {
      $group: {
        _id: '$doctor',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Doctor.findByIdAndUpdate(doctorId, {
      'rating.average': Math.round(result[0].averageRating * 10) / 10,
      'rating.count': result[0].totalReviews,
    });
  } else {
    // No visible reviews — reset to zero
    await Doctor.findByIdAndUpdate(doctorId, {
      'rating.average': 0,
      'rating.count': 0,
    });
  }
};

// Auto-update doctor rating after save or delete
reviewSchema.post('save', async function () {
  await this.constructor.updateDoctorRating(this.doctor);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.updateDoctorRating(doc.doctor);
  }
});

reviewSchema.post('findOneAndUpdate', async function (doc) {
  if (doc) {
    await doc.constructor.updateDoctorRating(doc.doctor);
  }
});

reviewSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Review', reviewSchema);
