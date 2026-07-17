// backend/middleware/auth.js

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

/**
 * Protect middleware – verifies JWT token, loads user, and attaches to req.user.
 * Expects the token in the Authorization header as "Bearer <token>".
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, 'Not authorized, token missing'));
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, 'Not authorized, user not found'));
    }
    req.user = user; // attach user to request
    next();
  } catch (err) {
    logger.error('Auth middleware error', err);
    return res
      .status(401)
      .json(new ApiResponse(401, 'Not authorized, token invalid'));
  }
});

/**
 * Admin middleware – must be used after protect.
 * Ensures the authenticated user has the 'admin' role.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res
    .status(403)
    .json(new ApiResponse(403, 'Not authorized as admin'));
};

module.exports = { protect, admin };
