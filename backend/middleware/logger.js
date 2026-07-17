// backend/middleware/logger.js

const logger = require('../utils/logger');

/**
 * Request logger middleware – logs each incoming HTTP request with method,
 * URL, status code, response time, and client IP.
 */
function requestLogger(req, res, next) {
  const { method, originalUrl, ip } = req;
  const start = Date.now();

  // Listen for the response to finish to capture status and duration
  res.on('finish', () => {
    const { statusCode } = res;
    const duration = Date.now() - start;
    logger.info(`${method} ${originalUrl} ${statusCode} - ${duration}ms`, { ip });
  });

  next();
}

module.exports = requestLogger;
