import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

const verifyAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to database');

        // Find the new admin
        const admin = await userModel.findOne({ email: 'pranav@resona.com' });
        
        if (!admin) {
            console.log('❌ Admin not found');
            return;
        }

        console.log('\n🔍 Admin Details:');
        console.log(`Username: ${admin.username}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Role: ${admin.role}`);
        console.log(`Active: ${admin.isActive}`);
        console.log(`Password Hash: ${admin.password.substring(0, 20)}...`);

        // Test password verification
        const testPassword = 'pranav@123!';
        const isValid = await bcrypt.compare(testPassword, admin.password);
        console.log(`\n🔐 Password "${testPassword}" is ${isValid ? 'VALID' : 'INVALID'}`);

        // Also test with original admin
        const originalAdmin = await userModel.findOne({ email: 'admin@resona.com' });
        if (originalAdmin) {
            const originalIsValid = await bcrypt.compare('admin123', originalAdmin.password);
            console.log(`🔐 Original admin password is ${originalIsValid ? 'VALID' : 'INVALID'}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('📡 Disconnected from database');
    }
};

verifyAdmin();
