import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to database');

        // Check if admin already exists
        const existingAdmin = await userModel.findOne({ email: 'admin@resona.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('Updated existing user to admin role');
            }
            process.exit(0);
        }

        // Create admin user
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const adminUser = new userModel({
            username: 'admin',
            email: 'admin@resona.com',
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            lastLogin: new Date()
        });

        await adminUser.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@resona.com');
        console.log('Password: admin123');
        console.log('Role: admin');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
};

createAdminUser();
