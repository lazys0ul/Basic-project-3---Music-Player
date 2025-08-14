#!/usr/bin/env node
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';
import musicModel from '../models/musicModel.js';

dotenv.config();

const inspectDatabase = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Connected to MongoDB Atlas');

        // Get database information
        const db = mongoose.connection.db;
        const admin = db.admin();
        
        console.log('\n DATABASE OVERVIEW');
        console.log('='.repeat(80));
        
        // Database stats
        const stats = await db.stats();
        console.log(`📊 Database Name: ${db.databaseName}`);
        console.log(`💾 Database Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`📁 Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`🗂️  Collections: ${stats.collections}`);
        console.log(`📄 Documents: ${stats.objects}`);

        // Collections info
        const collections = await db.listCollections().toArray();
        console.log('\n📁 COLLECTIONS:');
        console.log('-'.repeat(40));
        for (const collection of collections) {
            const count = await db.collection(collection.name).countDocuments();
            console.log(`   ${collection.name}: ${count} documents`);
        }

        // Detailed user information
        console.log('\n👥 USER DETAILS:');
        console.log('='.repeat(80));
        const users = await userModel.find({}).sort({ createdAt: -1 });
        
        if (users.length === 0) {
            console.log('❌ No users found in database');
        } else {
            users.forEach((user, index) => {
                console.log(`${index + 1}. 👤 ${user.username} (${user.email})`);
                console.log(`   🎭 Role: ${user.role}`);
                console.log(`   ✅ Active: ${user.active !== false ? 'Yes' : 'No'}`);
                console.log(`   📅 Created: ${user.createdAt}`);
                console.log(`   🔑 Last Login: ${user.lastLogin || 'Never'}`);
                console.log(`   🆔 ID: ${user._id}`);
                console.log('-'.repeat(50));
            });
        }

        // Detailed music information
        console.log('\n🎵 MUSIC DETAILS:');
        console.log('='.repeat(80));
        const music = await musicModel.find({}).populate('uploadedBy', 'username email').sort({ createdAt: -1 });
        
        if (music.length === 0) {
            console.log('❌ No music found in database');
            console.log('💡 Database is clean and ready for fresh uploads');
        } else {
            music.forEach((song, index) => {
                console.log(`${index + 1}. 🎵 "${song.title}" by ${song.artist}`);
                console.log(`   📁 File: ${song.filepath}`);
                console.log(`   🖼️  Image: ${song.imageFilepath || 'No image'}`);
                console.log(`   📊 Size: ${song.fileSize ? (song.fileSize / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}`);
                console.log(`   ⏱️  Duration: ${song.duration || 'Unknown'}`);
                console.log(`   👤 Uploaded by: ${song.uploadedBy?.username || 'Unknown'} (${song.uploadedBy?.email || 'N/A'})`);
                console.log(`   📅 Created: ${song.createdAt}`);
                console.log(`   🆔 ID: ${song._id}`);
                console.log('-'.repeat(50));
            });
        }

        // Server information
        console.log('\n  SERVER INFO:');
        console.log('='.repeat(80));
        const serverStatus = await admin.serverStatus();
        console.log(` MongoDB Version: ${serverStatus.version}`);
        console.log(` Host: ${serverStatus.host}`);
        console.log(` Uptime: ${Math.floor(serverStatus.uptime / 3600)} hours`);
        console.log(` Connections: ${serverStatus.connections.current}`);

        console.log('\n Database inspection complete!');

    } catch (error) {
        console.error(' Error inspecting database:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from database');
        process.exit(0);
    }
};

inspectDatabase();
