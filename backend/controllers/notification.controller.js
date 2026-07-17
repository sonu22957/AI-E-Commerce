// backend/controllers/notification.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');

// Model (adjust path if needed)
const Notification = require('../models/Notification');

/**
 * Get all notifications (admin view)
 */
const getAllNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find().sort({ createdAt: -1 });
  logger.info('Fetched all notifications');
  res.json(new ApiResponse(200, 'Fetched notifications', notifications));
});

/**
 * Get notifications for the logged‑in user
 */
const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
  logger.info('Fetched user notifications', { userId });
  res.json(new ApiResponse(200, 'Fetched user notifications', notifications));
});

/**
 * Create a new notification (admin or system trigger)
 * Expected body: { user, title, message, type }
 */
const createNotification = asyncHandler(async (req, res) => {
  const { user, title, message, type } = req.body;
  if (!user || !title || !message) {
    return res.status(400).json(new ApiResponse(400, 'user, title and message are required'));
  }
  const notification = await Notification.create({ user, title, message, type });
  logger.info('Created notification', { user, title });
  res.status(201).json(new ApiResponse(201, 'Notification created', notification));
});

/**
 * Mark a notification as read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params; // notification id
  const notification = await Notification.findByIdAndUpdate(
    id,
    { read: true, readAt: Date.now() },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json(new ApiResponse(404, 'Notification not found'));
  }
  logger.info('Marked notification as read', { id });
  res.json(new ApiResponse(200, 'Notification marked as read', notification));
});

/**
 * Delete a notification
 */
const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const notification = await Notification.findByIdAndDelete(id);
  if (!notification) {
    return res.status(404).json(new ApiResponse(404, 'Notification not found'));
  }
  logger.info('Deleted notification', { id });
  res.json(new ApiResponse(200, 'Notification deleted'));
});

module.exports = {
  getAllNotifications,
  getUserNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
};
