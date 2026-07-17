// backend/models/Review.js

const mongoose = require('mongoose');

/**
 * Review schema for product reviews left by users.
 * Fields:
 *   - user: reference to the User who wrote the review
 *   - product: reference to the Product being reviewed
 *   - rating: numeric rating (e.g., 1‑5)
 *   - comment: optional text comment
 *   - createdAt / updatedAt are handled automatically by timestamps
 */
const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
