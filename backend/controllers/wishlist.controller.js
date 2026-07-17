// backend/controllers/wishlist.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Wishlist model (assumes a Mongoose schema with user ref and products array)
const Wishlist = require('../models/Wishlist');

/**
 * Get the wishlist for the logged‑in user.
 */
const getMyWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
  if (!wishlist) {
    // New user — return an empty wishlist instead of 404
    return res.json(new ApiResponse(200, 'Wishlist fetched', { products: [] }));
  }
  res.json(new ApiResponse(200, 'Wishlist fetched', wishlist));
});

/**
 * Add a product to the logged‑in user's wishlist.
 * Expected body: { productId }
 */
const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json(new ApiResponse(400, 'productId is required'));
  }
  let wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    logger.info('Created wishlist and added product', { userId: req.user.id, productId });
    return res.status(201).json(new ApiResponse(201, 'Product added to new wishlist', wishlist));
  }
  // Prevent duplicates
  if (wishlist.products.includes(productId)) {
    return res.status(409).json(new ApiResponse(409, 'Product already in wishlist'));
  }
  wishlist.products.push(productId);
  await wishlist.save();
  logger.info('Added product to wishlist', { userId: req.user.id, productId });
  res.json(new ApiResponse(200, 'Product added to wishlist', wishlist));
});

/**
 * Remove a product from the logged‑in user's wishlist.
 * Expected param: productId
 */
const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await Wishlist.findOne({ user: req.user.id });
  if (!wishlist) {
    return res.status(404).json(new ApiResponse(404, 'Wishlist not found'));
  }
  const index = wishlist.products.indexOf(productId);
  if (index === -1) {
    return res.status(404).json(new ApiResponse(404, 'Product not in wishlist'));
  }
  wishlist.products.splice(index, 1);
  await wishlist.save();
  logger.info('Removed product from wishlist', { userId: req.user.id, productId });
  res.json(new ApiResponse(200, 'Product removed from wishlist', wishlist));
});

/**
 * Admin: Get all wishlists.
 */
const getAllWishlists = asyncHandler(async (req, res) => {
  // Assume admin middleware already verified role
  const wishlists = await Wishlist.find().populate('user', 'name email').populate('products');
  res.json(new ApiResponse(200, 'All wishlists fetched', wishlists));
});

/**
 * Admin: Delete a specific wishlist by ID.
 */
const deleteWishlist = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const wishlist = await Wishlist.findByIdAndDelete(id);
  if (!wishlist) {
    return res.status(404).json(new ApiResponse(404, 'Wishlist not found'));
  }
  logger.info('Deleted wishlist', { id });
  res.json(new ApiResponse(200, 'Wishlist deleted'));
});

module.exports = {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
  getAllWishlists,
  deleteWishlist,
};
