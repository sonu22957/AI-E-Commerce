// backend/controllers/review.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Review = require('../models/Review');

/**
 * Get all reviews (admin view)
 */
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().populate('user', 'name email').populate('product', 'name');
  logger.info('Fetched all reviews');
  res.json(new ApiResponse(200, 'Fetched reviews', reviews));
});

/**
 * Get reviews for a specific product (public view)
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  logger.info('Fetched product reviews', { productId });
  res.json(new ApiResponse(200, 'Fetched product reviews', reviews));
});

/**
 * Get a single review by ID (admin/user)
 */
const getReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id)
    .populate('user', 'name email')
    .populate('product', 'name');
  if (!review) {
    return res.status(404).json(new ApiResponse(404, 'Review not found'));
  }
  logger.info('Fetched review', { id });
  res.json(new ApiResponse(200, 'Fetched review', review));
});

/**
 * Create a new review (authenticated user)
 * Expected body: { product, rating, comment }
 */
const createReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { product, rating, comment } = req.body;
  if (!product || rating == null) {
    return res.status(400).json(new ApiResponse(400, 'Product and rating are required'));
  }
  const review = await Review.create({
    user: userId,
    product,
    rating,
    comment,
  });
  logger.info('Created review', { userId, product });
  res.status(201).json(new ApiResponse(201, 'Review created', review));
});

/**
 * Update an existing review (owner or admin)
 * Expected body: any updatable fields (rating, comment)
 */
const updateReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json(new ApiResponse(404, 'Review not found'));
  }
  // Allow only owner or admin to modify – simplistic check assuming req.user.role
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json(new ApiResponse(403, 'Forbidden'));
  }
  Object.assign(review, updates);
  await review.save();
  logger.info('Updated review', { id });
  res.json(new ApiResponse(200, 'Review updated', review));
});

/**
 * Delete a review (owner or admin)
 */
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json(new ApiResponse(404, 'Review not found'));
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json(new ApiResponse(403, 'Forbidden'));
  }
  await Review.findByIdAndDelete(id);
  logger.info('Deleted review', { id });
  res.json(new ApiResponse(200, 'Review deleted'));
});

module.exports = {
  getAllReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
