// backend/controllers/admin.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Models (adjust paths if needed)
const User = require('../models/User');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

/**
 * Get all users
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password'); // omit password
  logger.info('Fetched all users');
  res.json(new ApiResponse(200, 'Fetched users', users));
});

/**
 * Delete a user by ID
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, 'User not found'));
  }
  logger.info('Deleted user', { id });
  res.json(new ApiResponse(200, 'User deleted'));
});

/**
 * Get all orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  logger.info('Fetched all orders');
  res.json(new ApiResponse(200, 'Fetched orders', orders));
});

/**
 * Update order status
 * Expected body: { status }
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json(new ApiResponse(400, 'Status is required'));
  }
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) {
    return res.status(404).json(new ApiResponse(404, 'Order not found'));
  }
  logger.info('Updated order status', { id, status });
  res.json(new ApiResponse(200, 'Order status updated', order));
});

/**
 * Get all coupons
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  logger.info('Fetched all coupons');
  res.json(new ApiResponse(200, 'Fetched coupons', coupons));
});

/**
 * Create a new coupon
 * Expected body: { code, discount, expiryDate }
 */
const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount, expiryDate } = req.body;
  if (!code || discount == null) {
    return res.status(400).json(new ApiResponse(400, 'Code and discount are required'));
  }
  const existing = await Coupon.findOne({ code });
  if (existing) {
    return res.status(409).json(new ApiResponse(409, 'Coupon code already exists'));
  }
  const coupon = await Coupon.create({ code, discount, expiryDate });
  logger.info('Created coupon', { code });
  res.status(201).json(new ApiResponse(201, 'Coupon created', coupon));
});

/**
 * Delete a coupon by ID
 */
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) {
    return res.status(404).json(new ApiResponse(404, 'Coupon not found'));
  }
  logger.info('Deleted coupon', { id });
  res.json(new ApiResponse(200, 'Coupon deleted'));
});

module.exports = {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
};
