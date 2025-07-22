import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongoDB.js'

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())


app.get('/',(req, res) => {
    res.send('Hello from server')
})

app.listen(PORT,()=>{
    console.log(`Server connected to port ${PORT}`)
} )