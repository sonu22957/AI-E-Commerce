// backend/models/Product.js

const mongoose = require('mongoose');

/**
 * Product schema representing an item for sale.
 * Fields:
 *   - name: product name
 *   - price: numeric price
 *   - description: detailed description
 *   - category: product category (string)
 *   - stock: number of items in inventory
 *   - images: array of image URLs
 *   - rating: average rating (optional)
 *   - numReviews: count of reviews
 *   - createdAt: timestamp of creation (default now)
 */
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    category: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    images: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
