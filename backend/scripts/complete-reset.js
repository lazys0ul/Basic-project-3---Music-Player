import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import Music from '../models/musicModel.js';
import User from '../models/userModel.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/musicplayer', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

// Clean up uploads directory
async function cleanUploads() {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    try {
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.log(`\n🧹 Found ${files.length} files in uploads directory`);
            
            for (const file of files) {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${stats.size} bytes)`);
                fs.unlinkSync(filePath);
            }
            
            console.log('✅ All files deleted from uploads directory');
        } else {
            console.log('📁 Uploads directory not found, creating...');
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
    } catch (error) {
        console.error('❌ Error cleaning uploads:', error);
    }
}

// Clear database
async function clearDatabase() {
    try {
        const musicCount = await Music.countDocuments();
        const userCount = await User.countDocuments();
        
        console.log(`\n🗃️  Database status:`);
        console.log(`   - Music records: ${musicCount}`);
        console.log(`   - User records: ${userCount}`);
        
        if (musicCount > 0) {
            await Music.deleteMany({});
            console.log('✅ All music records deleted');
        }
        
        // Keep users but clear their music references
        await User.updateMany({}, { $set: { uploadedMusic: [] } });
        console.log('✅ User music references cleared');
        
    } catch (error) {
        console.error('❌ Error clearing database:', error);
    }
}

// Main execution
async function completeReset() {
    console.log('🔄 Starting complete system reset...\n');
    
    await connectDB();
    await cleanUploads();
    await clearDatabase();
    
    console.log('\n✨ Complete reset finished!');
    console.log('📝 Next steps:');
    console.log('   1. Upload new music files through the UI');
    console.log('   2. Test streaming functionality');
    console.log('   3. Verify everything works as expected');
    
    await mongoose.connection.close();
    console.log('📡 Database connection closed');
}

completeReset().catch(console.error);
