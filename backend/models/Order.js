// backend/models/Order.js

const mongoose = require('mongoose');

/**
 * Order schema representing a purchase made by a user.
 * Fields:
 *   - user: reference to the User who placed the order
 *   - items: array of purchased products with quantity and price
 *   - totalAmount: total monetary value of the order
 *   - status: current order status (e.g., pending, paid, shipped, delivered, cancelled)
 *   - paymentResult: information about the payment outcome (id, status, update_time, email_address)
 *   - createdAt: timestamp when the order was created (default: now)
 */
const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
