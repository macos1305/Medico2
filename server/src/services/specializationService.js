const Specialization = require('../models/Specialization');

const getAllSpecializations = async () => {
  return Specialization.find({ isActive: true }).sort({ name: 1 });
};

module.exports = {
  getAllSpecializations,
};
