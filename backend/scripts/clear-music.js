#!/usr/bin/env node
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import musicModel from '../models/musicModel.js';

dotenv.config();

const clearMusicData = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URL);
        console.log(' Connected to MongoDB Atlas');

        // Get all music records before deletion
        const allMusic = await musicModel.find({}).populate('uploadedBy', 'username');
        console.log(`\n🎵 Found ${allMusic.length} music records to delete:`);

        allMusic.forEach((song, index) => {
            console.log(`  ${index + 1}. "${song.title}" by ${song.artist} (uploaded by ${song.uploadedBy?.username || 'Unknown'})`);
        });

        if (allMusic.length === 0) {
            console.log(' No music records found - database is already clean');
            return;
        }

        // Delete files from uploads directory
        console.log('\n Deleting music files from uploads directory...');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        let deletedFiles = 0;
        let skippedFiles = 0;

        for (const song of allMusic) {
            // Delete audio file
            if (song.filepath) {
                const audioPath = path.join(uploadsDir, song.filepath);
                if (fs.existsSync(audioPath)) {
                    try {
                        fs.unlinkSync(audioPath);
                        console.log(`   Deleted audio: ${song.filepath}`);
                        deletedFiles++;
                    } catch (error) {
                        console.log(`   Failed to delete audio: ${song.filepath} - ${error.message}`);
                        skippedFiles++;
                    }
                }
            }

            // Delete image file
            if (song.imageFilepath) {
                const imagePath = path.join(uploadsDir, song.imageFilepath);
                if (fs.existsSync(imagePath)) {
                    try {
                        fs.unlinkSync(imagePath);
                        console.log(`   Deleted image: ${song.imageFilepath}`);
                        deletedFiles++;
                    } catch (error) {
                        console.log(`   Failed to delete image: ${song.imageFilepath} - ${error.message}`);
                        skippedFiles++;
                    }
                }
            }
        }

        // Delete all music records from database
        console.log('\n Deleting music records from database...');
        const deleteResult = await musicModel.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} music records from database`);

        // Clean up any remaining files in uploads (except test folder)
        console.log('\n🧹 Cleaning up any remaining files...');
        const remainingFiles = fs.readdirSync(uploadsDir);
        const filesToClean = remainingFiles.filter(file => 
            file !== 'test' && 
            (file.endsWith('.mp3') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.webp'))
        );

        for (const file of filesToClean) {
            try {
                const filePath = path.join(uploadsDir, file);
                fs.unlinkSync(filePath);
                console.log(`   Cleaned up: ${file}`);
                deletedFiles++;
            } catch (error) {
                console.log(`   Failed to clean: ${file} - ${error.message}`);
                skippedFiles++;
            }
        }

        console.log('\n CLEANUP COMPLETE!');
        console.log('===================');
        console.log(` Files deleted: ${deletedFiles}`);
        console.log(` Files skipped: ${skippedFiles}`);
        console.log(` Database records deleted: ${deleteResult.deletedCount}`);
        
        // Verify cleanup
        const remainingMusic = await musicModel.countDocuments();
        console.log(`\n Verification: ${remainingMusic} music records remaining in database`);
        
        const finalFiles = fs.readdirSync(uploadsDir).filter(file => 
            file !== 'test' && 
            (file.endsWith('.mp3') || file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.webp'))
        );
        console.log(` Verification: ${finalFiles.length} music files remaining in uploads directory`);

        console.log('\n Ready for fresh uploads through the website!');
        console.log('   • Database is clean');
        console.log('   • Upload directory is clean'); 
        console.log('   • User accounts are preserved');

    } catch (error) {
        console.error(' Error during cleanup:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n Disconnected from database');
        process.exit(0);
    }
};

clearMusicData();
