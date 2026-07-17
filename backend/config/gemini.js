// backend/config/gemini.js

// Load environment variables (ensure a .env file exists at the project root)
require('dotenv').config();

// Google Gemini client library. Install with:
//   npm install @google/generative-ai
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Retrieve the API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set. Gemini requests will fail.');
}

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Get a Gemini model instance.
 * @param {string} [modelName='gemini-pro'] - The model name to use (e.g., 'gemini-pro', 'gemini-1.5-flash').
 * @returns {GenerativeModel} A configured Gemini model ready for generation calls.
 */
function getModel(modelName = 'gemini-1.5-flash') {
  return genAI.getGenerativeModel({ model: modelName });
}

module.exports = {
  getModel,
  genAI,
};
