#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import connectDB from '../config/mongoDB.js'
import Music from '../models/musicModel.js'
import User from '../models/userModel.js'

// Load environment variables
dotenv.config()

const UPLOADS_DIR = path.join(path.resolve(), 'uploads')

async function recoverMusicFromFiles() {
    try {
        console.log('Starting music recovery...')
        
        // Connect to database
        await connectDB()
        console.log('Connected to database')
        
        // Create or get a system user for recovered files
        let systemUser = await User.findOne({ email: 'system@musicplayer.local' })
        if (!systemUser) {
            systemUser = new User({
                username: 'SystemRecovery',
                email: 'system@musicplayer.local',
                password: 'system_recovery_user_no_login', // This won't be used for login
                role: 'admin'
            })
            await systemUser.save()
            console.log('Created system user for recovered files')
        }
        
        // Read uploads directory
        const files = fs.readdirSync(UPLOADS_DIR)
        const musicFiles = files.filter(file => 
            file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg')
        )
        
        console.log(`Found ${musicFiles.length} music files`)
        
        let recovered = 0
        
        for (const filename of musicFiles) {
            try {
                // Check if already exists in database
                const existing = await Music.findOne({ filepath: filename })
                if (existing) {
                    console.log(`Skipping ${filename} - already in database`)
                    continue
                }
                
                // Get file stats
                const filePath = path.join(UPLOADS_DIR, filename)
                const stats = fs.statSync(filePath)
                const fileSize = stats.size
                
                // Parse filename to extract music info
                // Format: timestamp_SpotiDownloader.com - Song Name - Artist.mp3
                const baseName = path.parse(filename).name
                let title = 'Unknown Title'
                let artist = 'Unknown Artist'
                
                if (baseName.includes('SpotiDownloader.com - ')) {
                    const parts = baseName.split('SpotiDownloader.com - ')[1]
                    if (parts && parts.includes(' - ')) {
                        const musicParts = parts.split(' - ')
                        title = musicParts[0]?.trim() || 'Unknown Title'
                        artist = musicParts[1]?.trim() || 'Unknown Artist'
                    }
                }
                
                // Look for corresponding image file
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
                let imageFile = 'default.jpg' // Default image
                
                // Try to find corresponding image based on similar naming pattern
                const timestampMatch = filename.match(/^(\d+)_/)
                if (timestampMatch) {
                    const timestamp = timestampMatch[1]
                    const possibleImageFiles = files.filter(file => 
                        file.startsWith(timestamp) && imageExtensions.some(e => file.endsWith(e))
                    )
                    if (possibleImageFiles.length > 0) {
                        imageFile = possibleImageFiles[0]
                    }
                }
                
                // Create music entry with all required fields
                const musicData = {
                    title,
                    artist,
                    filepath: filename,
                    imageFilepath: imageFile,
                    uploadedBy: systemUser._id,
                    fileSize: fileSize,
                    duration: null,
                    playCount: 0,
                    isActive: true
                }
                
                const newMusic = new Music(musicData)
                await newMusic.save()
                
                console.log(`✅ Recovered: ${title} by ${artist}`)
                console.log(`   📁 File: ${filename} (${(fileSize / 1024 / 1024).toFixed(2)} MB)`)
                if (imageFile !== 'default.jpg') {
                    console.log(`   🖼️  Image: ${imageFile}`)
                }
                recovered++
                
            } catch (error) {
                console.error(`❌ Error recovering ${filename}:`, error.message)
            }
        }
        
        console.log(`\n🎉 Recovery complete! Recovered ${recovered} music files`)
        
        // Show final database state
        const totalMusic = await Music.countDocuments()
        console.log(`📊 Total music records in database: ${totalMusic}`)
        
    } catch (error) {
        console.error('Recovery failed:', error)
    } finally {
        await mongoose.connection.close()
        console.log('Database connection closed')
        process.exit(0)
    }
}

// Run recovery
recoverMusicFromFiles()
