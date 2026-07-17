// backend/utils/asyncHandler.js

/**
 * Wrapper to handle async/await errors in Express route handlers.
 *
 * Example usage in a controller:
 *   const asyncHandler = require('../utils/asyncHandler');
 *   const getAll = asyncHandler(async (req, res) => { ... });
 *
 * The returned function forwards any rejected promise to Express's error
 * handling middleware via `next(err)`.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
