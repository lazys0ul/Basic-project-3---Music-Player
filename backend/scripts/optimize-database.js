import mongoose from 'mongoose';
import connectDB from '../config/mongoDB.js';
import userModel from '../models/userModel.js';
import musicModel from '../models/musicModel.js';

// Database optimization script
const optimizeDatabase = async () => {
  try {
    await connectDB();
    console.log('🔧 Optimizing database indexes...');

    // User model indexes
    await userModel.collection.createIndex({ email: 1 }, { unique: true });
    await userModel.collection.createIndex({ username: 1 });
    await userModel.collection.createIndex({ createdAt: -1 });
    console.log(' User indexes created');

    // Music model indexes  
    await musicModel.collection.createIndex({ title: 1 });
    await musicModel.collection.createIndex({ artist: 1 });
    await musicModel.collection.createIndex({ uploadedBy: 1 });
    await musicModel.collection.createIndex({ createdAt: -1 });
    await musicModel.collection.createIndex({ isActive: 1 });
    
    // Compound indexes for common queries
    await musicModel.collection.createIndex({ title: 1, artist: 1 });
    await musicModel.collection.createIndex({ uploadedBy: 1, createdAt: -1 });
    
    // Text search index
    await musicModel.collection.createIndex({ 
      title: 'text', 
      artist: 'text' 
    }, {
      weights: { title: 2, artist: 1 },
      name: 'search_text_index'
    });
    
    console.log(' Music indexes created');
    console.log(' Database optimization complete!');
    
    // Show index information
    const userIndexes = await userModel.collection.listIndexes().toArray();
    const musicIndexes = await musicModel.collection.listIndexes().toArray();
    
    console.log(` User collection has ${userIndexes.length} indexes`);
    console.log(` Music collection has ${musicIndexes.length} indexes`);
    
    process.exit(0);
  } catch (error) {
    console.error(' Database optimization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeDatabase();
}

export default optimizeDatabase;
