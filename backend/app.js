// backend/app.js

/**
 * Express application entry point.
 *
 * Sets up global middleware, mounts route modules, and provides
 * centralized error handling. Exported for use by server.js which
 * creates the HTTP server and integrates Socket.io.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./utils/logger');
const ApiError = require('./utils/ApiError');

const app = express();

// ---------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------
app.use(helmet()); // security headers
// Parse comma-separated origins from env, e.g. "http://localhost:5173,https://myapp.com"
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === '*'
      ? '*'
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
          }
        },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple request logger
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------
// Health check – GET /
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ success: true, message: '🛒 E-Commerce API is running', version: '1.0.0' });
});

// ---------------------------------------------------------------
// Route mounting
// ---------------------------------------------------------------
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/carts', require('./routes/cart.routes'));
app.use('/api/payments', require('./routes/payment.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/upload', require('./routes/upload.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));

// ---------------------------------------------------------------
// 404 handler – route not found
// ---------------------------------------------------------------
app.use((req, res, next) => {
  next(new ApiError(404, `Cannot ${req.method} ${req.originalUrl}`));
});

// ---------------------------------------------------------------
// Central error handling middleware
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode >= 500) {
    console.error('SERVER ERROR STACK:', err);
    logger.error('Server error', { error: err });
  } else {
    logger.warn('Client error', { statusCode, message });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;
