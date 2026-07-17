// backend/routes/ai.routes.js

const express = require('express');
const router = express.Router();

// Controller functions
const { 
  generateProductDescription, 
  replyToReview,
  smartSearch,
  getRecommendations,
  getReviewSummary,
  chat
} = require('../controllers/ai.controller');

// Route: POST /api/ai/description - generate product description via Gemini AI
router.post('/description', generateProductDescription);

// Route: POST /api/ai/review-reply - generate a reply to a customer review
router.post('/review-reply', replyToReview);

// Route: GET /api/ai/smart-search - get search suggestions
router.get('/smart-search', smartSearch);
router.post('/search', smartSearch); // Adding POST /search to support aiApi.js as well

// Route: GET /api/ai/recommendations - get product recommendations
router.get('/recommendations', getRecommendations);

// Route: GET /api/ai/review-summary - get review summary for a product
router.get('/review-summary', getReviewSummary);
router.get('/reviews-summary/:productId', getReviewSummary); // Adding to support aiApi.js

// Route: POST /api/ai/chat - interact with AI assistant
router.post('/chat', chat);

module.exports = router;
