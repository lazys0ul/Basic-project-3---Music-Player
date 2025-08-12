import mongoose from 'mongoose';
import dotenv from 'dotenv';
import musicModel from '../models/musicModel.js';
import userModel from '../models/userModel.js';

dotenv.config();

const checkMusic = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Connected to MongoDB Atlas');

        // Get all music
        const music = await musicModel.find({}).populate('uploadedBy', 'username email').sort({ createdAt: -1 });
        
        console.log(`\n🎵 Total songs in database: ${music.length}`);
        
        if (music.length === 0) {
            console.log(' No music found in database');
            console.log(' Users need to upload music files first');
        } else {
            console.log('\n🎶 Existing Music:');
            console.log('='.repeat(80));
            music.forEach((song, index) => {
                console.log(`${index + 1}. Title: ${song.title}`);
                console.log(`   Artist: ${song.artist}`);
                console.log(`   Album: ${song.album || 'N/A'}`);
                console.log(`   Duration: ${song.duration || 'Unknown'}`);
                console.log(`   File: ${song.musicFile}`);
                console.log(`   Image: ${song.imageFile || 'No image'}`);
                console.log(`   Uploaded by: ${song.uploadedBy?.username || 'Unknown'} (${song.uploadedBy?.email || 'N/A'})`);
                console.log(`   Created: ${song.createdAt}`);
                console.log('-'.repeat(50));
            });
        }
        
    } catch (error) {
        console.error('❌ Error checking music database:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

checkMusic();
