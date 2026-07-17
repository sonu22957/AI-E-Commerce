// backend/controllers/cart.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Cart = require('../models/Cart');

/**
 * Get the current user's cart
 */
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    return res.json(new ApiResponse(200, 'Cart is empty', { items: [] }));
  }
  res.json(new ApiResponse(200, 'Cart fetched', cart));
});

/**
 * Add a product to the cart
 * Expected body: { productId, quantity }
 */
const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json(new ApiResponse(400, 'productId and quantity are required'));
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }
  await cart.save();
  logger.info('Added to cart', { userId, productId, quantity });
  res.status(201).json(new ApiResponse(201, 'Product added to cart', cart));
});

/**
 * Update quantity of a cart item
 * Expected body: { productId, quantity }
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  if (!productId || quantity == null) {
    return res.status(400).json(new ApiResponse(400, 'productId and quantity are required'));
  }
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json(new ApiResponse(404, 'Cart not found'));
  }
  const item = cart.items.find(i => i.product.toString() === productId);
  if (!item) {
    return res.status(404).json(new ApiResponse(404, 'Item not found in cart'));
  }
  item.quantity = quantity;
  await cart.save();
  logger.info('Cart item updated', { userId, productId, quantity });
  res.json(new ApiResponse(200, 'Cart item updated', cart));
});

/**
 * Remove a product from the cart
 * Expected param: productId
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json(new ApiResponse(404, 'Cart not found'));
  }
  const initialLength = cart.items.length;
  cart.items = cart.items.filter(i => i.product.toString() !== productId);
  if (cart.items.length === initialLength) {
    return res.status(404).json(new ApiResponse(404, 'Item not found in cart'));
  }
  await cart.save();
  logger.info('Removed from cart', { userId, productId });
  res.json(new ApiResponse(200, 'Item removed from cart', cart));
});

/**
 * Clear the entire cart
 */
const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.json(new ApiResponse(200, 'Cart already empty', { items: [] }));
  }
  cart.items = [];
  await cart.save();
  logger.info('Cleared cart', { userId });
  res.json(new ApiResponse(200, 'Cart cleared', cart));
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
