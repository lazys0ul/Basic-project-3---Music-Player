import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const checkUsers = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB Atlas');

        // Get all users
        const users = await userModel.find({}, 'username email role isActive createdAt lastLogin').sort({ createdAt: -1 });
        
        console.log(`\n📊 Total users in database: ${users.length}`);
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            console.log('\n👥 Existing Users:');
            console.log('='.repeat(80));
            users.forEach((user, index) => {
                console.log(`${index + 1}. Username: ${user.username}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role}`);
                console.log(`   Active: ${user.isActive}`);
                console.log(`   Created: ${user.createdAt}`);
                console.log(`   Last Login: ${user.lastLogin || 'Never'}`);
                console.log('-'.repeat(50));
            });
        }
        
    } catch (error) {
        console.error('❌ Error checking database:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

checkUsers();
