import dotenv from 'dotenv';
import validateEnvironment from '../utils/validateEnv.js';

dotenv.config();
validateEnvironment();

console.log('Environment variables:');
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('DB_NAME:', process.env.DB_NAME);

// Test what the constructed URI would be
let MONGO_URI;
if (process.env.MONGO_URL.includes('mongodb+srv://') || process.env.MONGO_URL.includes('?')) {
    MONGO_URI = process.env.MONGO_URL;
} else {
    MONGO_URI = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
}

console.log('Constructed MONGO_URI:', MONGO_URI);
