// backend/middleware/error.js

/**
 * Centralized error handling middleware.
 * It captures any error passed via next(err) or thrown in async handlers,
 * logs the error, and returns a consistent JSON response using ApiResponse.
 */
const logger = require('../utils/logger');
const ApiResponse = require('../utils/ApiResponse');

function errorHandler(err, req, res, next) {
  // If headers already sent, delegate to default Express handler
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Server Error';

  logger.error('Error middleware caught', {
    message,
    statusCode,
    stack: err.stack,
    path: req.originalUrl,
  });

  res.status(statusCode).json(new ApiResponse(statusCode, message));
}

module.exports = errorHandler;
