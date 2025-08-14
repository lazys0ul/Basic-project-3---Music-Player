// Enhanced file upload security with magic number verification
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// File magic numbers (signatures) for security
const MAGIC_NUMBERS = {
  'image/jpeg': ['FFD8FF'],
  'image/png': ['89504E47'],
  'image/gif': ['474946'],
  'image/webp': ['52494646'],
  'audio/mpeg': ['494433', 'FFFB', 'FFF3', 'FFF2'],
  'audio/wav': ['52494646'],
  'audio/flac': ['664C6143']
};

/**
 * Check file magic number against declared MIME type
 * @param {Buffer} buffer - File buffer
 * @param {string} mimetype - Declared MIME type
 * @returns {boolean} - True if magic number matches
 */
const verifyMagicNumber = (buffer, mimetype) => {
  if (!MAGIC_NUMBERS[mimetype]) return false;
  
  const hex = buffer.toString('hex', 0, 8).toUpperCase();
  return MAGIC_NUMBERS[mimetype].some(magic => hex.startsWith(magic));
};

/**
 * Enhanced file validation with magic number checking
 * @param {Object} file - Multer file object
 * @returns {Promise<boolean>} - True if file is valid
 */
const enhancedFileValidation = async (file) => {
  const allowedExtensions = ['mp3', 'wav', 'flac', 'jpg', 'jpeg', 'png', 'gif', 'webp'];
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  
  // Basic validations
  const hasValidExtension = allowedExtensions.includes(ext);
  const hasValidMimeType = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/');
  const hasValidFilename = file.originalname.length > 0 && 
                          file.originalname.length <= 255 &&
                          !file.originalname.includes('..') &&
                          !file.originalname.includes('/') &&
                          !file.originalname.includes('\\') &&
                          /^[\w\s.()_-]+$/.test(file.originalname);
  
  if (!hasValidExtension || !hasValidMimeType || !hasValidFilename) {
    return false;
  }
  
  // Magic number verification (when buffer is available)
  if (file.buffer) {
    const magicNumberValid = verifyMagicNumber(file.buffer, file.mimetype);
    if (!magicNumberValid) {
      console.warn('Magic number mismatch:', { 
        filename: file.originalname, 
        declaredType: file.mimetype 
      });
      return false;
    }
  }
  
  return true;
};

// Secure filename generation
const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString('hex');
  const ext = path.extname(originalname).toLowerCase();
  return `${timestamp}_${randomBytes}${ext}`;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const secureFilename = generateSecureFilename(file.originalname);
    cb(null, secureFilename);
  }
});

const fileFilter = async (req, file, cb) => {
  try {
    const isValid = await enhancedFileValidation(file);
    if (isValid) {
      cb(null, true);
    } else {
      const errorMsg = `Security validation failed for: ${file.originalname}`;
      console.warn('File upload rejected:', errorMsg);
      cb(new Error(errorMsg), false);
    }
  } catch (error) {
    console.error('File validation error:', error);
    cb(new Error('File validation failed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 5, // Max 5 files per request
    fields: 10 // Max 10 form fields
  }
});

export default upload;
export { verifyMagicNumber, enhancedFileValidation };
