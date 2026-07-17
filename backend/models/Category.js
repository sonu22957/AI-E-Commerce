// backend/models/Category.js

const mongoose = require('mongoose');

// Category schema definition
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String },
    // Optional reference to a parent category for hierarchical categories
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    // Image URL for category thumbnail (optional)
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

// Pre‑save hook to generate slug if not provided
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = this.name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  next();
});

// Virtual for child categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
});

module.exports = mongoose.model('Category', CategorySchema);
