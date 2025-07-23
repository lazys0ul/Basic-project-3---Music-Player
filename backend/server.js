import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'
import adminRouter from './routes/adminRoutes.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)

app.get('/',(req, res) => {
    res.send('Hello from server')
})

app.listen(PORT,()=>{
    console.log(`Server connected to port ${PORT}`)
} )