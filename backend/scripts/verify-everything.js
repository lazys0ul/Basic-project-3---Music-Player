import mongoose from 'mongoose';
import dotenv from 'dotenv';
import musicModel from '../models/musicModel.js';
import userModel from '../models/userModel.js';

dotenv.config();

const verifyEverything = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB Atlas');

        // Check users
        const users = await userModel.find({}).sort({ createdAt: -1 });
        console.log(`\n👥 USERS (${users.length} total):`);
        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.username} (${user.email}) - ${user.role}`);
        });

        // Check music
        const music = await musicModel.find({}).populate('uploadedBy', 'username').sort({ createdAt: -1 });
        console.log(`\n🎵 MUSIC (${music.length} total):`);
        music.forEach((song, index) => {
            console.log(`  ${index + 1}. "${song.title}" by ${song.artist}`);
            console.log(`     File: ${song.filepath ? '✅' : '❌'} ${song.filepath || 'MISSING'}`);
            console.log(`     Image: ${song.imageFilepath ? '✅' : '❌'} ${song.imageFilepath || 'MISSING'}`);
            console.log(`     Uploaded by: ${song.uploadedBy?.username || 'Unknown'}`);
            console.log('');
        });

        console.log('🎯 SUMMARY:');
        console.log(`  • ${users.length} users registered`);
        console.log(`  • ${users.filter(u => u.role === 'admin').length} admins`);
        console.log(`  • ${music.length} songs in library`);
        console.log(`  • ${music.filter(s => s.filepath).length}/${music.length} songs have valid audio files`);
        console.log(`  • ${music.filter(s => s.imageFilepath).length}/${music.length} songs have cover images`);

        console.log('\n🔧 IF SONGS STILL NOT SHOWING:');
        console.log('  1. Check Vercel environment variables');
        console.log('  2. Check Railway CORS configuration');
        console.log('  3. Verify frontend is calling correct API URL');
        console.log('  4. Check browser console for CORS errors');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from database');
    }
};

verifyEverything();
