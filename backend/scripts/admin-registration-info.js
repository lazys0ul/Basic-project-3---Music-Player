import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const testAdminRegistration = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to database');

        console.log('\n🔧 ADMIN REGISTRATION SETUP');
        console.log('===========================');
        
        const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'RESONA_ADMIN_2025';
        console.log(`🔑 Admin Secret Code: ${adminSecretCode}`);
        console.log('');

        console.log('📋 HOW TO REGISTER AS ADMIN:');
        console.log('1. Go to registration page: https://resona-music.vercel.app');
        console.log('2. Fill in your details');
        console.log(`3. In the "Admin Code" field, enter: ${adminSecretCode}`);
        console.log('4. Submit the form');
        console.log('5. You will be registered as an admin! 🎉');
        console.log('');

        console.log('📋 HOW TO REGISTER AS REGULAR USER:');
        console.log('1. Go to registration page: https://resona-music.vercel.app');
        console.log('2. Fill in your details');
        console.log('3. Leave the "Admin Code" field empty');
        console.log('4. Submit the form');
        console.log('5. You will be registered as a regular user');
        console.log('');

        console.log('🎯 CURRENT USERS IN DATABASE:');
        const users = await userModel.find({}).select('-password').sort({ createdAt: -1 });
        users.forEach((user, index) => {
            console.log(`  ${index + 1}. ${user.username} (${user.email}) - ${user.role.toUpperCase()}`);
        });

        console.log('\n💡 TIPS:');
        console.log('• The admin code is case-sensitive');
        console.log('• Admin code can be changed by updating ADMIN_SECRET_CODE environment variable');
        console.log('• Existing users can be promoted to admin using the promote script');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from database');
    }
};

testAdminRegistration();
