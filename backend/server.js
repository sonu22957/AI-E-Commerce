// backend/server.js

/**
 * Server entry point – creates the HTTP server, connects to MongoDB, and
 * integrates Socket.io for real‑time notifications.
 *
 *   • Loads environment variables from .env
 *   • Connects to the database using Mongoose
 *   • Starts an HTTP server on the configured PORT
 *   • Initializes the notification socket (./sockets/notification.socket)
 *   • Handles graceful shutdown on SIGINT / SIGTERM
 */

require('dotenv').config(); // load .env variables early

const http = require('http');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const app = require('./app');
const { initNotificationSocket } = require('./sockets/notification.socket');

// ---------------------------------------------------------------------------
// Database connection
// ---------------------------------------------------------------------------
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce';
    await mongoose.connect(mongoURI, {
      // Newer Mongoose versions already apply sensible defaults
    });
    logger.info('✅ Connected to MongoDB');
  } catch (err) {
    logger.error('❌ MongoDB connection error', { error: err.message });
    process.exit(1);
  }
};

connectDB();

// ---------------------------------------------------------------------------
// HTTP server & Socket.io integration
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialise Socket.io – allow same origin as the API (CORS handled in socket file)
const io = require('socket.io')(server, {
  cors: {
    origin: '*', // adjust for production
    methods: ['GET', 'POST'],
  },
});

initNotificationSocket(io);

server.on('error', (error) => {
  if (error.syscall !== 'listen') throw error;
  if (error.code === 'EADDRINUSE') {
    logger.error(`❌ Port ${PORT} is already in use. Please kill the process using it or change the PORT in .env`);
    process.exit(1);
  } else {
    throw error;
  }
});

server.listen(PORT, () => {
  logger.info(`🚀 Server listening on http://localhost:${PORT}`);
});

// ---------------------------------------------------------------------------
// Graceful shutdown handling
// ---------------------------------------------------------------------------
const gracefulShutdown = () => {
  logger.info('⚡️ Received shutdown signal, closing server...');
  server.close(() => {
    logger.info('🛑 HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('🗄️ MongoDB connection closed');
      process.exit(0);
    });
  });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Catch unhandled promise rejections & uncaught exceptions
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection', { reason });
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception', { error: err });
  process.exit(1);
});
