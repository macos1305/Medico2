const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
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
    date: {
      type: String, // Stored as ISO date string 'YYYY-MM-DD'
      required: [true, 'Appointment date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
      index: true,
    },
    startTime: {
      type: String, // 'HH:mm'
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be formatted as HH:mm'],
    },
    endTime: {
      type: String, // 'HH:mm'
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be formatted as HH:mm'],
    },
    reason: {
      type: String,
      required: [true, 'Reason for appointment is required'],
      trim: true,
      maxlength: [500, 'Reason cannot exceed 500 characters'],
    },
    symptoms: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Symptoms cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
        message: '{VALUE} is not a valid appointment status',
      },
      default: 'CONFIRMED',
      index: true,
    },
    rescheduledFrom: {
      previousDate: { type: String, default: null },
      previousStartTime: { type: String, default: null },
      previousEndTime: { type: String, default: null },
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help enforce conflict checking and speed up queries
appointmentSchema.index({ doctor: 1, date: 1, startTime: 1, status: 1 });
appointmentSchema.index({ patient: 1, date: 1, status: 1 });

appointmentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
