// backend/middleware/validator.js

/**
 * Validation middleware utilizing Joi schemas.
 *
 * Example usage:
 *   const Joi = require('joi');
 *   const schema = Joi.object({ name: Joi.string().required() });
 *   router.post('/example', validate(schema), controller);
 */
const Joi = require('joi');

/**
 * Validate request body against a Joi schema.
 * Returns 400 with error details on failure.
 */
function validate(schema, options = { abortEarly: false, stripUnknown: true }) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    req.body = value; // sanitized data
    next();
  };
}

/**
 * Validate arbitrary request object (params, query, etc.)
 */
function validateObject(schema, source = 'body', options = { abortEarly: false }) {
  return (req, res, next) => {
    const obj = req[source];
    const { error, value } = schema.validate(obj, options);
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }
    req[source] = value;
    next();
  };
}

module.exports = { validate, validateObject };
