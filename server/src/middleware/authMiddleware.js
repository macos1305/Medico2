const { verifyToken } = require('../utils/jwt');
const { sendError } = require('../utils/apiResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Authentication token is required to access this resource');
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendError(res, 401, 'User associated with this token no longer exists');
    }

    if (!user.isActive) {
      return sendError(res, 403, 'Your account has been deactivated. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token');
  }
};

module.exports = {
  protect,
  authMiddleware: protect,
};
