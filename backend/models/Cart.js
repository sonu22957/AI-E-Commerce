// backend/models/Cart.js

const mongoose = require('mongoose');

// Sub‑document schema for each cart item
const CartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

// Main Cart schema – one cart per user
const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

// Virtual field to compute total price (requires product population)
CartSchema.virtual('total').get(function () {
  if (!this.populated('items.product')) return null;
  return this.items.reduce((sum, item) => {
    const price = item.product.price || 0;
    return sum + price * item.quantity;
  }, 0);
});

module.exports = mongoose.model('Cart', CartSchema);
