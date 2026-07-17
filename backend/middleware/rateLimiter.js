// backend/middleware/rateLimiter.js

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

/**
 * Rate limiting middleware.
 * Defaults to 100 requests per 15 minutes per IP.
 * Environment variables can override the defaults:
 *   RATE_LIMIT_WINDOW_MS – time window in ms (default 15*60*1000)
 *   RATE_LIMIT_MAX      – max requests per window (default 100)
 */
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { ip: req.ip });
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = limiter;
