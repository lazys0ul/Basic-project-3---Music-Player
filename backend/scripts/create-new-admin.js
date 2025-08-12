import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createNewAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Connected to database');

        console.log('\n Create New Admin User');
        console.log('========================');

        // Get admin details from user input
        const username = await question('Username (3-30 characters): ');
        const email = await question('Email: ');
        const password = await question('Password (min 6 characters): ');

        // Validate input
        if (!username || username.length < 3 || username.length > 30) {
            console.log(' Invalid username. Must be 3-30 characters.');
            process.exit(1);
        }

        if (!email || !email.includes('@')) {
            console.log(' Invalid email format.');
            process.exit(1);
        }

        if (!password || password.length < 6) {
            console.log(' Invalid password. Must be at least 6 characters.');
            process.exit(1);
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            if (existingUser.role === 'admin') {
                console.log(' Admin with this email already exists');
            } else {
                // Promote existing user to admin
                existingUser.role = 'admin';
                await existingUser.save();
                console.log(` Promoted existing user "${existingUser.username}" to admin role`);
            }
            process.exit(0);
        }

        // Create new admin user
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = new userModel({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            lastLogin: new Date()
        });

        await adminUser.save();
        
        console.log('\n🎉 New admin user created successfully!');
        console.log('=====================================');
        console.log(` Email: ${adminUser.email}`);
        console.log(` Username: ${adminUser.username}`);
        console.log(` Password: ${password}`);
        console.log(` Role: ${adminUser.role}`);
        console.log('\n You can now login with these credentials at:');
        console.log('   Frontend: https://resona-music.vercel.app');
        console.log('   Backend API: https://basic-project-3-music-player-production.up.railway.app');

    } catch (error) {
        console.error(' Error creating admin user:', error.message);
    } finally {
        rl.close();
        mongoose.connection.close();
        process.exit(0);
    }
};

createNewAdmin();
