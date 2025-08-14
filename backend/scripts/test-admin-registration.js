#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const testAdminRegistration = async () => {
    try {
        console.log('🔧 TESTING ADMIN REGISTRATION PROCESS');
        console.log('='.repeat(50));

        // Test data
        const testAdmin = {
            username: 'testadmin',
            email: 'testadmin@resona.com',
            password: 'testadmin123',
            adminCode: 'RESONA_ADMIN_2025'
        };

        const testUser = {
            username: 'testuser2',
            email: 'testuser2@resona.com',
            password: 'testuser123'
            // No adminCode - should register as regular user
        };

        console.log('📋 Test Data Prepared:');
        console.log(`   Admin: ${testAdmin.username} (${testAdmin.email})`);
        console.log(`   User:  ${testUser.username} (${testUser.email})`);
        console.log(`   Admin Code: ${testAdmin.adminCode}`);

        // Connect to database to check before/after
        await mongoose.connect(process.env.MONGO_URL);
        console.log('\n🔗 Connected to MongoDB Atlas');

        const userModel = (await import('../models/userModel.js')).default;
        
        // Check existing users
        const beforeCount = await userModel.countDocuments();
        const beforeAdmins = await userModel.countDocuments({ role: 'admin' });
        console.log(`\n📊 BEFORE REGISTRATION:`);
        console.log(`   Total Users: ${beforeCount}`);
        console.log(`   Admin Users: ${beforeAdmins}`);

        // Clean up any existing test users
        await userModel.deleteMany({ 
            $or: [
                { email: testAdmin.email },
                { email: testUser.email }
            ]
        });
        console.log('🧹 Cleaned up existing test users');

        await mongoose.disconnect();

        // Test admin registration via API (if server is running locally)
        console.log('\n🧪 TESTING REGISTRATION ENDPOINTS:');
        console.log('-'.repeat(40));

        try {
            // Test admin registration
            console.log('1️⃣  Testing admin registration...');
            const adminResponse = await axios.post('http://localhost:5000/api/auth/register', testAdmin, {
                timeout: 5000
            });
            
            if (adminResponse.data.success) {
                console.log('   ✅ Admin registration successful!');
                console.log(`   👑 Role: ${adminResponse.data.user.role}`);
                console.log(`   🆔 ID: ${adminResponse.data.user.id}`);
            } else {
                console.log('   ❌ Admin registration failed');
                console.log(`   📝 Message: ${adminResponse.data.message}`);
            }

            // Test regular user registration
            console.log('\n2️⃣  Testing regular user registration...');
            const userResponse = await axios.post('http://localhost:5000/api/auth/register', testUser, {
                timeout: 5000
            });

            if (userResponse.data.success) {
                console.log('   ✅ User registration successful!');
                console.log(`   👤 Role: ${userResponse.data.user.role}`);
                console.log(`   🆔 ID: ${userResponse.data.user.id}`);
            } else {
                console.log('   ❌ User registration failed');
                console.log(`   📝 Message: ${userResponse.data.message}`);
            }

        } catch (apiError) {
            console.log('⚠️  API Test Failed (Server may not be running locally)');
            console.log(`   Error: ${apiError.message}`);
            console.log('   💡 This is OK if you\'re testing in production mode');
        }

        // Verify in database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('\n🔍 VERIFYING RESULTS IN DATABASE:');
        console.log('-'.repeat(40));

        const afterCount = await userModel.countDocuments();
        const afterAdmins = await userModel.countDocuments({ role: 'admin' });
        
        const testAdminInDb = await userModel.findOne({ email: testAdmin.email });
        const testUserInDb = await userModel.findOne({ email: testUser.email });

        console.log(`📊 AFTER REGISTRATION:`);
        console.log(`   Total Users: ${afterCount}`);
        console.log(`   Admin Users: ${afterAdmins}`);

        if (testAdminInDb) {
            console.log(`✅ Test Admin Created: ${testAdminInDb.username} (${testAdminInDb.role.toUpperCase()})`);
        } else {
            console.log('❌ Test Admin NOT found in database');
        }

        if (testUserInDb) {
            console.log(`✅ Test User Created: ${testUserInDb.username} (${testUserInDb.role.toUpperCase()})`);
        } else {
            console.log('❌ Test User NOT found in database');
        }

        // Clean up test users
        console.log('\n🧹 CLEANING UP TEST USERS:');
        const deleted = await userModel.deleteMany({ 
            $or: [
                { email: testAdmin.email },
                { email: testUser.email }
            ]
        });
        console.log(`   Deleted ${deleted.deletedCount} test users`);

        console.log('\n✅ ADMIN REGISTRATION TEST COMPLETE!');
        
        if (testAdminInDb && testAdminInDb.role === 'admin') {
            console.log('🎉 RESULT: Admin registration is WORKING correctly! ✅');
        } else {
            console.log('❌ RESULT: Admin registration may have issues');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('\n🔌 Disconnected from database');
        }
        process.exit(0);
    }
};

testAdminRegistration();
