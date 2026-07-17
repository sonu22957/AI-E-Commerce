// backend/routes/payment.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires logged‑in user)
const { protect } = require('../middleware/auth');
// Optional admin middleware – only admins can manage payments
const admin = require('../middleware/admin');

// Controller functions
const {
  getAllPayments,
  getPayment,
  createPayment,
  updatePaymentStatus,
  deletePayment,
} = require('../controllers/payment.controller');

// All routes require authentication
router.use(protect);

// Admin‑only: list all payments
router.get('/', admin, getAllPayments);

// Admin‑only: fetch a single payment by ID
router.get('/:id', admin, getPayment);

// Create a payment record (any authenticated user)
router.post('/', createPayment);

// Admin‑only: update payment status
router.patch('/:id/status', admin, updatePaymentStatus);

// Admin‑only: delete a payment record
router.delete('/:id', admin, deletePayment);

module.exports = router;
