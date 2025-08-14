#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const getUserCredentials = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('🔗 Connected to MongoDB Atlas');

        console.log('\n🔐 USER CREDENTIALS & PASSWORDS');
        console.log('='.repeat(80));
        
        const users = await userModel.find({}).select('+password').sort({ createdAt: -1 });
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
            return;
        }

        // Known passwords to test against
        const knownPasswords = [
            'admin123',
            'pranav@123!', 
            'user123',
            'password',
            'test123',
            '123456'
        ];

        users.forEach((user, index) => {
            console.log(`${index + 1}. 👤 USERNAME: ${user.username}`);
            console.log(`   📧 EMAIL: ${user.email}`);
            console.log(`   🆔 ID: ${user._id}`);
            console.log(`   🎭 ROLE: ${user.role.toUpperCase()}`);
            console.log(`   🔒 PASSWORD HASH: ${user.password}`);
            
            // Try to match known passwords
            let passwordFound = false;
            for (const testPassword of knownPasswords) {
                try {
                    if (bcrypt.compareSync(testPassword, user.password)) {
                        console.log(`   ✅ PASSWORD: ${testPassword} ✅`);
                        passwordFound = true;
                        break;
                    }
                } catch (error) {
                    // Continue to next password
                }
            }
            
            if (!passwordFound) {
                console.log(`   ❓ PASSWORD: Unknown (not in common list)`);
            }
            
            console.log(`   📅 Created: ${user.createdAt}`);
            console.log(`   🔑 Last Login: ${user.lastLogin || 'Never'}`);
            console.log(`   ✅ Active: ${user.active !== false ? 'Yes' : 'No'}`);
            console.log('-'.repeat(80));
        });

        // Test admin registration process
        console.log('\n🔧 TESTING ADMIN REGISTRATION PROCESS');
        console.log('='.repeat(80));

        // Check if admin secret exists
        const adminSecret = process.env.ADMIN_SECRET_CODE;
        console.log(`📝 Admin Secret Code: ${adminSecret ? '✅ SET' : '❌ NOT SET'}`);
        
        if (adminSecret) {
            console.log(`🔑 Admin Secret Value: "${adminSecret}"`);
        } else {
            console.log('❌ ADMIN_SECRET_CODE environment variable is missing!');
            console.log('💡 This is required for admin registration to work.');
        }

        console.log('\n📊 ADMIN REGISTRATION SUMMARY:');
        console.log('-'.repeat(50));
        console.log(`🔥 Total Users: ${users.length}`);
        console.log(`👑 Admin Users: ${users.filter(u => u.role === 'admin').length}`);
        console.log(`👤 Regular Users: ${users.filter(u => u.role === 'user').length}`);

        const admins = users.filter(u => u.role === 'admin');
        if (admins.length > 0) {
            console.log('\n👑 ADMIN ACCOUNTS:');
            admins.forEach((admin, idx) => {
                console.log(`   ${idx + 1}. ${admin.username} (${admin.email})`);
            });
        }

        console.log('\n✅ Credential extraction complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
};

getUserCredentials();
