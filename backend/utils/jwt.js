// backend/utils/jwt.js

/**
 * JWT utility functions for token generation and verification.
 *
 * The JWT secret and optional expiration are read from environment variables:
 *   - JWT_SECRET: required, strong secret string.
 *   - JWT_EXPIRES_IN: optional, e.g. "1h", "30d". Defaults to "1h".
 *
 * Example usage in a controller:
 *   const { generateToken, verifyToken } = require('../utils/jwt');
 *   const token = generateToken({ id: user._id, role: user.role });
 *   const payload = verifyToken(token); // null if invalid/expired
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Ensure the secret is set – this will fail fast if mis‑configured.
if (!JWT_SECRET) {
  logger.error('JWT_SECRET is not defined in environment variables');
  throw new Error('FATAL: JWT_SECRET is missing');
}

/**
 * Generate a signed JWT for the given payload.
 * @param {object} payload - Data to embed in the token (e.g., { id, role }).
 * @param {string|number} [expiresIn] - Optional custom expiry, overrides env.
 * @returns {string} Signed JWT.
 */
function generateToken(payload, expiresIn) {
  const options = { expiresIn: expiresIn || JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verify a JWT and return the decoded payload.
 * @param {string} token - JWT string received from client.
 * @returns {object|null} Decoded payload if valid, otherwise null.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    logger.warn('JWT verification failed', { error: err.message });
    return null;
  }
}

module.exports = { generateToken, verifyToken };
