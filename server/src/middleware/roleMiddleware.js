const { sendError } = require('../utils/apiResponse');

/**
 * Restrict access to specified roles
 * @param  {...string} roles Allowed roles ('PATIENT', 'DOCTOR', 'ADMIN')
 * Example: authorizeRoles("PATIENT"), authorizeRoles("DOCTOR"), authorizeRoles("ADMIN")
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Access denied. Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
};

module.exports = {
  authorizeRoles,
  authorize: authorizeRoles,
};
