// backend/controllers/product.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Product = require('../models/Product');

/**
 * Get all products (optional query params for pagination, filtering)
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, category, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));
  logger.info('Fetched products', { page, limit, filter });
  res.json(new ApiResponse(200, 'Fetched products', products));
});

/**
 * Get a single product by ID
 */
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json(new ApiResponse(404, 'Product not found'));
  }
  logger.info('Fetched product', { id });
  res.json(new ApiResponse(200, 'Fetched product', product));
});

/**
 * Create a new product (admin)
 * Expected body: { name, price, description, category, stock, images }
 */
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, stock, images } = req.body;
  if (!name || price == null) {
    return res.status(400).json(new ApiResponse(400, 'Name and price are required'));
  }
  const product = await Product.create({ name, price, description, category, stock, images });
  logger.info('Created product', { productId: product._id });
  res.status(201).json(new ApiResponse(201, 'Product created', product));
});

/**
 * Update an existing product (admin)
 * Expected body: any updatable fields
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(id, updates, { new: true });
  if (!product) {
    return res.status(404).json(new ApiResponse(404, 'Product not found'));
  }
  logger.info('Updated product', { id });
  res.json(new ApiResponse(200, 'Product updated', product));
});

/**
 * Delete a product (admin)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return res.status(404).json(new ApiResponse(404, 'Product not found'));
  }
  logger.info('Deleted product', { id });
  res.json(new ApiResponse(200, 'Product deleted'));
});

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
