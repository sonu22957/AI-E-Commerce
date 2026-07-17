// backend/controllers/auth.Controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');

// Utils (assumed to exist)
const generateOTP = require('../utils/generateOTP'); // should export a function returning { otp, expiresAt }
const jwt = require('../utils/jwt'); // should have signToken(payload) and verifyToken(token)

// User model (placeholder – replace with actual Mongoose model path)
const User = require('../models/User');

/**
 * Register a new user.
 * Expected body: { name, email, password }
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json(new ApiResponse(400, 'Name, email, and password are required'));
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json(new ApiResponse(409, 'User already exists'));
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });

  const token = jwt.generateToken({ id: user._id });
  logger.info('User registered', { email });
  res.status(201).json(new ApiResponse(201, 'User registered', { 
    token, 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } 
  }));
});

/**
 * Login an existing user.
 * Expected body: { email, password }
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json(new ApiResponse(400, 'Email and password are required'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json(new ApiResponse(401, 'Invalid credentials'));
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json(new ApiResponse(401, 'Invalid credentials'));
  }

  const token = jwt.generateToken({ id: user._id });
  logger.info('User logged in', { email });
  res.json(new ApiResponse(200, 'Login successful', { 
    token, 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } 
  }));
});

const crypto = require('crypto');

/**
 * Request a password reset link.
 * Expected body: { email }
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json(new ApiResponse(400, 'Email is required'));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }

  // Generate a random token
  const resetToken = crypto.randomBytes(20).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Store token in user document
  user.resetOTP = resetToken;
  user.otpExpires = expiresAt;
  await user.save();

  // In a real app, send this token via email link:
  // e.g., http://localhost:5173/reset-password/${resetToken}
  logger.info('Password reset token generated for user', { email, resetToken });
  res.json(new ApiResponse(200, 'Reset link sent', { expiresIn: expiresAt }));
});

/**
 * Verify token and reset password.
 * Expected params: { token } OR expected body: { token }
 * Expected body: { password }
 */
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token || req.body.token;
  const { password: newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json(new ApiResponse(400, 'Token and new password are required'));
  }

  const user = await User.findOne({ resetOTP: token });
  if (!user) {
    return res.status(400).json(new ApiResponse(400, 'Invalid or expired reset token'));
  }

  if (new Date() > user.otpExpires) {
    return res.status(410).json(new ApiResponse(410, 'Reset token has expired'));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.otpExpires = undefined;
  await user.save();

  logger.info('Password reset successful', { email: user.email });
  res.json(new ApiResponse(200, 'Password reset successful'));
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
