// backend/models/Notification.js

const mongoose = require('mongoose');

/**
 * Notification schema for user notifications.
 * Fields:
 *   - user: reference to the User who owns the notification
 *   - title: short title of the notification
 *   - message: detailed message body
 *   - read: whether the notification has been read by the user
 *   - createdAt: timestamp of creation (default: now)
 */
const NotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model('Notification', NotificationSchema);
