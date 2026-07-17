// backend/models/Coupon.js

const mongoose = require('mongoose');

/**
 * Coupon schema for promotional discounts.
 * Fields:
 *   - code: unique identifier for the coupon (e.g., "SAVE10")
 *   - discount: number or percentage amount (e.g., 10 for $10 off or 0.15 for 15% off)
 *   - isPercentage: boolean indicating whether discount is a percentage
 *   - expiryDate: optional date after which the coupon is invalid
 *   - maxUses: optional limit on number of times the coupon can be used
 *   - usedCount: tracks how many times the coupon has been applied
 *   - active: flag to enable/disable the coupon without deletion
 */
const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    discount: { type: Number, required: true },
    isPercentage: { type: Boolean, default: false },
    expiryDate: { type: Date },
    maxUses: { type: Number, default: null }, // null means unlimited
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Virtual to check if coupon is still valid
CouponSchema.virtual('isValid').get(function () {
  if (!this.active) return false;
  if (this.expiryDate && this.expiryDate < new Date()) return false;
  if (this.maxUses !== null && this.usedCount >= this.maxUses) return false;
  return true;
});

module.exports = mongoose.model('Coupon', CouponSchema);
