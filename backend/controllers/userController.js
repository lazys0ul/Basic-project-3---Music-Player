import userModel from "../models/userModel.js"
import musicModel from "../models/musicModel.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import logger from '../utils/logger.js'

// Input validation helpers
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const validatePassword = (password) => {
    return password && password.length >= 6
}

const validateUsername = (username) => {
    return username && username.length >= 3 && username.length <= 30
}

const register = async (req, res) => {
  try {
      const {username, email, password} = req.body

      // Input validation
      if (!username || !email || !password) {
         return res.status(400).json({success: false, message:"All fields are required"})
      }

      if (!validateUsername(username)) {
         return res.status(400).json({success: false, message:"Username must be 3-30 characters long"})
      }

      if (!validateEmail(email)) {
         return res.status(400).json({success: false, message:"Please provide a valid email address"})
      }

      if (!validatePassword(password)) {
         return res.status(400).json({success: false, message:"Password must be at least 6 characters long"})
      }

      const existingUser = await userModel.findOne({ email })
       if (existingUser) {
          return res.status(400).json({success: false, message:"User already exists"});
       }

        const salt = await bcrypt.genSalt(12) // Increased from 10 to 12 for better security
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'user' // Default role
        })
    
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        // More secure cookie settings
        res.cookie('token', token, {
            httpOnly: true, // ✅ Fixed: Now secure
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        }

        res.status(201).json({ success: true, message: "User registered successfully", user: userResponse, token })

    } catch (error) {
        logger.error('Registration failed', { error: error.message, email: req.body?.email })
        res.status(500).json({ success: false, message: "Server error" })
    }
}

const login = async (req, res) => {
    try {
       const { email, password } = req.body

       // Input validation
       if (!email || !password) {
          return res.status(400).json({ success: false, message: "Email and password are required" })
       }

       if (!validateEmail(email)) {
          return res.status(400).json({ success: false, message: "Please provide a valid email address" })
       }

        const user = await userModel.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" }) // Don't reveal if user exists
        } 

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        // More secure cookie settings
        res.cookie('token', token, {
            httpOnly: true, // ✅ Fixed: Now secure
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }

        // Update last login
        await userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() })

        res.status(200).json({ success: true, message: "User logged in successfully", user: userResponse, token })

    } catch (error) {
        logger.error('Login failed', { error: error.message, email: req.body?.email })
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const uploadMusic = async (req, res) => {
    try {
        const { title, artist } = req.body

        // Input validation
        if (!title || !artist) {
            return res.status(400).json({ success: false, message: "Title and artist are required" })
        }

        if (title.trim().length < 1 || artist.trim().length < 1) {
            return res.status(400).json({ success: false, message: "Title and artist cannot be empty" })
        }
        
        const musicFile = req.files.music?.[0]
        const imageFile = req.files.image?.[0]

        if (!musicFile) {
            return res.status(400).json({ success: false, message: "Music file is required" })
        }

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Cover image is required" })
        }

        // File type validation (already handled by multer, but double-check)
        const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/flac']
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

        if (!allowedAudioTypes.includes(musicFile.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid audio file type. Only MP3, WAV, and FLAC are allowed." })
        }

        if (!allowedImageTypes.includes(imageFile.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid image file type. Only JPEG, PNG, and WebP are allowed." })
        }

        // Check if music with same title and artist already exists
        const existingMusic = await musicModel.findOne({ 
            title: title.trim(), 
            artist: artist.trim() 
        })

        if (existingMusic) {
            return res.status(400).json({ success: false, message: "Music with this title and artist already exists" })
        }

        const filePath = musicFile.path
        const imageFilePath = imageFile.path

        const music = new musicModel({
            title: title.trim(),
            artist: artist.trim(),
            filepath: filePath,
            imageFilepath: path.basename(imageFilePath), // Store only the filename
            uploadedBy: req.user.id, // Track who uploaded
            fileSize: musicFile.size,
            duration: null // Could be populated later with metadata
        })

        await music.save()

        // Don't expose file paths in response
        const musicResponse = {
            id: music._id,
            title: music.title,
            artist: music.artist,
            uploadedBy: req.user.username,
            createdAt: music.createdAt
        }

        res.status(201).json({ success: true, message: "Music uploaded successfully", music: musicResponse })

    } catch (error) {
        logger.error('Music upload failed', { error: error.message, userId: req.user?.id })
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
}

const getMusic = async (req, res) => {
    try {
        const { search, artist, limit = 50 } = req.query
        
        // Build search query
        let query = {}
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { artist: { $regex: search, $options: 'i' } }
            ]
        }
        if (artist) {
            query.artist = { $regex: artist, $options: 'i' }
        }
        
        const music = await musicModel
            .find(query)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'username')
            
        // Return empty array if no music found instead of 404
        if (!music || music.length === 0) {
            logger.info('No music found in database', { search, artist })
            return res.status(200).json({ success: true, message: "No music found", music: [] })
        }

        logger.info('Music retrieved', { count: music.length, search, artist })
        
        // Debug: Log the first track's image path
        if (music.length > 0) {
            logger.info('Sample track image path', { 
                title: music[0].title, 
                imageFilepath: music[0].imageFilepath 
            })
        }
        
        res.status(200).json({ success: true, message: "Music retrieved successfully", music })

    } catch (error) {
        logger.error('Get music failed', { error: error.message })
        res.status(500).json({ success: false, message: "Internal server error"  })
    }
}


