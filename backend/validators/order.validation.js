// backend/validators/order.validation.js

/**
 * Joi validation schemas for order‑related endpoints.
 *
 * These schemas are intended to be used with the `validate` middleware
 * defined in `backend/middleware/validator.js`.
 *   router.post('/', validate(orderValidation.createOrderSchema), createOrder);
 *   router.patch('/:id/status', validateObject(orderValidation.updateStatusSchema, 'body'), updateOrderStatus);
 *   router.get('/:id', validateObject(orderValidation.idParamSchema, 'params'), getOrder);
 */

const Joi = require('joi');

// Validate creation of a new order (normally from a completed cart)
const createOrderSchema = Joi.object({
  items: Joi.array().items(Joi.object()).min(1).required(),
  totalAmount: Joi.number().positive().required(),
  address: Joi.string().min(5).required(),
  paymentMethod: Joi.string().optional(),
});

// Validate update of order status (admin operation)
const updateStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').required(),
});

// Validate URL parameter `id` (MongoDB ObjectId)
const idParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

module.exports = {
  createOrderSchema,
  updateStatusSchema,
  idParamSchema,
};
