const redis = require('redis');

let redisClient = null;

const initRedis = async () => {
  try {
    console.log('Initializing Redis connection...');
    
    // Create Redis client
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: false // Disable auto-reconnection
      }
    });

    // Error handling
    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err.message);
      // Disconnect on error to prevent reconnection attempts
      if (redisClient.isOpen) {
        redisClient.disconnect().catch(() => {});
      }
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
    });

    redisClient.on('ready', () => {
      console.log('Redis client ready');
    });

    // Connect to Redis with timeout
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 2000)
      )
    ]);

    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error.message);
    console.log('Redis is not available. Continuing without cache...');
    console.log('To enable caching, install Redis: brew install redis && brew services start redis');
    
    // Clean up the client
    if (redisClient) {
      try {
        await redisClient.disconnect();
      } catch (e) {
        // Ignore cleanup errors
      }
      redisClient = null;
    }
    
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

// Cache helper functions
const cacheHelpers = {
  // Get cached data
  get: async (key) => {
    if (!redisClient || !redisClient.isOpen) return null;
    
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  },

  // Set cache with TTL (time to live in seconds)
  set: async (key, value, ttl = 300) => {
    if (!redisClient || !redisClient.isOpen) return false;
    
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  },

  // Delete cache
  del: async (key) => {
    if (!redisClient || !redisClient.isOpen) return false;
    
    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  },

  // Delete multiple keys by pattern
  delPattern: async (pattern) => {
    if (!redisClient || !redisClient.isOpen) return false;
    
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('Redis DEL PATTERN error:', error);
      return false;
    }
  },

  // Check if key exists
  exists: async (key) => {
    if (!redisClient || !redisClient.isOpen) return false;
    
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  },

  // Increment counter
  incr: async (key) => {
    if (!redisClient || !redisClient.isOpen) return null;
    
    try {
      return await redisClient.incr(key);
    } catch (error) {
      console.error('Redis INCR error:', error);
      return null;
    }
  },

  // Set expiry on existing key
  expire: async (key, ttl) => {
    if (!redisClient || !redisClient.isOpen) return false;
    
    try {
      await redisClient.expire(key, ttl);
      return true;
    } catch (error) {
      console.error('Redis EXPIRE error:', error);
      return false;
    }
  }
};

module.exports = {
  initRedis,
  getRedisClient,
  cache: cacheHelpers
};
