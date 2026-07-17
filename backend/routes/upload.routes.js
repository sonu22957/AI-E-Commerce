// backend/routes/upload.routes.js

const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../middleware/upload');
const { protect, admin } = require('../middleware/auth');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Only allow authenticated users (and typically admins) to upload product images
router.post('/', protect, admin, uploadSingle('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json(new ApiResponse(400, 'No file uploaded'));
  }

  logger.info('File uploaded to Cloudinary', { url: req.file.path });
  
  // Return the secure Cloudinary URL
  res.json(new ApiResponse(200, 'Image uploaded successfully', { url: req.file.path }));
});

module.exports = router;
