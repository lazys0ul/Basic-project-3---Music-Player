// Simple login attempt limiter
const loginAttempts = new Map();

/**
 * Check if user can attempt login (simple IP-based limiting)
 * @param {string} ip - User's IP address
 * @returns {boolean} - True if login attempt allowed
 */
export const canAttemptLogin = (ip) => {
  const now = Date.now();
  const key = ip;
  
  if (!loginAttempts.has(key)) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return true;
  }
  
  const attempts = loginAttempts.get(key);
  
  // Reset after 15 minutes
  if (now - attempts.firstAttempt > 15 * 60 * 1000) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
    return true;
  }
  
  // Allow up to 5 attempts per 15 minutes
  if (attempts.count >= 5) {
    return false;
  }
  
  attempts.count++;
  return true;
};

/**
 * Clear successful login attempt counter
 * @param {string} ip - User's IP address
 */
export const clearLoginAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of loginAttempts.entries()) {
    if (now - value.firstAttempt > 15 * 60 * 1000) {
      loginAttempts.delete(key);
    }
  }
}, 60 * 60 * 1000);

export default {
  canAttemptLogin,
  clearLoginAttempts
};
