// backend/routes/review.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires a logged‑in user)
const { protect } = require('../middleware/auth');
// Optional admin‑only middleware – uncomment if you have it
// const admin = require('../middleware/admin');

// Controller functions
const {
  getAllReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');

// ---------------------------------------------------------------------------
// All review routes require authentication (protect middleware)
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// GET    /                 – Get all reviews (admin view)
// GET    /product/:productId – Get reviews for a specific product (public view)
// GET    /:id              – Get a single review by ID (admin/user)
// POST   /                 – Create a new review (authenticated user)
// PATCH  /:id              – Update a review (owner or admin)
// DELETE /:id              – Delete a review (owner or admin)
// ---------------------------------------------------------------------------

// Admin view – all reviews
router.get('/', getAllReviews);

// Public view – reviews for a product
router.get('/product/:productId', getProductReviews);

// Single review (admin/user)
router.get('/:id', getReview);

// Create review (user)
router.post('/', createReview);

// Update review (owner or admin) – uncomment `admin` middleware if you have role checks there
router.patch('/:id', /* admin, */ updateReview);

// Delete review (owner or admin)
router.delete('/:id', /* admin, */ deleteReview);

module.exports = router;
