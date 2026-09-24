const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor reference is required'],
      unique: true,
      index: true,
    },
    workingDays: {
      type: [String],
      enum: {
        values: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        message: '{VALUE} is not a valid working day',
      },
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      default: '09:00', // 24-hr format HH:mm
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      default: '17:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'],
    },
    slotDuration: {
      type: Number,
      required: [true, 'Slot duration is required'],
      default: 30, // in minutes
      min: [10, 'Slot duration must be at least 10 minutes'],
      max: [120, 'Slot duration cannot exceed 120 minutes'],
    },
    breakStartTime: {
      type: String,
      default: '13:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'],
    },
    breakEndTime: {
      type: String,
      default: '14:00',
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide time in HH:mm format'],
    },
    blockedDates: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Availability', availabilitySchema);
