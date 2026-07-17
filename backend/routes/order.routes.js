// backend/routes/order.routes.js

const express = require('express');
const router = express.Router();

// Middleware – protect routes (requires a logged‑in user)
const { protect } = require('../middleware/auth');
// If you have an admin‑only middleware, you can import it as well:
// const admin = require('../middleware/admin'); // uncomment if needed

// Controller functions
const {
  getAllOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/order.controller');

// ---------------------------------------------------------------------------
// All order routes require a valid JWT (protect middleware)
// ---------------------------------------------------------------------------
router.use(protect);

// ---------------------------------------------------------------------------
// GET    /               – Retrieve all orders (admin/manager view)
// GET    /myorders       – Retrieve orders for current user
// GET    /:id            – Retrieve a single order by its ID
// POST   /               – Create a new order (usually from a completed cart)
// PATCH  /:id/status     – Update the status of an order (admin only)
// DELETE /:id            – Delete an order (admin only)
// ---------------------------------------------------------------------------

// Retrieve all orders (typically admin only)
router.get('/', /* admin, */ getAllOrders);

// Retrieve orders for current user
router.get('/myorders', getMyOrders);

// Retrieve a single order by ID
router.get('/:id', getOrder);

// Create a new order (customer‑facing)
router.post('/', createOrder);

// Update an order's status (admin)
router.patch('/:id/status', /* admin, */ updateOrderStatus);

// Delete an order (admin)
router.delete('/:id', /* admin, */ deleteOrder);

module.exports = router;
