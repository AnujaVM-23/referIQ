// server/middleware/rateLimit.middleware.js - Redis rate limiting
const redis = require('redis');
require('dotenv').config();

let client;
try {
  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  });
  client.connect();
} catch (error) {
  console.log('Redis not available, rate limiting disabled');
  client = null;
}

const rateLimitMiddleware = async (req, res, next) => {
  if (!client) {
    return next(); // Skip if Redis unavailable
  }

  try {
    const key = `ratelimit:${req.user.id}:${Date.now()}`;
    const count = await client.incr(key);
    await client.expire(key, 86400); // 24 hours

    if (count > 5) {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next(); // Allow request if error occurs
  }
};

module.exports = rateLimitMiddleware;