const deleteMusic = async (req, res) => {
    try {
        const { id } = req.params;

        const music = await musicModel.findById(id);
        if (!music) {
            return res.status(404).json({ success: false, message: "Music not found" })
        }

        // Check ownership or admin rights
        if (req.user.role !== 'admin' && music.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "You can only delete your own uploads" 
            })
        }

        // Delete files from disk
        try {
            if (music.filepath && fs.existsSync(music.filepath)) {
                fs.unlinkSync(music.filepath)
            }
            if (music.imageFilepath && fs.existsSync(music.imageFilepath)) {
                fs.unlinkSync(music.imageFilepath)
            }
        } catch (fileError) {
            logger.warn('Failed to delete files from disk', { 
                error: fileError.message, 
                musicId: id,
                filepath: music.filepath,
                imageFilepath: music.imageFilepath
            })
        }

        // Delete from database
        await musicModel.findByIdAndDelete(id);

        logger.info('Music deleted successfully', { musicId: id, title: music.title, deletedBy: req.user.username })
        res.status(200).json({ success: true, message: "Music deleted successfully", music })

    } catch (error) {
        logger.error('Music deletion failed', { error: error.message, musicId: req.params?.id })
        res.status(500).json({ success: false, message: "Internal server error" })
        
    }
}

// Admin Controllers
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query
        
        let query = {}
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
        }

        const users = await userModel
            .find(query)
            .select('-password')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 })

        const totalUsers = await userModel.countDocuments(query)

        res.status(200).json({
            success: true,
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalUsers,
                pages: Math.ceil(totalUsers / parseInt(limit))
            }
        })

    } catch (error) {
        logger.error('Get all users failed', { error: error.message })
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params
        const { role } = req.body

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid role. Must be 'user' or 'admin'" 
            })
        }

        // Prevent admin from demoting themselves
        if (req.user.id === id && role === 'user') {
            return res.status(400).json({ 
                success: false, 
                message: "You cannot demote yourself" 
            })
        }

        const user = await userModel.findByIdAndUpdate(
            id, 
            { role }, 
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        logger.info('User role updated', { 
            userId: id, 
            newRole: role, 
            updatedBy: req.user.username 
        })

        res.status(200).json({ 
            success: true, 
            message: "User role updated successfully", 
            user 
        })

    } catch (error) {
        logger.error('Update user role failed', { error: error.message })
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        // Prevent admin from deleting themselves
        if (req.user.id === id) {
            return res.status(400).json({ 
                success: false, 
                message: "You cannot delete your own account" 
            })
        }

        const user = await userModel.findById(id)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Delete user's music files
        const userMusic = await musicModel.find({ uploadedBy: id })
        for (const music of userMusic) {
            try {
                if (music.filepath && fs.existsSync(music.filepath)) {
                    fs.unlinkSync(music.filepath)
                }
                if (music.imageFilepath && fs.existsSync(music.imageFilepath)) {
                    fs.unlinkSync(music.imageFilepath)
                }
            } catch (fileError) {
                logger.warn('Failed to delete user music files', { 
                    error: fileError.message, 
                    musicId: music._id 
                })
            }
        }

        // Delete user's music records
        await musicModel.deleteMany({ uploadedBy: id })
        
        // Delete user account
        await userModel.findByIdAndDelete(id)

        logger.info('User deleted successfully', { 
            userId: id, 
            username: user.username, 
            deletedBy: req.user.username 
        })

        res.status(200).json({ 
            success: true, 
            message: "User and their content deleted successfully" 
        })

    } catch (error) {
        logger.error('Delete user failed', { error: error.message })
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

const getAdminStats = async (req, res) => {
    try {
        const [totalUsers, totalMusic, totalAdmins, recentUsers] = await Promise.all([
            userModel.countDocuments(),
            musicModel.countDocuments(),
            userModel.countDocuments({ role: 'admin' }),
            userModel.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .limit(5)
        ])

        const stats = {
            totalUsers,
            totalMusic,
            totalAdmins,
            recentUsers
        }

        res.status(200).json({ success: true, stats })

    } catch (error) {
        logger.error('Get admin stats failed', { error: error.message })
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export { 
    register, 
    login, 
    uploadMusic, 
    getMusic, 
    deleteMusic,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getAdminStats
}