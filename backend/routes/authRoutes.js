import express from 'express'
import { registerUser, loginUser, logout } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/auth.js'
import { validateRegister, validateLogin } from '../middleware/validation.js'

const authRouter = express.Router()

// Authentication routes
authRouter.post('/register', validateRegister, registerUser)           
authRouter.post('/login', validateLogin, loginUser)
authRouter.post('/logout', authenticateToken, logout)

export default authRouter