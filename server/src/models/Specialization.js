const mongoose = require('mongoose');

const specializationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Specialization name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Stethoscope',
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

module.exports = mongoose.model('Specialization', specializationSchema);
