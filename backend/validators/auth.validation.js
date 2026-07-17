// backend/validators/auth.validation.js

/**
 * Joi validation schemas for authentication related endpoints.
 *
 * Exported schemas are intended to be used with the `validate` middleware
 * from `backend/middleware/validator.js`.
 *   router.post('/register', validate(authValidation.registerSchema), register);
 */

const Joi = require('joi');

// Register a new user
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Login existing user
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Request OTP (e.g., for password reset)
const requestOTPSchema = Joi.object({
  email: Joi.string().email().required(),
});

// Reset password using OTP
const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  requestOTPSchema,
  resetPasswordSchema,
};
