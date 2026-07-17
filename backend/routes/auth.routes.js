// backend/routes/auth.routes.js

const express = require('express');
const router = express.Router();

// Controller functions
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth.Controller');

// Register a new user
router.post('/register', register);

// Login existing user
router.post('/login', login);

// Request password reset link
router.post('/forgot-password', forgotPassword);

// Verify token and reset password
router.put('/resetpassword/:token', resetPassword);

module.exports = router;
