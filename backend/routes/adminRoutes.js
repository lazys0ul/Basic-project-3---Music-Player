import express from 'express'
import { register, login, uploadMusic, getMusic, deleteMusic } from '../controllers/adminController.js'
import upload from '../middleware/multer.js'

const adminRouter = express.Router()

adminRouter.post('/register', register)           // POST - creating a new admin
adminRouter.post('/login', login)                 // POST - creating a login session
adminRouter.post('/add-music', upload.fields([{name:'music', maxCount: 1}, {name: 'image', maxCount: 1}]), uploadMusic)  // POST - creating new music
adminRouter.get('/music', getMusic)               // GET - retrieving music data
adminRouter.delete('/delete-music/:id', deleteMusic)     // DELETE - deleting music

export default adminRouter