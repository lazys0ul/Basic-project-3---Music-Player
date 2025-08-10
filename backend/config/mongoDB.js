import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            if (process.env.NODE_ENV !== 'production') {
                console.log('Database connected');
            }
        });
        mongoose.connection.on("error", (err) => console.log('Database connection error:', err));

        // Handle both local and remote MongoDB URLs properly
        let MONGO_URI;
        if (process.env.MONGO_URL.includes('mongodb+srv://') || process.env.MONGO_URL.includes('?')) {
            // For MongoDB Atlas or URLs with query parameters
            MONGO_URI = process.env.MONGO_URL;
        } else {
            // For local MongoDB without database name
            MONGO_URI = `${process.env.MONGO_URL}/${process.env.DB_NAME}`;
        }
        
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        
        console.log('MongoDB connection successful')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1)
    }
}

export default connectDB