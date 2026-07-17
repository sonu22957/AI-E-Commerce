// backend/config/db.js

// Load environment variables (ensure you have a .env file at the project root)
require('dotenv').config();

const mongoose = require('mongoose');

// Prefer a full MONGODB_URI from env (works with Atlas, Docker, local, etc.)
// Falls back to building a URI from individual DB_* parts
const mongoURI =
  process.env.MONGODB_URI ||
  (() => {
    const DB_USER     = process.env.DB_USER     || '';
    const DB_PASSWORD = process.env.DB_PASSWORD || '';
    const DB_HOST     = process.env.DB_HOST     || 'localhost';
    const DB_PORT     = process.env.DB_PORT     || '27017';
    const DB_NAME     = process.env.DB_NAME     || 'ecommerce';

    const authPart =
      DB_USER && DB_PASSWORD
        ? `${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@`
        : '';

    return `mongodb://${authPart}${DB_HOST}:${DB_PORT}/${DB_NAME}`;
  })();

// Mongoose 7+ removed useNewUrlParser / useUnifiedTopology – keep only valid options
const mongooseOptions = {
  // Auto-create indexes in dev only (skip in production for performance)
  autoIndex: process.env.NODE_ENV !== 'production',
  // Connection pool size
  maxPoolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
};

// Function to connect to the database – call from server entry point
async function connectDB() {
  try {
    await mongoose.connect(mongoURI, mongooseOptions);
    console.log(`✅ MongoDB connected → ${mongoURI.replace(/:\/\/.*@/, '://<credentials>@')}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };

