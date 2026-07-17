// backend/controllers/category.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Category = require('../models/Category');

/**
 * Get all categories
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  logger.info('Fetched all categories');
  res.json(new ApiResponse(200, 'Fetched categories', categories));
});

/**
 * Get a single category by ID
 */
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json(new ApiResponse(404, 'Category not found'));
  }
  logger.info('Fetched category', { id });
  res.json(new ApiResponse(200, 'Fetched category', category));
});

/**
 * Create a new category
 * Expected body: { name, description }
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json(new ApiResponse(400, 'Category name is required'));
  }
  const existing = await Category.findOne({ name });
  if (existing) {
    return res.status(409).json(new ApiResponse(409, 'Category already exists'));
  }
  const category = await Category.create({ name, description });
  logger.info('Created category', { name });
  res.status(201).json(new ApiResponse(201, 'Category created', category));
});

/**
 * Update an existing category
 * Expected body: { name, description }
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  if (!category) {
    return res.status(404).json(new ApiResponse(404, 'Category not found'));
  }
  logger.info('Updated category', { id });
  res.json(new ApiResponse(200, 'Category updated', category));
});

/**
 * Delete a category by ID
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json(new ApiResponse(404, 'Category not found'));
  }
  logger.info('Deleted category', { id });
  res.json(new ApiResponse(200, 'Category deleted'));
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
