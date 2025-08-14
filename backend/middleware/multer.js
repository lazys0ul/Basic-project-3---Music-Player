import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

// Secure filename generation
const generateSecureFilename = (originalname) => {
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalname).toLowerCase();
    return `${timestamp}_${randomBytes}${ext}`;
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        // Generate secure filename without using original filename
        const secureFilename = generateSecureFilename(file.originalname);
        cb(null, secureFilename)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['mp3', 'wav', 'flac', 'jpg', 'jpeg', 'png', 'gif', 'webp']
    const ext = path.extname(file.originalname).toLowerCase().substring(1) // Remove the dot
    const isMimeTypeValid = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')
    const isExtensionValid = allowedExtensions.includes(ext)

    // Enhanced security checks
    const hasValidFilename = file.originalname.length > 0 && 
                            file.originalname.length <= 255 &&
                            !file.originalname.includes('..') &&
                            !file.originalname.includes('/') &&
                            !file.originalname.includes('\\') &&
                            /^[\w\s.()_-]+$/.test(file.originalname); // Only allow safe characters

    if (isMimeTypeValid && isExtensionValid && hasValidFilename) {
        cb(null, true)
    } else {
        const errorMsg = `Invalid file. Security check failed for: ${file.originalname}`;
        console.warn('File upload rejected:', errorMsg);
        cb(new Error(errorMsg), false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})

export default upload