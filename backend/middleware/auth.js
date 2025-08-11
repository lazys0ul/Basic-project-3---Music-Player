import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access token required' 
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id).select('-password')
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token - user not found' 
            })
        }

        req.user = user
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            })
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            })
        }
        return res.status(500).json({ 
            success: false, 
            message: 'Authentication error' 
        })
    }
}

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id).select('-password')
            if (user) {
                req.user = user
            }
        }
    } catch (error) {
        // Ignore auth errors for optional auth
    }
    next()
}

// Admin authorization middleware
const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            })
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Admin access required' 
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Authorization error' 
        })
    }
}

// Check ownership or admin
const requireOwnershipOrAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            })
        }

        // Admin can access everything
        if (req.user.role === 'admin') {
            return next()
        }

        // For regular users, they can only access their own content
        // This will be checked in the controller
        next()
    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: 'Authorization error' 
        })
    }
}

export { authenticateToken, optionalAuth, requireAdmin, requireOwnershipOrAdmin }
