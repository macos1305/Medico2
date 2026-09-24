const specializationService = require('../services/specializationService');
const { sendSuccess } = require('../utils/apiResponse');

const getSpecializations = async (req, res, next) => {
  try {
    const list = await specializationService.getAllSpecializations();
    return sendSuccess(res, 200, 'Specializations retrieved successfully', list);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpecializations,
};
