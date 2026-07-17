// backend/controllers/coupon.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Coupon = require('../models/Coupon');

/**
 * Get all coupons
 */
const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  logger.info('Fetched all coupons');
  res.json(new ApiResponse(200, 'Fetched coupons', coupons));
});

/**
 * Get a single coupon by ID
 */
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    return res.status(404).json(new ApiResponse(404, 'Coupon not found'));
  }
  logger.info('Fetched coupon', { id });
  res.json(new ApiResponse(200, 'Fetched coupon', coupon));
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
 * Update an existing coupon
 * Expected body: { code, discount, expiryDate }
 */
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, discount, expiryDate } = req.body;
  const coupon = await Coupon.findByIdAndUpdate(
    id,
    { code, discount, expiryDate },
    { new: true }
  );
  if (!coupon) {
    return res.status(404).json(new ApiResponse(404, 'Coupon not found'));
  }
  logger.info('Updated coupon', { id });
  res.json(new ApiResponse(200, 'Coupon updated', coupon));
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
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
