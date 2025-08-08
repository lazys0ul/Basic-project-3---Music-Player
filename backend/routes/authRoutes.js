import express from 'express'
import { register, login } from '../controllers/userController.js'
import { validateRegister, validateLogin } from '../middleware/validation.js'

const authRouter = express.Router()

// Authentication routes
authRouter.post('/register', validateRegister, register)           
authRouter.post('/login', validateLogin, login)                 

export default authRouter