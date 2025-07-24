import adminModel from "../models/adminModel.js"
import musicModel from "../models/musicModel.js"  // ✅ Add this line
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { title } from "process"
import path from 'path'

const register = async (req, res) => {
  try {
      const {username, email, password} = req.body

      if (!username || !email || !password) {
         return res.status(400).json({success: false, message:"All fields are required"})
      }

      const existingUser = await adminModel.findOne({ email })
       if (existingUser) {
          return res.status(400).json({success: false, message:"User already exists"});
       }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new adminModel({
            username,
            email,
            password: hashedPassword
        })
    
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }

        res.status(201).json({ success: true, message: "User registered successfully", user: userResponse,token })

    } catch (error) {
      console.log(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

const login = async (req, res) => {
    try {

       const { email, password } = req.body

       if (!email || !password) {
          return res.status(400).json({ success: false, message: "All fields are required" })
       }

        const user = await adminModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" })
        } 

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        res.status(200).json({ success: true, message: "User logged in successfully", user: userResponse, token })



    } catch (error) {
      console.log(error) 
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const uploadMusic = async (req, res) => {
    try {

        const { title, artist} = req.body

        if (!title || !artist ){
            return res.status(400).json({ success: false, message: "All fields are required" })
        }
        
        const musicFile = req.files.music?.[0]
        const imageFile = req.files.image?.[0]

        if (!musicFile) {
            return res.status(400).json({ success: false, message: "No music file detected" })
        }

        if (!imageFile) {
            return res.status(400).json({ success: false, message: "No image file detected" })
        }

        const allowedExtensions = ['.mp3', '.wav', '.flac', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const musicExt = path.extname(musicFile.originalname).toLowerCase()
        const imageExt = path.extname(imageFile.originalname).toLowerCase()

        if (!allowedExtensions.includes(musicExt) || !allowedExtensions.includes(imageExt)) {
            return res.status(400).json({ success: false, message: "Invalid file type. Only audio (.mp3, .wav, .flac) and image files (.jpg, .jpeg, .png, .gif, .webp) are allowed." });
        }

        const filePath = musicFile.path
        const imageFilePath = imageFile.path

        const music = new musicModel({
            title,
            artist,
            filepath: filePath,
            imageFilepath: imageFilePath
        })

        await music.save()

        res.status(201).json({ success: true, message: "Your music is uploaded successfully", music })


    } catch (error) {
       console.log(error) 
        res.status(500).json({ success: false, message: "Internal server error" }) 
    }
}


export { register, login, uploadMusic}