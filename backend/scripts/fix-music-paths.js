import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import musicModel from '../models/musicModel.js';

dotenv.config();

const fixMusicPaths = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB Atlas');

        // Get all music without file paths
        const musicRecords = await musicModel.find({});
        console.log(`\n🔍 Found ${musicRecords.length} music records to check`);

        // Get all files in uploads directory
        const uploadsDir = path.join(process.cwd(), 'uploads');
        const files = fs.readdirSync(uploadsDir);
        const audioFiles = files.filter(file => file.endsWith('.mp3'));
        const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|webp)$/i));

        console.log(`\n📁 Found ${audioFiles.length} audio files and ${imageFiles.length} image files`);

        let fixedCount = 0;

        for (const record of musicRecords) {
            console.log(`\n🎵 Processing: ${record.title} by ${record.artist}`);
            
            // Find matching audio file
            const audioFile = audioFiles.find(file => {
                const fileName = file.toLowerCase();
                const title = record.title.toLowerCase();
                const artist = record.artist.toLowerCase();
                
                return fileName.includes(title) || fileName.includes(artist) ||
                       fileName.includes(title.replace(/\s+/g, '')) ||
                       fileName.includes(artist.replace(/\s+/g, ''));
            });

            // Find matching image file
            const imageFile = imageFiles.find(file => {
                const fileName = file.toLowerCase().replace(/\.(jpg|jpeg|png|webp)$/i, '');
                const title = record.title.toLowerCase();
                const artist = record.artist.toLowerCase();
                
                return fileName.includes(title) || fileName.includes(artist) ||
                       fileName.includes(title.replace(/\s+/g, '')) ||
                       fileName.includes(artist.replace(/\s+/g, ''));
            });

            if (audioFile) {
                // Update the record with file paths
                const updateData = {
                    filepath: audioFile
                };

                if (imageFile) {
                    updateData.imageFilepath = imageFile;
                }

                await musicModel.findByIdAndUpdate(record._id, updateData);
                
                console.log(`  ✅ Fixed: Audio = ${audioFile}`);
                if (imageFile) {
                    console.log(`       Image = ${imageFile}`);
                }
                
                fixedCount++;
            } else {
                console.log(`  ❌ No matching audio file found for: ${record.title}`);
            }
        }

        console.log(`\n🎉 Fixed ${fixedCount} out of ${musicRecords.length} music records`);

        // Verify the fixes
        console.log('\n🔍 Verification - Updated records:');
        const updatedRecords = await musicModel.find({}).sort({ createdAt: -1 });
        
        updatedRecords.forEach((record, index) => {
            console.log(`${index + 1}. ${record.title} by ${record.artist}`);
            console.log(`   File: ${record.filepath || 'NOT SET'}`);
            console.log(`   Image: ${record.imageFilepath || 'NOT SET'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from database');
    }
};

fixMusicPaths();
