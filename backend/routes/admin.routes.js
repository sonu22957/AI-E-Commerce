// backend/routes/admin.routes.js

const express = require('express');
const router = express.Router();

// Controllers
const {
  getAllUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} = require('../controllers/admin.controller');

// Middleware (assumed existing authentication/authorization)
const { protect, admin } = require('../middleware/auth');

// All admin routes should be protected and require admin role
router.use(protect, admin);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Coupon management
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.delete('/coupons/:id', deleteCoupon);

module.exports = router;
