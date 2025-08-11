import express from 'express'
import { 
    getAllUsers, 
    updateUserRole, 
    deleteUser, 
    getAdminStats 
} from '../controllers/userController.js'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'

const adminRouter = express.Router()

// All admin routes require authentication and admin role
adminRouter.use(authenticateToken, requireAdmin)

// User management
adminRouter.get('/users', getAllUsers)
adminRouter.put('/users/:id/role', updateUserRole)
adminRouter.delete('/users/:id', deleteUser)

// Dashboard stats
adminRouter.get('/stats', getAdminStats)

export default adminRouter
