// backend/middleware/admin.js

const logger = require('../utils/logger');

/**
 * Admin middleware – ensures the authenticated user has role "admin".
 * Assumes previous authentication middleware (e.g., protect) has attached
 * the user object to req.user.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  logger.warn('Forbidden: Admin privileges required', { userId: req.user?.id });
  return res.status(403).json({
    success: false,
    message: 'Admin access required',
  });
};

module.exports = admin;
