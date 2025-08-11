import mongoose from 'mongoose';
import musicModel from '../models/musicModel.js';
import path from 'path';
import dotenv from 'dotenv';
import validateEnvironment from '../utils/validateEnv.js';

dotenv.config();
validateEnvironment();

// Connect to MongoDB using the same configuration as the main app
const connectDB = async () => {
  try {
    let MONGO_URI;
    if (process.env.MONGO_URL.includes('mongodb+srv://') || process.env.MONGO_URL.includes('?')) {
      // For MongoDB Atlas or URLs with query parameters
      MONGO_URI = process.env.MONGO_URL;
    } else {
      // For local MongoDB without database name
      MONGO_URI = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
    }
    
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const fixImagePaths = async () => {
  try {
    console.log('Starting image path fix...');
    
    // Find all music records
    const musicRecords = await musicModel.find({});
    console.log(`Found ${musicRecords.length} music records`);
    
    let fixedCount = 0;
    
    for (const music of musicRecords) {
      if (music.imageFilepath && music.imageFilepath.includes('uploads')) {
        // Extract just the filename
        const filename = path.basename(music.imageFilepath);
        
        console.log(`Fixing: "${music.imageFilepath}" -> "${filename}"`);
        
        await musicModel.findByIdAndUpdate(music._id, {
          imageFilepath: filename
        });
        
        fixedCount++;
      }
    }
    
    console.log(`Fixed ${fixedCount} image paths`);
    
  } catch (error) {
    console.error('Error fixing image paths:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const main = async () => {
  try {
    await connectDB();
    await fixImagePaths();
  } catch (error) {
    console.error('Script failed:', error);
  }
};

main();
