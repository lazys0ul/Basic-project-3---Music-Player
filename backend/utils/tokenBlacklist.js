// Token blacklist system for secure logout
import logger from './logger.js';

// In-memory token blacklist (in production, use Redis or database)
const blacklistedTokens = new Set();

/**
 * Add token to blacklist
 * @param {string} token - JWT token to blacklist
 */
export const blacklistToken = (token) => {
  blacklistedTokens.add(token);
  logger.info('Token blacklisted', { tokenPrefix: token.substring(0, 10) + '...' });
};

/**
 * Check if token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {boolean} - True if token is blacklisted
 */
export const isTokenBlacklisted = (token) => {
  return blacklistedTokens.has(token);
};

/**
 * Clean up expired tokens from blacklist (run periodically)
 * This should be enhanced with actual token expiration checking
 */
export const cleanupBlacklist = () => {
  // In production, implement proper cleanup based on token expiration
  if (blacklistedTokens.size > 10000) {
    blacklistedTokens.clear();
    logger.info('Token blacklist cleared due to size limit');
  }
};

// Clean up every hour
setInterval(cleanupBlacklist, 60 * 60 * 1000);

export default {
  blacklistToken,
  isTokenBlacklisted,
  cleanupBlacklist
};
