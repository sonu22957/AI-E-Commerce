// backend/config/cloudinary.js

// Load environment variables (make sure a .env file exists at the project root)
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  // Optional secure delivery setting
  secure: true,
});

module.exports = cloudinary;
