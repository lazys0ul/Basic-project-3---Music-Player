#!/usr/bin/env node
import connectDB from '../config/mongoDB.js'
import Music from '../models/musicModel.js'
import dotenv from 'dotenv'

dotenv.config()

async function clearDatabase() {
    try {
        await connectDB()
        console.log('Connected to database')
        
        const result = await Music.deleteMany({})
        console.log(`Deleted ${result.deletedCount} music records`)
        
        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

clearDatabase()
