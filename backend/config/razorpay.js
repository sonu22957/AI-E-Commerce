// backend/config/razorpay.js

// Load environment variables (ensure a .env file exists at the project root)
require('dotenv').config();

// Razorpay SDK – install with: npm install razorpay
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

module.exports = razorpayInstance;
