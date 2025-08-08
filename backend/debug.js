import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const musicSchema = new mongoose.Schema({}, { strict: false, collection: 'music' });
const Music = mongoose.model('Music', musicSchema);

async function checkDatabase() {
  try {
    const MONGO_URI = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
    console.log('Connecting to:', MONGO_URI);
    
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:');
    collections.forEach(col => console.log('  -', col.name));
    
    // Try different collection names
    const collectionNames = ['music', 'musics', 'tracks', 'songs'];
    
    for (const collectionName of collectionNames) {
      console.log(`\nChecking collection: ${collectionName}`);
      const schema = new mongoose.Schema({}, { strict: false, collection: collectionName });
      const Model = mongoose.model(collectionName + 'Model', schema);
      
      const docs = await Model.find({});
      console.log(`  Found ${docs.length} documents`);
      
      if (docs.length > 0) {
        docs.forEach((doc, index) => {
          console.log(`  Document ${index + 1}:`);
          console.log('    Title:', doc.title);
          console.log('    Artist:', doc.artist);
          console.log('    Filepath:', doc.filepath);
          console.log('    ImageFilepath:', doc.imageFilepath);
          console.log('    ---');
        });
      }
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDatabase();
