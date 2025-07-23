import express from 'express'
import { register, login, uploadMusic } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'

const adminRouter = express.Router()

adminRouter.post('/register', register)
adminRouter.post('/login', login)
adminRouter.post('/add-music', upload.fields([{name:'music', maxCount: 1}, {name: 'image', maxCount: 1}]), uploadMusic)


export default adminRouter