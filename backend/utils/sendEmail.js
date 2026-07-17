// backend/utils/sendEmail.js

/**
 * Simple wrapper around Nodemailer for sending transactional e‑mails.
 *
 * Expected environment variables (add them to your .env file):
 *   - EMAIL_HOST
 *   - EMAIL_PORT
 *   - EMAIL_USER
 *   - EMAIL_PASS
 *   - EMAIL_FROM (e.g. "MyShop <no-reply@myshop.com>")
 *
 * Usage example (in a controller):
 *   const { sendEmail } = require('../utils/sendEmail');
 *   await sendEmail({ to: user.email, subject: 'Welcome', html: '<p>Hello!</p>' });
 */

require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Build a reusable transporter. The configuration is loaded once at module load.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an e‑mail.
 * @param {Object} options
 * @param {string} options.to – Recipient e‑mail address (or comma‑separated list).
 * @param {string} options.subject – Subject line.
 * @param {string} options.html – HTML body of the e‑mail.
 * @param {Array<Object>} [options.attachments] – Optional Nodemailer attachments.
 * @returns {Promise<Object>} Result from Nodemailer (info object).
 */
async function sendEmail({ to, subject, html, attachments = [] }) {
  if (!to || !subject || !html) {
    throw new Error('Missing required fields: to, subject, html');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject,
    html,
    attachments,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent', { to, subject, messageId: info.messageId });
    return info;
  } catch (err) {
    logger.error('Failed to send email', { error: err.message, to, subject });
    throw err;
  }
}

module.exports = { sendEmail };
