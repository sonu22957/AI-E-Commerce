// backend/routes/user.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires a logged‑in user)
const { protect } = require('../middleware/auth');
// Optional admin‑only middleware – uncomment if needed
// const admin = require('../middleware/admin');

// Controller functions
const {
  getAllUsers,
  getUserById,
  getMe,
  updateUser,
  deleteUser,
} = require('../controllers/user.Controller.js');

// ---------------------------------------------------------------------------
// All user routes require authentication (protect middleware)
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// GET    /               – Get all users (admin only)
// GET    /me              – Get current logged‑in user's profile
// GET    /:id            – Get a single user by ID (admin or owner)
// PATCH  /:id            – Update a user's profile (owner only)
// DELETE /:id            – Delete a user (owner or admin)
// ---------------------------------------------------------------------------

// Admin view – list all users
router.get('/', /* admin, */ getAllUsers);

// Current user profile
router.get('/me', getMe);

// Get a specific user (admin or owner)
router.get('/:id', getUserById);

// Update own profile
router.patch('/:id', updateUser);

// Delete user (owner or admin)
router.delete('/:id', deleteUser);

module.exports = router;
