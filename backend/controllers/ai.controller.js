// backend/controllers/ai.controller.js

require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../utils/logger');
const Product = require('../models/Product');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
let getModel = null;

// Only load Gemini if API key exists
if (GEMINI_API_KEY) {
  try {
    const gemini = require('../config/gemini');
    getModel = gemini.getModel;
  } catch (e) {
    logger.warn('Gemini not available:', e.message);
  }
}

/**
 * Helper — detect intent from user message WITHOUT AI (keyword matching)
 */
function detectIntent(message) {
  const msg = message.toLowerCase();

  // Add to cart intent
  if (msg.includes('add') || msg.includes('cart mein') || msg.includes('kharidna') || msg.includes('buy')) {
    return {
      intent: 'add_to_cart',
      searchQuery: msg
        .replace(/add|to|cart|mein|kharidna|buy|chahiye|me|kar|do/gi, '')
        .trim(),
    };
  }

  // Category intents
  const categories = ['electronics', 'fashion', 'gaming', 'sports', 'beauty', 'books', 'home', 'kitchen'];
  for (const cat of categories) {
    if (msg.includes(cat)) {
      return { intent: 'search', searchQuery: cat, category: cat };
    }
  }

  // Price filter
  const priceMatch = msg.match(/under\s*(\d+)|(\d+)\s*se kam|below\s*(\d+)/i);
  if (priceMatch) {
    const maxPrice = parseInt(priceMatch[1] || priceMatch[2] || priceMatch[3]);
    const cleanQ = msg.replace(/under|se kam|below|\d+/gi, '').trim();
    return { intent: 'price_filter', searchQuery: cleanQ || 'all', maxPrice };
  }

  // Recommendations
  if (
    msg.includes('best') || msg.includes('top') || msg.includes('recommend') ||
    msg.includes('dikhao') || msg.includes('popular') || msg.includes('show me')
  ) {
    return { intent: 'recommendations', searchQuery: null };
  }

  // Categories list
  if (msg.includes('categor') || msg.includes('kya hai') || msg.includes('kya kya') || msg.includes('sab kuch')) {
    return { intent: 'show_categories', searchQuery: null };
  }

  // Default: search
  return { intent: 'search', searchQuery: message };
}

/**
 * AI Chat — Intent detection + real DB product search + optional Gemini
 */
const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json(new ApiResponse(400, 'message is required'));
  }

  let intentData = detectIntent(message);

  // Try Gemini for better intent if key available
  if (getModel) {
    try {
      const intentPrompt = `You are an AI shopping assistant for SmartCart e-commerce store.
Analyze this user message: "${message}"

Reply with ONLY valid JSON (no markdown):
{
  "intent": "search" | "add_to_cart" | "recommendations" | "general" | "show_categories" | "price_filter",
  "searchQuery": "product name or keyword or null",
  "category": "category name or null",
  "maxPrice": number or null,
  "productName": "specific product for add_to_cart or null"
}`;
      const model = getModel('gemini-1.5-flash');
      const result = await model.generateContent(intentPrompt);
      let text = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
      intentData = JSON.parse(text);
    } catch (e) {
      logger.warn('Gemini intent failed, using keyword fallback:', e.message);
    }
  }

  let products = [];
  let cartResult = null;
  let aiReply = '';

  // ── Execute intent ──────────────────────────────────────────
  if (intentData.intent === 'search' || intentData.intent === 'price_filter') {
    const searchQ = intentData.searchQuery || intentData.category || message;
    const filter = {
      $or: [
        { name: { $regex: searchQ, $options: 'i' } },
        { description: { $regex: searchQ, $options: 'i' } },
        { category: { $regex: searchQ, $options: 'i' } },
      ],
    };
    if (intentData.maxPrice) filter.price = { $lte: Number(intentData.maxPrice) };
    products = await Product.find(filter).sort({ rating: -1 }).limit(6);

    if (products.length === 0) {
      aiReply = `"${searchQ}" ke liye koi product nahi mila. Kuch aur try karo! 😊`;
    } else {
      aiReply = `"${searchQ}" ke liye ${products.length} products mile! 🎯`;
    }

  } else if (intentData.intent === 'add_to_cart') {
    const name = intentData.productName || intentData.searchQuery || message;
    const cleanName = name.replace(/add|to|cart|buy|me|kar|do|chahiye/gi, '').trim();
    const product = await Product.findOne({ name: { $regex: cleanName, $options: 'i' } });

    if (!product) {
      const words = cleanName.split(' ').filter(w => w.length > 2);
      const similar = await Product.find({
        $or: words.map(w => ({
          $or: [
            { name: { $regex: w, $options: 'i' } },
            { category: { $regex: w, $options: 'i' } },
          ]
        }))
      }).limit(4);
      products = similar;
      aiReply = similar.length
        ? `"${cleanName}" exact nahi mila. Ye products try karo 👇`
        : `"${cleanName}" nahi mila. Kuch aur search karo!`;
    } else {
      products = [product];
      cartResult = { action: 'add_to_cart', product };
      aiReply = `"${product.name}" cart ke liye ready hai! 🛒 Neeche button click karo 👇`;
    }

  } else if (intentData.intent === 'recommendations') {
    const searchQ = intentData.searchQuery;
    if (searchQ) {
      products = await Product.find({
        $or: [
          { name: { $regex: searchQ, $options: 'i' } },
          { category: { $regex: searchQ, $options: 'i' } },
        ]
      }).sort({ rating: -1 }).limit(6);
      aiReply = `${searchQ} ke top products yahan hain! ⭐`;
    } else {
      products = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(6);
      aiReply = `Hamare sabse popular products! ⭐`;
    }

  } else if (intentData.intent === 'show_categories') {
    const categories = await Product.distinct('category');
    aiReply = `Hamare paas ye categories hain:\n\n${categories.map(c => `• ${c}`).join('\n')}\n\nKaunsi category mein interested ho? 😊`;

  } else {
    // General — try Gemini or give smart reply
    if (getModel) {
      try {
        const allProducts = await Product.find({}).select('name category price').limit(15);
        const productList = allProducts.map(p => `${p.name} (${p.category}) - ₹${p.price}`).join('\n');
        const generalPrompt = `You are ShopAI assistant for SmartCart store.

Our products:
${productList}

User: "${message}"

Reply helpfully in Hinglish (2-3 sentences max). If they ask about something we sell, mention it.`;
        const model = getModel('gemini-1.5-flash');
        const result = await model.generateContent(generalPrompt);
        aiReply = result.response.text();
      } catch (e) {
        aiReply = getSmartFallbackReply(message);
      }
    } else {
      aiReply = getSmartFallbackReply(message);
    }
  }

  logger.info('AI Chat processed', { intent: intentData.intent });
  res.json({ success: true, reply: aiReply, intent: intentData.intent, products, cartResult });
});

