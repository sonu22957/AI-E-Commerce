// backend/models/Payment.js

const mongoose = require('mongoose');

/**
 * Payment schema representing a payment transaction linked to an order.
 * Fields:
 *   - order:     reference to the Order this payment belongs to
 *   - amount:    monetary amount paid
 *   - method:    payment method used (e.g., "Card", "PayPal", "Cash")
 *   - status:    current payment status
 *   - transactionId: optional gateway transaction reference
 */
const PaymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      required: true,
      enum: ['Card', 'PayPal', 'Cash', 'UPI', 'NetBanking', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
