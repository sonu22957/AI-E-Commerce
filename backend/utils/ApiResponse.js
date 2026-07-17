// backend/utils/ApiResponse.js

/**
 * Standardised API response format.
 *
 * Controllers use it like:
 *   res.json(new ApiResponse(200, 'Success', payload));
 *   res.status(404).json(new ApiResponse(404, 'Not found'));
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code (200, 201, 400, 404, etc.)
   * @param {string} message - Human‑readable description of the result
   * @param {*} [data] - Optional payload (object, array, etc.)
   */
  constructor(statusCode, message, data) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

module.exports = ApiResponse;
