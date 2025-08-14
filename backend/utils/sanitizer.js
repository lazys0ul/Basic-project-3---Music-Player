// Security utility functions for input sanitization

/**
 * Escapes special regex characters to prevent ReDoS attacks
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Sanitizes MongoDB query input to prevent NoSQL injection
 * @param {any} input - The input to sanitize
 * @returns {string} - Sanitized string input
 */
export const sanitizeQuery = (input) => {
  if (typeof input === 'object' || input === null || input === undefined) {
    return '';
  }
  return String(input).trim();
};

/**
 * Validates and limits query parameters
 * @param {object} query - Query parameters
 * @returns {object} - Sanitized query parameters
 */
export const sanitizeQueryParams = (query) => {
  const sanitized = {};
  
  // Sanitize search query
  if (query.search) {
    sanitized.search = escapeRegex(sanitizeQuery(query.search));
  }
  
  // Sanitize artist query
  if (query.artist) {
    sanitized.artist = escapeRegex(sanitizeQuery(query.artist));
  }
  
  // Validate and limit the limit parameter
  if (query.limit) {
    const limit = parseInt(query.limit);
    sanitized.limit = Math.min(Math.max(limit, 1), 100); // Between 1 and 100
  } else {
    sanitized.limit = 50;
  }
  
  return sanitized;
};

export default {
  escapeRegex,
  sanitizeQuery,
  sanitizeQueryParams
};
