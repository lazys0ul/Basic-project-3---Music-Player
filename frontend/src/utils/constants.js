// API Configuration Constants
export const API_CONFIG = {
  DEFAULT_BACKEND_URL: 'http://localhost:5000',
  DEFAULT_MUSIC_LIMIT: 50,
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  }
};

// API Base URL for easy import  
export const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : `${API_CONFIG.DEFAULT_BACKEND_URL}/api`;

// File Upload Constants
export const UPLOAD_CONFIG = {
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/aac'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,  // 5MB
  ALLOWED_EXTENSIONS: {
    AUDIO: ['.mp3', '.wav', '.flac', '.m4a', '.aac'],
    IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  }
};

// Player Configuration
export const PLAYER_CONFIG = {
  DEFAULT_VOLUME: 0.8,
  VOLUME_STEP: 0.1,
  SEEK_STEP: 10, // seconds
  UPDATE_FREQUENCY: 100, // ms
  CROSSFADE_DURATION: 3000, // ms
};

// UI Configuration
export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 50,
};

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME_REGEX: /^[a-zA-Z0-9_]+$/,
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MIN_TITLE_LENGTH: 1,
  MAX_TITLE_LENGTH: 200,
  MIN_ARTIST_LENGTH: 1,
  MAX_ARTIST_LENGTH: 100,
  MIN_SEARCH_LENGTH: 2,
  MAX_SEARCH_LENGTH: 100,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Please log in to continue.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'File type is not supported.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  PLAYBACK_ERROR: 'Unable to play this audio file.',
  SEARCH_ERROR: 'Search failed. Please try again.',
  DELETE_ERROR: 'Unable to delete item. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 6 characters long.',
  INVALID_USERNAME: 'Username must be 3-30 characters long and contain only letters, numbers, and underscores.',
  REQUIRED_FIELD: 'This field is required.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  REGISTER_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  UPLOAD_SUCCESS: 'File uploaded successfully!',
  DELETE_SUCCESS: 'Item deleted successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  SAVE_SUCCESS: 'Saved successfully!',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  LIBRARY: '/library',
  UPLOAD: '/upload',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'resona_auth_token',
  USER_DATA: 'resona_user_data',
  PLAYER_STATE: 'resona_player_state',
  VOLUME_SETTING: 'resona_volume',
  THEME_SETTING: 'resona_theme',
  PLAYLIST_CACHE: 'resona_playlist_cache',
};

// Theme Configuration
export const THEME_CONFIG = {
  PRIMARY_COLORS: {
    purple: '#a855f7',
    pink: '#ec4899',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
    yellow: '#f59e0b',
  },
  GLASSMORPHISM: {
    BACKDROP_BLUR: 'backdrop-blur-sm',
    BACKGROUND: 'bg-white/10',
    BORDER: 'border border-white/20',
    SHADOW: 'shadow-xl',
  },
};

// Time Format Utilities
export const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// File Size Formatter
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validation Utilities
export const validateEmail = (email) => VALIDATION.EMAIL_REGEX.test(email);
export const validatePassword = (password) => password && password.length >= VALIDATION.MIN_PASSWORD_LENGTH;
export const validateUsername = (username) => 
  username && 
  username.length >= VALIDATION.MIN_USERNAME_LENGTH && 
  username.length <= VALIDATION.MAX_USERNAME_LENGTH &&
  VALIDATION.USERNAME_REGEX.test(username);

// File Validation Utilities
export const validateAudioFile = (file) => {
  return UPLOAD_CONFIG.ALLOWED_AUDIO_TYPES.includes(file.type) && 
         file.size <= UPLOAD_CONFIG.MAX_FILE_SIZE;
};

export const validateImageFile = (file) => {
  return UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type) && 
         file.size <= UPLOAD_CONFIG.MAX_IMAGE_SIZE;
};

// URL Validation
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// Debounce Function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Generate Random ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Capitalize First Letter
export const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Truncate Text
export const truncate = (text, length = 50) => {
  return text.length > length ? text.substring(0, length) + '...' : text;
};

// Color Utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Get Contrast Color
export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};

export default {
  API_CONFIG,
  UPLOAD_CONFIG,
  PLAYER_CONFIG,
  UI_CONFIG,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ROUTES,
  STORAGE_KEYS,
  THEME_CONFIG,
  formatTime,
  formatFileSize,
  validateEmail,
  validatePassword,
  validateUsername,
  validateAudioFile,
  validateImageFile,
  isValidUrl,
  debounce,
  generateId,
  capitalize,
  truncate,
  hexToRgb,
  getContrastColor,
};
