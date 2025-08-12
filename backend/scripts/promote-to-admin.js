import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const promoteToAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to database');

        console.log('\n👑 Promote User to Admin');
        console.log('========================');

        const email = await question('Email of user to promote: ');

        if (!email || !email.includes('@')) {
            console.log('❌ Invalid email format.');
            process.exit(1);
        }

        // Find user
        const user = await userModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log('✅ User is already an admin');
            process.exit(0);
        }

        // Promote to admin
        user.role = 'admin';
        await user.save();

        console.log('\n🎉 User promoted to admin successfully!');
        console.log('====================================');
        console.log(`📧 Email: ${user.email}`);
        console.log(`👤 Username: ${user.username}`);
        console.log(`👑 Role: ${user.role}`);

    } catch (error) {
        console.error('❌ Error promoting user:', error.message);
    } finally {
        rl.close();
        mongoose.connection.close();
        process.exit(0);
    }
};

promoteToAdmin();
