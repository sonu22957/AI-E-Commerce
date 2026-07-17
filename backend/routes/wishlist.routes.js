// backend/routes/wishlist.routes.js

const express = require('express');
const router = express.Router();

// Auth middleware
const { protect } = require('../middleware/auth');

// Controller functions
const {
  getMyWishlist,
  addToWishlist,
  removeFromWishlist,
} = require('../controllers/wishlist.controller');

// All wishlist routes require authentication
router.use(protect);

// GET    /api/wishlist           – Get current user's wishlist
router.get('/', getMyWishlist);

// POST   /api/wishlist           – Add a product to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId – Remove a product from wishlist
router.delete('/:productId', removeFromWishlist);

module.exports = router;
