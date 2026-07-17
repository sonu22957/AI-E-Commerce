// backend/controllers/order.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Order = require('../models/Order');

/**
 * Get all orders (admin view)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email');
  logger.info('Fetched all orders');
  res.json(new ApiResponse(200, 'Fetched orders', orders));
});

/**
 * Get orders for current user
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.find({ user: userId })
    .populate('items.product', 'name images image price')
    .sort({ createdAt: -1 });
  logger.info('Fetched user orders', { userId });
  res.json(new ApiResponse(200, 'Fetched user orders', orders));
});

/**
 * Get a single order by ID (admin view)
 */
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate('user', 'name email');
  if (!order) {
    return res.status(404).json(new ApiResponse(404, 'Order not found'));
  }
  logger.info('Fetched order', { id });
  res.json(new ApiResponse(200, 'Fetched order', order));
});

/**
 * Create a new order (typically from a completed cart)
 * Expected body: { items, totalAmount, address, paymentMethod }
 */
const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { items, totalAmount, address, paymentMethod } = req.body;
  if (!items || !totalAmount || !address) {
    return res.status(400).json(new ApiResponse(400, 'Items, totalAmount and address are required'));
  }
  const order = await Order.create({
    user: userId,
    items,
    totalAmount,
    address,
    paymentMethod,
    status: 'Pending',
  });
  logger.info('Created order', { orderId: order._id, userId });
  res.status(201).json(new ApiResponse(201, 'Order created', order));
});

/**
 * Update order status (admin operation)
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
 * Delete an order (admin operation)
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  if (!order) {
    return res.status(404).json(new ApiResponse(404, 'Order not found'));
  }
  logger.info('Deleted order', { id });
  res.json(new ApiResponse(200, 'Order deleted'));
});

module.exports = {
  getAllOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
