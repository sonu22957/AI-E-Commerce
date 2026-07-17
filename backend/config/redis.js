// backend/config/redis.js

// Load environment variables (ensure a .env file exists at the project root)
require('dotenv').config();

// Choose a Redis client library. Here we use ioredis which supports clustering and sentinel.
// Install with: npm install ioredis
const Redis = require('ioredis');

// Build connection options from environment variables
const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // Optional: enable TLS if REDIS_TLS is set to true
  tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
};

// Create a singleton Redis client instance
const redisClient = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

module.exports = redisClient;
