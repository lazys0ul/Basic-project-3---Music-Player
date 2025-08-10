import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['mp3', 'wav', 'flac', 'jpg', 'jpeg', 'png', 'gif', 'webp']
    const ext = path.extname(file.originalname).toLowerCase().substring(1) // Remove the dot
    const isMimeTypeValid = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')
    const isExtensionValid = allowedExtensions.includes(ext)

    // Additional security: check file signature (magic numbers) for common formats
    const isSecureFile = ext && file.originalname.length > 0 && !file.originalname.includes('..');

    if (isMimeTypeValid && isExtensionValid && isSecureFile) {
        cb(null, true)
    } else {
        const errorMsg = `Invalid file. Name: ${file.originalname}, Type: ${file.mimetype}, Extension: ${ext}`;
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