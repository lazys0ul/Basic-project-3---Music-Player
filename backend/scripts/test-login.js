import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const testLogin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Connected to database');

        const email = 'pranav@resona.com';
        const password = 'pranav@123!';

        console.log('\n Testing Login Process:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        // Step 1: Find user
        const user = await userModel.findOne({ email: email.toLowerCase().trim() });
        console.log(`\n1️ User found: ${user ? 'YES' : 'NO'}`);
        
        if (!user) {
            console.log(' User not found in database');
            return;
        }

        console.log(`   Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);

        // Step 2: Test password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`\n2️ Password valid: ${isPasswordValid ? 'YES' : 'NO'}`);

        if (isPasswordValid) {
            console.log(' Login should work - credentials are correct!');
        } else {
            console.log(' Password does not match');
        }

        // Let's also test the original admin
        console.log('\n Testing Original Admin:');
        const originalAdmin = await userModel.findOne({ email: 'admin@resona.com' });
        if (originalAdmin) {
            const originalIsValid = await bcrypt.compare('admin123', originalAdmin.password);
            console.log(`Original admin password valid: ${originalIsValid ? 'YES' : 'NO'}`);
            
            if (!originalIsValid) {
                console.log(' Fixing original admin password...');
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash('admin123', salt);
                originalAdmin.password = hashedPassword;
                await originalAdmin.save();
                console.log(' Fixed original admin password');
            }
        }

    } catch (error) {
        console.error(' Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n Disconnected from database');
    }
};

testLogin();
