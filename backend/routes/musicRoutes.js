import express from 'express'
import { uploadMusic, getMusic, deleteMusic } from '../controllers/userController.js'
import { authenticateToken, optionalAuth } from '../middleware/auth.js'
import { validateMusicUpload } from '../middleware/validation.js'
import upload from '../middleware/multer.js'

const musicRouter = express.Router()

// Public routes with optional auth context
musicRouter.get('/', optionalAuth, getMusic) 

// Protected routes (authentication required) with validation
musicRouter.post('/add-music', 
    authenticateToken, 
    upload.fields([{name:'music', maxCount: 1}, {name: 'image', maxCount: 1}]), 
    validateMusicUpload,
    uploadMusic
)  

musicRouter.delete('/delete-music/:id', 
    authenticateToken, 
    deleteMusic
) 

export default musicRouter
