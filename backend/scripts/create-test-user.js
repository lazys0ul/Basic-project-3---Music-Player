import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const createTestUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        // Check if test user already exists
        const existingUser = await userModel.findOne({ email: 'user@resona.com' });
        if (existingUser) {
            console.log('Test user already exists');
            console.log('Email: user@resona.com');
            console.log('Password: user123');
            process.exit(0);
        }

        // Create regular test user
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('user123', salt);

        const testUser = new userModel({
            username: 'testuser',
            email: 'user@resona.com',
            password: hashedPassword,
            role: 'user',
            isActive: true,
            lastLogin: new Date()
        });

        await testUser.save();
        console.log('Test user created successfully!');
        console.log('Email: user@resona.com');
        console.log('Password: user123');
        console.log('Role: user');
        
    } catch (error) {
        console.error('Error creating test user:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createTestUser();