/** Smart fallback replies without Gemini */
function getSmartFallbackReply(message) {
  const msg = message.toLowerCase();
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hii') || msg.includes('namaste')) {
    return `Namaste! 👋 Main SmartCart AI hoon. Aap koi product search kar sakte ho, cart mein add kar sakte ho, ya recommendations le sakte ho!`;
  }
  if (msg.includes('help') || msg.includes('madad')) {
    return `Zaroor! Aap mujhse ye sab kar sakte ho:\n• Product search: "Show me laptops"\n• Cart add: "Add Nike shoes to cart"\n• Recommendations: "Best products dikhao"\n• Categories: "Kya categories hain?"`;
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('kitna')) {
    return `Aap price filter use kar sakte ho! Jaise: "Phones under 30000" ya "Laptops under 80000" 💰`;
  }
  return `Samajh gaya! Main aapki help karne ki koshish kar raha hoon. "Search karo" ya "Best products dikhao" type karo! 🛍️`;
}

/**
 * Smart Search — searches real products from DB
 */
const smartSearch = asyncHandler(async (req, res) => {
  const query = req.query.q || req.body.query;
  if (!query) {
    return res.status(400).json(new ApiResponse(400, 'Search query is required'));
  }
  const dbProducts = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ],
  }).limit(8);
  res.json({ success: true, results: dbProducts, count: dbProducts.length });
});

/**
 * Get AI-powered recommendations from real DB products
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const topProducts = await Product.find({}).sort({ rating: -1, numReviews: -1 }).limit(6);
  res.json({ success: true, items: topProducts });
});

/**
 * Generate a product description using Gemini AI.
 */
const generateProductDescription = asyncHandler(async (req, res) => {
  const { title, features } = req.body;
  if (!title || !features) {
    return res.status(400).json(new ApiResponse(400, 'title and features are required'));
  }
  if (!getModel) {
    return res.json(new ApiResponse(200, 'AI description generated', {
      description: `${title} - A premium product with excellent features. ${features.join(', ')}.`,
    }));
  }
  const prompt = `Write a compelling e‑commerce product description for "${title}". Features:\n${features.map(f => `- ${f}`).join('\n')}`;
  const model = getModel();
  const result = await model.generateContent(prompt);
  res.json(new ApiResponse(200, 'AI description generated', { description: result.response.text() }));
});

/**
 * Reply to review
 */
const replyToReview = asyncHandler(async (req, res) => {
  const { review } = req.body;
  if (!review) return res.status(400).json(new ApiResponse(400, 'review text is required'));
  if (!getModel) {
    return res.json(new ApiResponse(200, 'Reply generated', { reply: 'Thank you for your valuable feedback! We appreciate your review.' }));
  }
  const model = getModel();
  const result = await model.generateContent(`Reply warmly to: "${review}"`);
  res.json(new ApiResponse(200, 'AI review reply generated', { reply: result.response.text() }));
});

/**
 * Review summary
 */
const getReviewSummary = asyncHandler(async (req, res) => {
  res.json({ success: true, summary: 'Customers love this product! Highly rated with excellent quality and fast delivery.' });
});

module.exports = {
  generateProductDescription,
  replyToReview,
  smartSearch,
  getRecommendations,
  getReviewSummary,
  chat,
};
