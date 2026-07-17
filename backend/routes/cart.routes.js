// backend/routes/cart.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires logged‑in user)
const { protect } = require('../middleware/auth');

// Controller functions
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controllers/cart.controller');

// All cart endpoints require authentication
router.use(protect);

// Get the current user's cart
router.get('/', getCart);

// Add a product to the cart
router.post('/', addToCart);

// Update quantity of an existing cart item
router.put('/', updateCartItem);

// Remove a specific product from the cart (productId in URL)
router.delete('/:productId', removeFromCart);

// Clear the entire cart
router.delete('/', clearCart);

module.exports = router;
