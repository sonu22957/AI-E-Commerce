// backend/controllers/user.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// User model
const User = require('../models/User');

/**
 * Get all users (admin only).
 * Query parameters can be used for pagination in future.
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Assuming middleware has verified admin role
  const users = await User.find().select('-password');
  logger.info('Fetched all users');
  res.json(new ApiResponse(200, 'Fetched users', users));
});

/**
 * Get a single user by ID (admin or owner).
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // Allow owner to fetch own profile or admin to fetch any
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json(new ApiResponse(403, 'Forbidden'));
  }
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }
  res.json(new ApiResponse(200, 'User fetched', user));
});

/**
 * Get current logged‑in user's profile.
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }
  res.json(new ApiResponse(200, 'Profile fetched', user));
});

/**
 * Update a user's profile (owner only).
 * Expected body: { name?, email?, password? }
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.id !== id) {
    return res.status(403).json(new ApiResponse(403, 'Forbidden'));
  }
  const updates = {};
  const { name, email, password } = req.body;
  if (name) updates.name = name;
  if (email) updates.email = email;
  if (password) {
    const bcrypt = require('bcryptjs');
    updates.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  if (!updatedUser) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }
  logger.info('User profile updated', { id });
  res.json(new ApiResponse(200, 'Profile updated', updatedUser));
});

/**
 * Delete a user (owner or admin).
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json(new ApiResponse(403, 'Forbidden'));
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }
  logger.info('User deleted', { id });
  res.json(new ApiResponse(200, 'User deleted'));
});

module.exports = {
  getAllUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
};
