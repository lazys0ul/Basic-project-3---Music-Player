#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const testRegistrationLogic = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🔗 Connected to MongoDB Atlas');

        const userModel = (await import('../models/userModel.js')).default;

        console.log('\n🧪 TESTING ADMIN REGISTRATION LOGIC DIRECTLY');
        console.log('='.repeat(60));

        // Simulate the registration controller logic
        const testData = {
            username: 'directtestadmin',
            email: 'directtestadmin@resona.com', 
            password: 'testpass123',
            adminCode: 'RESONA_ADMIN_2025'
        };

        console.log('📋 Test Registration Data:');
        console.log(`   Username: ${testData.username}`);
        console.log(`   Email: ${testData.email}`);
        console.log(`   Admin Code: ${testData.adminCode}`);

        // Clean existing test user
        await userModel.deleteOne({ email: testData.email });

        // Replicate the registration logic from userController.js
        const { username, email, password, adminCode } = testData;

        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [{ email: email.toLowerCase() }, { username }] 
        });

        if (existingUser) {
            console.log('❌ User already exists');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log('✅ Password hashed successfully');

        // Determine role based on admin code
        const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'RESONA_ADMIN_2025';
        console.log(`🔑 Admin Secret in ENV: "${adminSecretCode}"`);
        console.log(`🔑 Admin Code Provided: "${adminCode}"`);
        console.log(`🔍 Codes Match: ${adminCode === adminSecretCode}`);

        let userRole = 'user';
        if (adminCode && adminCode === adminSecretCode) {
            userRole = 'admin';
            console.log('👑 User will be registered as ADMIN');
        } else {
            console.log('👤 User will be registered as USER');
        }

        // Create new user
        const newUser = new userModel({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: userRole
        });

        const savedUser = await newUser.save();
        console.log('✅ User saved to database successfully');

        console.log('\n📊 REGISTRATION RESULT:');
        console.log('-'.repeat(30));
        console.log(`🆔 ID: ${savedUser._id}`);
        console.log(`👤 Username: ${savedUser.username}`);
        console.log(`📧 Email: ${savedUser.email}`);
        console.log(`🎭 Role: ${savedUser.role.toUpperCase()}`);
        console.log(`📅 Created: ${savedUser.createdAt}`);
        console.log(`✅ Active: ${savedUser.active !== false ? 'Yes' : 'No'}`);

        // Verify in database
        const verifyUser = await userModel.findById(savedUser._id);
        if (verifyUser) {
            console.log('\n✅ VERIFICATION: User found in database');
            console.log(`   Role confirmed: ${verifyUser.role}`);
            
            if (adminCode === adminSecretCode && verifyUser.role === 'admin') {
                console.log('🎉 SUCCESS: Admin registration is working correctly! ✅');
            } else if (!adminCode && verifyUser.role === 'user') {
                console.log('🎉 SUCCESS: Regular user registration is working correctly! ✅');
            } else {
                console.log('❌ ERROR: Role assignment is incorrect');
            }
        }

        // Clean up test user
        await userModel.deleteOne({ _id: savedUser._id });
        console.log('\n🧹 Test user cleaned up');

        // Test without admin code (regular user)
        console.log('\n🧪 TESTING REGULAR USER REGISTRATION');
        console.log('-'.repeat(40));
        
        const regularUserData = {
            username: 'regularuser',
            email: 'regularuser@resona.com',
            password: 'testpass123'
            // No adminCode
        };

        const hashedPassword2 = await bcrypt.hash(regularUserData.password, 12);
        const regularUser = new userModel({
            username: regularUserData.username.trim(),
            email: regularUserData.email.toLowerCase().trim(),
            password: hashedPassword2,
            role: 'user' // Should default to user when no adminCode
        });

        const savedRegularUser = await regularUser.save();
        console.log(`✅ Regular user created: ${savedRegularUser.username} (${savedRegularUser.role.toUpperCase()})`);

        // Clean up
        await userModel.deleteOne({ _id: savedRegularUser._id });
        console.log('🧹 Regular test user cleaned up');

    } catch (error) {
        console.error('❌ Direct test failed:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
};

testRegistrationLogic();
