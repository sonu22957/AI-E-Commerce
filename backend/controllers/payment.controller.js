// backend/controllers/payment.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed). Assuming a Payment model exists.
const Payment = require('../models/Payment');

/**
 * Get all payments (admin view)
 */
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find().populate('order', 'totalAmount');
  logger.info('Fetched all payments');
  res.json(new ApiResponse(200, 'Fetched payments', payments));
});

/**
 * Get a single payment by ID
 */
const getPayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await Payment.findById(id).populate('order');
  if (!payment) {
    return res.status(404).json(new ApiResponse(404, 'Payment not found'));
  }
  logger.info('Fetched payment', { id });
  res.json(new ApiResponse(200, 'Fetched payment', payment));
});

/**
 * Create a new payment record (e.g., after order placement)
 * Expected body: { orderId, amount, method, status }
 */
const createPayment = asyncHandler(async (req, res) => {
  const { orderId, amount, method, status } = req.body;
  if (!orderId || !amount || !method) {
    return res.status(400).json(new ApiResponse(400, 'orderId, amount and method are required'));
  }
  const payment = await Payment.create({
    order: orderId,
    amount,
    method,
    status: status || 'Pending',
  });
  logger.info('Created payment', { paymentId: payment._id, orderId });
  res.status(201).json(new ApiResponse(201, 'Payment created', payment));
});

/**
 * Update payment status (e.g., after gateway callback)
 * Expected body: { status }
 */
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json(new ApiResponse(400, 'Status is required'));
  }
  const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
  if (!payment) {
    return res.status(404).json(new ApiResponse(404, 'Payment not found'));
  }
  logger.info('Updated payment status', { id, status });
  res.json(new ApiResponse(200, 'Payment status updated', payment));
});

/**
 * Delete a payment record (admin operation)
 */
const deletePayment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const payment = await Payment.findByIdAndDelete(id);
  if (!payment) {
    return res.status(404).json(new ApiResponse(404, 'Payment not found'));
  }
  logger.info('Deleted payment', { id });
  res.json(new ApiResponse(200, 'Payment deleted'));
});

module.exports = {
  getAllPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};
