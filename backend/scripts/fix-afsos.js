import mongoose from 'mongoose';
import dotenv from 'dotenv';
import musicModel from '../models/musicModel.js';

dotenv.config();

const fixAfsosSong = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB Atlas');

        // Find the Afsos song
        const afsosSong = await musicModel.findOne({ title: 'Afsos', artist: 'CCX' });
        
        if (afsosSong) {
            // Update with correct audio file
            await musicModel.findByIdAndUpdate(afsosSong._id, {
                filepath: '1754853886544_SpotiDownloader.com - Afsos - CCX.mp3'
            });
            console.log('✅ Fixed Afsos audio file path');
        }

        // Verify all songs now have correct paths
        const allSongs = await musicModel.find({}).sort({ createdAt: -1 });
        console.log('\n🎵 Final verification:');
        allSongs.forEach((song, index) => {
            console.log(`${index + 1}. ${song.title} by ${song.artist}`);
            console.log(`   Audio: ${song.filepath}`);
            console.log(`   Image: ${song.imageFilepath || 'No image'}`);
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from database');
    }
};

fixAfsosSong();
