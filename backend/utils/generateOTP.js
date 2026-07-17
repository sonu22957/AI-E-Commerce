// backend/utils/generateOTP.js

/**
 * Utility for generating numeric one‑time passwords (OTP).
 *
 * Two helpers are exported:
 *   1. `generateOTP(length = 6)` – returns a string of random digits.
 *   2. `generateOTPWithExpiry(length = 6, ttlMinutes = 5)` – returns an object
 *      containing the OTP and an expiration `Date` calculated from the current
 *      time plus the TTL (default 5 minutes).
 *
 * Example usage in an auth flow:
 *   const { generateOTPWithExpiry } = require('../utils/generateOTP');
 *   const { otp, expiresAt } = generateOTPWithExpiry();
 *   // store `otp` and `expiresAt` in DB or cache and send `otp` to the user.
 */

/** Generate a numeric OTP of the specified length (default 6). */
function generateOTP(length = 6) {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

/**
 * Generate an OTP together with an expiration timestamp.
 * @param {number} [length=6] - Number of digits.
 * @param {number} [ttlMinutes=5] - Time‑to‑live in minutes.
 * @returns {{ otp: string, expiresAt: Date }}
 */
function generateOTPWithExpiry(length = 6, ttlMinutes = 5) {
  const otp = generateOTP(length);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  return { otp, expiresAt };
}

module.exports = { generateOTP, generateOTPWithExpiry };
