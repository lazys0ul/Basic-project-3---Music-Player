import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => console.log('Database connected'))
        mongoose.connection.on("error", (err) => console.log('Database connection error:', err))

        await mongoose.connect(`${process.env.MONGO_URL}/music`)
        console.log('MongoDB connection successful')
    } catch (error) {
        console.error('MongoDB connection failed:', error.message)
        process.exit(1)
    }
}

export default connectDB