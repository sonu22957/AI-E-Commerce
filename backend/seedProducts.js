// backend/seedProducts.js
// Run: node seedProducts.js

require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

// picsum.photos - guaranteed working placeholder images with specific seeds
const products = [
  // ─── Electronics ─────────────────────────────────────────────
  {
    name: 'iPhone 15 Pro Max',
    price: 134900,
    description: 'Apple iPhone 15 Pro Max with A17 Pro chip, 48MP camera system, titanium design, and Action Button. 256GB storage.',
    category: 'Electronics',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/iphone15/600/500',
    ],
    rating: 4.8,
    numReviews: 312,
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 129999,
    description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, built-in S Pen, 200MP camera, and 5000mAh battery.',
    category: 'Electronics',
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1707492943822-5cfd16f6bc15?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/samsung24/600/500',
    ],
    rating: 4.7,
    numReviews: 198,
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    price: 29990,
    description: 'Industry-leading noise cancelling wireless headphones with 30-hour battery life, multipoint connection, and crystal clear hands-free calling.',
    category: 'Electronics',
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/sonywh1000/600/500',
    ],
    rating: 4.9,
    numReviews: 456,
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    price: 199900,
    description: 'MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD, Liquid Retina XDR display. Up to 18 hours battery life.',
    category: 'Electronics',
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/macbookm3/600/500',
    ],
    rating: 4.9,
    numReviews: 278,
  },
  {
    name: 'iPad Pro 12.9" M2',
    price: 112900,
    description: 'iPad Pro 12.9-inch with M2 chip, Liquid Retina XDR display, Apple Pencil 2nd gen support, 256GB WiFi+Cellular.',
    category: 'Electronics',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/ipadpro/600/500',
    ],
    rating: 4.8,
    numReviews: 189,
  },
  {
    name: 'OnePlus 12 5G',
    price: 64999,
    description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera system, 50W wireless charging, 5400mAh battery.',
    category: 'Electronics',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/oneplus12/600/500',
    ],
    rating: 4.6,
    numReviews: 143,
  },
  {
    name: 'LG OLED 55" 4K Smart TV',
    price: 139990,
    description: 'LG OLED C3 55-inch 4K Smart TV with α9 AI Processor Gen6, Dolby Vision IQ, Dolby Atmos, and Game Optimizer.',
    category: 'Electronics',
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/lgtv55/600/500',
    ],
    rating: 4.8,
    numReviews: 87,
  },
  {
    name: 'Apple Watch Series 9',
    price: 41900,
    description: 'Apple Watch Series 9 with S9 chip, Double Tap gesture, Always-On Retina display, blood oxygen monitoring, 45mm.',
    category: 'Electronics',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/applewatch9/600/500',
    ],
    rating: 4.7,
    numReviews: 324,
  },
  {
    name: 'Canon EOS R50 Mirrorless Camera',
    price: 69995,
    description: 'Canon EOS R50 24.2MP mirrorless camera with 4K video, DIGIC X processor, Dual Pixel CMOS AF II with RF-S 18-45mm lens kit.',
    category: 'Electronics',
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/canoneosr50/600/500',
    ],
    rating: 4.6,
    numReviews: 76,
  },
  {
    name: 'JBL Charge 5 Bluetooth Speaker',
    price: 14999,
    description: 'JBL Charge 5 portable waterproof Bluetooth speaker with 20 hours playtime, built-in power bank, and PartyBoost.',
    category: 'Electronics',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/jblcharge5/600/500',
    ],
    rating: 4.5,
    numReviews: 512,
  },

  // ─── Fashion ──────────────────────────────────────────────────
  {
    name: 'Nike Air Max 270',
    price: 12995,
    description: 'Nike Air Max 270 running shoes with the tallest Air unit yet for an incredibly light, breathable ride. Available in multiple colors.',
    category: 'Fashion',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/nikeairmax/600/500',
    ],
    rating: 4.6,
    numReviews: 689,
  },
  {
    name: "Levi's 511 Slim Fit Jeans",
    price: 3499,
    description: "Levi's 511 Slim Fit Jeans in classic indigo blue. Made from stretch denim for comfort and style.",
    category: 'Fashion',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/levisjeans/600/500',
    ],
    rating: 4.4,
    numReviews: 431,
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    price: 7990,
    description: 'Ray-Ban Classic Aviator sunglasses with gold metal frame and green G-15 lens. 100% UV protection. Iconic style since 1937.',
    category: 'Fashion',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/rayban/600/500',
    ],
    rating: 4.7,
    numReviews: 298,
  },
  {
    name: 'Adidas Ultraboost 23',
    price: 17999,
    description: 'Adidas Ultraboost 23 running shoes with responsive BOOST midsole, Primeknit upper, and Continental rubber outsole.',
    category: 'Fashion',
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/adidasultra/600/500',
    ],
    rating: 4.7,
    numReviews: 367,
  },
  {
    name: 'Fossil Gen 6 Smartwatch',
    price: 22995,
    description: 'Fossil Gen 6 smartwatch with Wear OS by Google, SpO2 sensor, heart rate monitor, GPS, and 3-day battery life.',
    category: 'Fashion',
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/fossilgen6/600/500',
    ],
    rating: 4.3,
    numReviews: 156,
  },

  // ─── Home & Kitchen ───────────────────────────────────────────
  {
    name: 'Dyson V15 Detect Vacuum',
    price: 52900,
    description: 'Dyson V15 Detect cordless vacuum with laser dust detection, HEPA filtration, 60 minutes runtime.',
    category: 'Home & Kitchen',
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/dysonv15/600/500',
    ],
    rating: 4.8,
    numReviews: 234,
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    price: 8499,
    description: 'Instant Pot Duo 7-in-1 electric pressure cooker — pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer. 6 Qt.',
    category: 'Home & Kitchen',
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/instantpot/600/500',
    ],
    rating: 4.7,
    numReviews: 892,
  },
  {
    name: 'Philips Air Purifier AC2887',
    price: 18999,
    description: 'Philips Air Purifier with HEPA filter, removes 99.97% of allergens, real-time air quality display, covers up to 333 sq ft.',
    category: 'Home & Kitchen',
    stock: 33,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/philipsair/600/500',
    ],
    rating: 4.5,
    numReviews: 178,
  },
  {
    name: 'IKEA KALLAX Shelf Unit',
    price: 5999,
    description: 'IKEA KALLAX 4x4 shelf unit in white. Perfect for storing books, plants, baskets and boxes.',
    category: 'Home & Kitchen',
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/ikeasofa/600/500',
    ],
    rating: 4.4,
    numReviews: 345,
  },
  {
    name: 'Nespresso Vertuo Next Coffee Machine',
    price: 13995,
    description: 'Nespresso Vertuo Next coffee machine with Centrifusion technology, 5 cup sizes, 590ml water tank.',
    category: 'Home & Kitchen',
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/nespresso/600/500',
    ],
    rating: 4.6,
    numReviews: 267,
  },

  // ─── Beauty & Personal Care ───────────────────────────────────
  {
    name: 'Dyson Airwrap Multi-Styler',
    price: 45900,
    description: 'Dyson Airwrap multi-styler with Coanda airflow to attract, wrap and style hair without extreme heat. Includes 6 attachments.',
    category: 'Beauty',
    stock: 17,
    images: [
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/dysonair/600/500',
    ],
    rating: 4.8,
    numReviews: 412,
  },
  {
    name: 'The Ordinary Niacinamide 10% + Zinc',
    price: 590,
    description: 'High-strength vitamin and mineral blemish formula. Niacinamide reduces appearance of blemishes and congestion. 30ml.',
    category: 'Beauty',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/ordinary/600/500',
    ],
    rating: 4.5,
    numReviews: 1204,
  },
  {
    name: 'Oral-B iO Series 9 Electric Toothbrush',
    price: 12999,
    description: 'Oral-B iO Series 9 electric toothbrush with magnetic charging, AI-powered brushing recognition, 7 smart modes.',
    category: 'Beauty',
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/oralb/600/500',
    ],
    rating: 4.7,
    numReviews: 189,
  },

  // ─── Sports & Fitness ─────────────────────────────────────────
  {
    name: 'Yoga Mat Premium 6mm',
    price: 1299,
    description: 'Premium non-slip yoga mat 6mm thick with alignment lines, carrying strap, and moisture-resistant surface.',
    category: 'Sports',
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/yogamat/600/500',
    ],
    rating: 4.5,
    numReviews: 678,
  },
  {
    name: 'Bowflex SelectTech 552 Dumbbells',
    price: 32999,
    description: 'Bowflex SelectTech 552 adjustable dumbbells replace 15 sets of weights. Adjust from 5 to 52.5 lbs per dumbbell.',
    category: 'Sports',
    stock: 10,
    images: [
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/bowflex/600/500',
    ],
    rating: 4.9,
    numReviews: 523,
  },
  {
    name: 'Garmin Forerunner 265 GPS Watch',
    price: 44990,
    description: 'Garmin Forerunner 265 GPS running smartwatch with AMOLED display, training readiness, HRV status, 15 days battery.',
    category: 'Sports',
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/garmin265/600/500',
    ],
    rating: 4.7,
    numReviews: 142,
  },
  {
    name: 'Whey Protein Gold Standard 2.27kg',
    price: 5499,
    description: 'Optimum Nutrition Gold Standard 100% Whey protein powder, Double Rich Chocolate, 24g protein per serving, 73 servings.',
    category: 'Sports',
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/wheyprotein/600/500',
    ],
    rating: 4.6,
    numReviews: 987,
  },

  // ─── Books ────────────────────────────────────────────────────
  {
    name: 'Atomic Habits by James Clear',
    price: 499,
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. #1 New York Times bestseller. Paperback, 320 pages.',
    category: 'Books',
    stock: 300,
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/atomichabits/600/500',
    ],
    rating: 4.9,
    numReviews: 2341,
  },
  {
    name: 'The Psychology of Money',
    price: 449,
    description: 'Timeless Lessons on Wealth, Greed, and Happiness by Morgan Housel. 256 pages.',
    category: 'Books',
    stock: 250,
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/psychmoney/600/500',
    ],
    rating: 4.8,
    numReviews: 1876,
  },
  {
    name: 'Rich Dad Poor Dad',
    price: 399,
    description: 'What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not! by Robert T. Kiyosaki. 336 pages.',
    category: 'Books',
    stock: 280,
    images: [
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/richdad/600/500',
    ],
    rating: 4.7,
    numReviews: 3120,
  },

  // ─── Gaming ───────────────────────────────────────────────────
  {
    name: 'PlayStation 5 Console',
    price: 54990,
    description: 'Sony PlayStation 5 Disc Edition with DualSense wireless controller, 825GB SSD, 4K gaming at up to 120fps, and Ray Tracing.',
    category: 'Gaming',
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/ps5console/600/500',
    ],
    rating: 4.9,
    numReviews: 891,
  },
  {
    name: 'Xbox Series X',
    price: 51990,
    description: 'Microsoft Xbox Series X 1TB gaming console with 4K gaming, 120 FPS, Quick Resume, and Xbox Game Pass compatibility.',
    category: 'Gaming',
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/xboxseriesx/600/500',
    ],
    rating: 4.8,
    numReviews: 654,
  },
  {
    name: 'Razer DeathAdder V3 Gaming Mouse',
    price: 7499,
    description: 'Razer DeathAdder V3 ultra-lightweight ergonomic gaming mouse with Focus Pro 30K sensor, 90-hour battery.',
    category: 'Gaming',
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/razermouse/600/500',
    ],
    rating: 4.7,
    numReviews: 376,
  },
  {
    name: 'Nintendo Switch OLED',
    price: 34999,
    description: 'Nintendo Switch OLED model with 7-inch OLED screen, enhanced audio, 64GB storage, and wide adjustable stand.',
    category: 'Gaming',
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600&auto=format&fit=crop',
      'https://picsum.photos/seed/nintendoswitch/600/500',
    ],
    rating: 4.8,
    numReviews: 567,
  },
];

async function seedProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Delete ALL old products first
    const deleted = await Product.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} old products\n`);

    // Insert fresh products with images
    console.log(`🌱 Inserting ${products.length} products with images...`);
    const inserted = await Product.insertMany(products);
    console.log(`\n✅ Successfully inserted ${inserted.length} products!\n`);

    // Show summary
    const categories = {};
    inserted.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    console.log('📊 Products by Category:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} products`);
    });

    const total = await Product.countDocuments();
    console.log(`\n🛒 Total products in DB now: ${total}`);
    console.log(`🖼️  All products now have images array with 2 image URLs each`);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

seedProducts();
