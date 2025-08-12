import connectDB from '../config/mongoDB.js';
import User from '../models/userModel.js';
import Music from '../models/musicModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
    try {
        console.log('Testing database connection...');

        await connectDB();
        console.log('Connected to MongoDB successfully');        // Test collections
        const userCount = await User.countDocuments();
        const musicCount = await Music.countDocuments();
        
        console.log(`\nDatabase Statistics:`);
        console.log(`Users in database: ${userCount}`);
        console.log(`Music tracks in database: ${musicCount}`);
        
        // Get recent music tracks
        if (musicCount > 0) {
            console.log(`\nRecent Music Tracks:`);
            const recentTracks = await Music.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('title artist createdAt uploadedBy');
            
            recentTracks.forEach((track, index) => {
                console.log(`   ${index + 1}. "${track.title}" by ${track.artist} - ${new Date(track.createdAt).toLocaleDateString()}`);
            });
        }
        
        // Get recent users (excluding password)
        if (userCount > 0) {
            console.log(`\nRecent Users:`);
            const recentUsers = await User.find()
                .sort({ createdAt: -1 })
                .limit(3)
                .select('username email role createdAt');
            
            recentUsers.forEach((user, index) => {
                console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.role} - ${new Date(user.createdAt).toLocaleDateString()}`);
            });
        }
        
        // Test creating and deleting a sample document
        console.log(`\nTesting database operations...`);
        const testUser = new User({
            username: 'test_connection_' + Date.now(),
            email: `test${Date.now()}@connection.test`,
            password: 'test123'
        });
        
        const savedUser = await testUser.save();
        console.log('Test document created successfully');
        console.log(`   ID: ${savedUser._id}`);
        console.log(`   Username: ${savedUser.username}`);
        
        await User.deleteOne({ _id: savedUser._id });
        console.log('Test document deleted successfully');
        
        // Test database collections
        console.log(`\nAvailable Collections:`);
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach(collection => {
            console.log(`   - ${collection.name}`);
        });
        
        console.log('\nDatabase connection and operations are working correctly!');
        console.log(`🔗 Connected to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`);
        
    } catch (error) {
        console.error('❌ Database test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
}

testDatabase();
