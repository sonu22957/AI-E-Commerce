// backend/models/Wishlist.js

const mongoose = require('mongoose');

/**
 * Wishlist schema representing a collection of products a user wants to save.
 * Fields:
 *   - user: reference to the User owning the wishlist
 *   - products: array of Product references
 *   - createdAt / updatedAt are managed by timestamps
 */
const WishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', WishlistSchema);
