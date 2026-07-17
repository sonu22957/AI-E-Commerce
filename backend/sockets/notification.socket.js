// backend/sockets/notification.socket.js

/**
 * Socket.io integration for real‑time notifications.
 *
 * Usage (in your server entry point, e.g., app.js or server.js):
 *   const http = require('http');
 *   const server = http.createServer(app);
 *   const { initNotificationSocket } = require('./sockets/notification.socket');
 *   const io = require('socket.io')(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
 *   initNotificationSocket(io);
 *
 * The client should connect with the user's JWT token so we can join them
 * to a private room identified by their user ID:
 *   const socket = io('http://localhost:5000', { query: { token: '<JWT>' } });
 *
 * The server validates the token, extracts the user ID, and joins the socket to a
 * room named `user_<userId>`. Afterwards you can emit a notification to a
 * specific user with:
 *   io.to(`user_${userId}`).emit('notification', notificationData);
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Initialise socket.io listeners for notifications.
 * @param {import('socket.io').Server} io - The socket.io server instance.
 */
function initNotificationSocket(io) {
  // Middleware to authenticate socket connections using JWT from query string.
  io.use((socket, next) => {
    const token = socket.handshake.query?.token;
    if (!token) {
      logger.warn('Socket connection rejected: missing token');
      return next(new Error('Authentication error')); // will disconnect
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // attach decoded payload (should contain id)
      return next();
    } catch (err) {
      logger.warn('Socket authentication failed', { error: err.message });
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.id;
    if (!userId) {
      logger.warn('Socket connected without user ID');
      socket.disconnect(true);
      return;
    }

    // Join a private room for the user.
    const userRoom = `user_${userId}`;
    socket.join(userRoom);
    logger.info('User socket connected', { userId, room: userRoom });

    // Optional: handle client‑initiated events, e.g., marking notifications read.
    socket.on('markAsRead', async (notificationId, callback) => {
      try {
        const Notification = require('../models/Notification');
        const updated = await Notification.findByIdAndUpdate(
          notificationId,
          { read: true, readAt: Date.now() },
          { new: true }
        );
        if (!updated) throw new Error('Notification not found');
        // Emit to the same user that the notification was updated.
        io.to(userRoom).emit('notificationUpdated', updated);
        if (callback) callback({ success: true, notification: updated });
      } catch (err) {
        logger.error('Error marking notification read', { err: err.message, notificationId });
        if (callback) callback({ success: false, error: err.message });
      }
    });

    // Clean up on disconnect.
    socket.on('disconnect', (reason) => {
      logger.info('User socket disconnected', { userId, reason });
    });
  });
}

module.exports = { initNotificationSocket };
