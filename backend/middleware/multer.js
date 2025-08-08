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
    // Fix the allowed extensions array - remove the dots from image extensions
    const allowedExtensions = ['mp3', 'wav', 'flac', 'jpg', 'jpeg', 'png', 'gif', 'webp']
    const ext = path.extname(file.originalname).toLowerCase().substring(1) // Remove the dot
    const isMimeTypeValid = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')
    const isExtensionValid = allowedExtensions.includes(ext)

    if (isMimeTypeValid && isExtensionValid) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid file type. File: ${file.originalname}, Type: ${file.mimetype}, Extension: ${ext}`))
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