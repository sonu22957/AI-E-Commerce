// backend/middleware/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

// Limits – 5 MB per file by default
const limits = {
  fileSize: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 5 * 1024 * 1024,
};

// Multer instance
const upload = multer({ storage, limits });

// Helper wrappers
const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadArray = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

module.exports = { upload, uploadSingle, uploadArray, uploadFields };
