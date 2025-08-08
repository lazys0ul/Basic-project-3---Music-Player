// API Configuration Constants
export const API_CONFIG = {
  DEFAULT_BACKEND_URL: 'http://localhost:5000',
  DEFAULT_MUSIC_LIMIT: 50,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

// File Upload Constants
export const UPLOAD_CONFIG = {
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
};

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30
};

// Time Format Utilities
export const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Validation Utilities
export const validateEmail = (email) => VALIDATION.EMAIL_REGEX.test(email);
export const validatePassword = (password) => password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
export const validateUsername = (username) => 
  username && username.length >= VALIDATION.MIN_USERNAME_LENGTH && username.length <= VALIDATION.MAX_USERNAME_LENGTH;
