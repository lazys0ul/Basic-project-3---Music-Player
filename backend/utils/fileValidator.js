import fs from 'fs';
import path from 'path';
import logger from './logger.js';

// File type detection using magic numbers (more secure than just mime type)
const MAGIC_NUMBERS = {
  // Audio formats
  'MP3': [0xFF, 0xFB],      // MP3 (MPEG)
  'MP3_ID3': [0x49, 0x44, 0x33], // MP3 with ID3 tag
  'WAV': [0x52, 0x49, 0x46, 0x46], // RIFF header (WAV)
  'FLAC': [0x66, 0x4C, 0x61, 0x43], // fLaC
  'M4A': [0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70], // M4A/MP4 audio
  
  // Image formats  
  'JPEG': [0xFF, 0xD8, 0xFF],
  'PNG': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  'GIF': [0x47, 0x49, 0x46],
  'WEBP': [0x52, 0x49, 0x46, 0x46] // First 4 bytes, followed by file size, then WEBP
};

// Allowed file configurations
const FILE_CONFIG = {
  AUDIO: {
    MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20MB
    ALLOWED_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp4', 'audio/aac'],
    ALLOWED_EXTENSIONS: ['.mp3', '.wav', '.flac', '.m4a', '.aac'],
    MAGIC_NUMBERS: ['MP3', 'MP3_ID3', 'WAV', 'FLAC', 'M4A']
  },
  IMAGE: {
    MAX_SIZE: parseInt(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    MAGIC_NUMBERS: ['JPEG', 'PNG', 'GIF', 'WEBP']
  }
};

/**
 * Read the first few bytes of a file to check magic numbers
 */
const readFileHeader = (filePath, bytesToRead = 16) => {
  try {
    const buffer = Buffer.alloc(bytesToRead);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, bytesToRead, 0);
    fs.closeSync(fd);
    return buffer;
  } catch (error) {
    logger.error('Error reading file header', { filePath, error: error.message });
    return null;
  }
};

/**
 * Check if file matches expected magic numbers
 */
const checkMagicNumber = (filePath, allowedMagicNumbers) => {
  const header = readFileHeader(filePath);
  if (!header) return false;

  return allowedMagicNumbers.some(magicType => {
    const magicBytes = MAGIC_NUMBERS[magicType];
    if (!magicBytes) return false;

    // Special case for WEBP (needs additional check)
    if (magicType === 'WEBP') {
      const riffMatch = magicBytes.every((byte, index) => header[index] === byte);
      if (!riffMatch) return false;
      // Check for 'WEBP' at bytes 8-11
      const webpSignature = [0x57, 0x45, 0x42, 0x50]; // 'WEBP'
      return webpSignature.every((byte, index) => header[8 + index] === byte);
    }

    // Check if file header starts with magic number
    return magicBytes.every((byte, index) => header[index] === byte);
  });
};

/**
 * Comprehensive file validation
 */
const validateFile = (file, fileType) => {
  const errors = [];
  const config = FILE_CONFIG[fileType.toUpperCase()];
  
  if (!config) {
    return { isValid: false, errors: ['Invalid file type configuration'] };
  }

  // Check if file exists and has path
  if (!file || !file.path) {
    return { isValid: false, errors: ['File path is required'] };
  }

  // Check file size
  if (file.size > config.MAX_SIZE) {
    errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed (${formatFileSize(config.MAX_SIZE)})`);
  }

  // Check minimum file size (avoid empty files)
  if (file.size < 1024) { // 1KB minimum
    errors.push('File is too small or corrupted');
  }

  // Check MIME type
  if (!config.ALLOWED_TYPES.includes(file.mimetype)) {
    errors.push(`MIME type '${file.mimetype}' is not allowed`);
  }

  // Check file extension
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!config.ALLOWED_EXTENSIONS.includes(fileExtension)) {
    errors.push(`File extension '${fileExtension}' is not allowed`);
  }

  // Check magic number (file signature)
  if (!checkMagicNumber(file.path, config.MAGIC_NUMBERS)) {
    errors.push('File signature does not match expected type (possible malicious file)');
  }

  // Check filename for malicious patterns
  const filename = file.originalname;
  const maliciousPatterns = [
    /\.\./,           // Path traversal
    /[<>:"|?*]/,      // Invalid characters
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Windows reserved names
    /\.(exe|bat|cmd|scr|pif|msi|dll|jar|sh|php|asp|jsp)$/i // Executable extensions
  ];

  if (maliciousPatterns.some(pattern => pattern.test(filename))) {
    errors.push('Filename contains invalid or potentially malicious characters');
  }

  // Additional audio-specific validation
  if (fileType.toUpperCase() === 'AUDIO') {
    errors.push(...validateAudioFile(file));
  }

  // Additional image-specific validation
  if (fileType.toUpperCase() === 'IMAGE') {
    errors.push(...validateImageFile(file));
  }

  return {
    isValid: errors.length === 0,
    errors,
    fileInfo: {
      originalName: file.originalname,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      mimetype: file.mimetype,
      extension: fileExtension
    }
  };
};

/**
 * Audio-specific validation
 */
const validateAudioFile = (file) => {
  const errors = [];
  
  // Check for extremely large audio files (might be videos)
  if (file.size > 50 * 1024 * 1024) { // 50MB
    errors.push('Audio file is unusually large. Please ensure it\'s not a video file.');
  }

  return errors;
};

/**
 * Image-specific validation
 */
const validateImageFile = (file) => {
  const errors = [];
  
  // Check reasonable image dimensions (this would require image processing library)
  // For now, just basic size checks
  
  // Check for extremely large images
  if (file.size > 20 * 1024 * 1024) { // 20MB
    errors.push('Image file is too large. Please compress the image.');
  }

  return errors;
};

/**
 * Format file size for display
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Clean up uploaded files (in case of validation failure)
 */
const cleanupFiles = (files) => {
  if (!Array.isArray(files)) {
    files = [files];
  }

  files.forEach(file => {
    if (file && file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
        logger.info('Cleaned up uploaded file', { path: file.path });
      } catch (error) {
        logger.error('Failed to cleanup file', { path: file.path, error: error.message });
      }
    }
  });
};

/**
 * Sanitize filename
 */
const sanitizeFilename = (filename) => {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .replace(/\.\./g, '')      // Remove path traversal
    .replace(/^\.+/, '')       // Remove leading dots
    .replace(/\.+$/, '')       // Remove trailing dots
    .substring(0, 255);        // Limit length
};

/**
 * Generate secure filename
 */
const generateSecureFilename = (originalName) => {
  const extension = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}${extension}`;
};

/**
 * Check if upload directory exists and create if needed
 */
const ensureUploadDirectory = (uploadPath) => {
  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
      logger.info('Created upload directory', { path: uploadPath });
    }
    return true;
  } catch (error) {
    logger.error('Failed to create upload directory', { path: uploadPath, error: error.message });
    return false;
  }
};

/**
 * Calculate directory size
 */
const getDirectorySize = (dirPath) => {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += getDirectorySize(filePath); // Recursive
      }
    });
  } catch (error) {
    logger.error('Error calculating directory size', { dirPath, error: error.message });
  }
  
  return totalSize;
};

export {
  validateFile,
  cleanupFiles,
  sanitizeFilename,
  generateSecureFilename,
  ensureUploadDirectory,
  getDirectorySize,
  formatFileSize,
  FILE_CONFIG
};

export default {
  validateFile,
  cleanupFiles,
  sanitizeFilename,
  generateSecureFilename,
  ensureUploadDirectory,
  getDirectorySize,
  formatFileSize,
  FILE_CONFIG
};
