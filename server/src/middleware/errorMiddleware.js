const { sendError } = require('../utils/apiResponse');

// 404 Route Not Found Handler
const notFound = (req, res, next) => {
  sendError(res, 404, `Endpoint not found - ${req.method} ${req.originalUrl}`);
};

// Centralized Error Handler
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'An unexpected server error occurred';
  let details = {};

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
    details = { field, value: err.keyValue[field] };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} - ${message}:`, err);
  }

  return sendError(res, statusCode, message, {
    ...details,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
