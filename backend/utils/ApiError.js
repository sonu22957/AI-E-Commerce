// backend/utils/ApiError.js

/**
 * Custom error class for API errors.
 *
 * Usage example in a controller or middleware:
 *   if (!resource) throw new ApiError(404, 'Resource not found');
 *
 * The error handling middleware can inspect `err.statusCode` to set the HTTP
 * response status. If `statusCode` is not provided it defaults to 500.
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (e.g., 404, 400, 500)
   * @param {string} message - Human‑readable error message
   * @param {boolean} [isOperational=true] - Flag indicating a trusted error
   */
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode || 500;
    this.isOperational = isOperational;
    // Capture stack trace excluding this constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
