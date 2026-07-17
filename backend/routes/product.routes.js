// backend/routes/product.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires a logged‑in user)
const { protect } = require('../middleware/auth');
// Optional admin‑only middleware – uncomment if you have it
// const admin = require('../middleware/admin');

// Controller functions
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

// ---------------------------------------------------------------------------
// GET    /               – List all products (publicly accessible)
// GET    /:id            – Get a single product by ID (publicly accessible)
// POST   /               – Create a new product (admin only)
// PATCH  /:id            – Update an existing product (admin only)
// DELETE /:id            – Delete a product (admin only)
// ---------------------------------------------------------------------------

// Public read‑only routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Admin‑only routes (uncomment `admin` middleware when ready)
router.post('/', protect, /* admin, */ createProduct);
router.patch('/:id', protect, /* admin, */ updateProduct);
router.delete('/:id', protect, /* admin, */ deleteProduct);

module.exports = router;
