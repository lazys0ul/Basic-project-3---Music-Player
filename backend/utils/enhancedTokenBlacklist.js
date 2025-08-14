// Enhanced token blacklist with persistent storage
import jwt from 'jsonwebtoken';
import logger from './logger.js';
import mongoose from 'mongoose';

// Blacklisted Token Schema (persistent storage)
const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  blacklistedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } }
});

const BlacklistedToken = mongoose.model('BlacklistedToken', blacklistedTokenSchema);

// In-memory cache for performance
const memoryBlacklist = new Set();

/**
 * Add token to blacklist with persistent storage
 * @param {string} token - JWT token to blacklist
 */
export const blacklistToken = async (token) => {
  try {
    // Decode token to get expiration
    const decoded = jwt.decode(token);
    const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    // Add to persistent storage
    await BlacklistedToken.create({
      token,
      expiresAt
    });
    
    // Add to memory cache
    memoryBlacklist.add(token);
    
    logger.info('Token blacklisted (persistent)', { 
      tokenPrefix: token.substring(0, 10) + '...',
      expiresAt 
    });
  } catch (error) {
    logger.error('Failed to blacklist token', { error: error.message });
    // Fallback to memory-only
    memoryBlacklist.add(token);
  }
};

/**
 * Check if token is blacklisted (checks both memory and database)
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is blacklisted
 */
export const isTokenBlacklisted = async (token) => {
  // Fast memory check first
  if (memoryBlacklist.has(token)) {
    return true;
  }
  
  // Database check for distributed systems
  try {
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      // Cache in memory for future requests
      memoryBlacklist.add(token);
      return true;
    }
  } catch (error) {
    logger.error('Error checking token blacklist', { error: error.message });
    // On database error, allow the token (fail open for availability)
  }
  
  return false;
};

/**
 * Load blacklisted tokens into memory cache on startup
 */
export const initializeBlacklist = async () => {
  try {
    const tokens = await BlacklistedToken.find({}, 'token').limit(10000);
    tokens.forEach(({ token }) => memoryBlacklist.add(token));
    logger.info('Blacklist cache initialized', { count: tokens.length });
  } catch (error) {
    logger.error('Failed to initialize blacklist cache', { error: error.message });
  }
};

/**
 * Clean up expired tokens (runs automatically via MongoDB TTL)
 */
export const cleanupBlacklist = async () => {
  // MongoDB handles cleanup automatically with TTL index
  // This function is kept for compatibility and manual cleanup if needed
  const deletedCount = await BlacklistedToken.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  
  if (deletedCount.deletedCount > 0) {
    logger.info('Manual blacklist cleanup completed', { deletedCount: deletedCount.deletedCount });
    // Clear memory cache to force reload
    memoryBlacklist.clear();
    await initializeBlacklist();
  }
};

export default {
  blacklistToken,
  isTokenBlacklisted,
  initializeBlacklist,
  cleanupBlacklist,
  BlacklistedToken
};
