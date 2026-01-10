import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

        mongoose.connection.on('connected', ()=> console.log('✅ Database connected'))
        mongoose.connection.on('error', (err)=> console.log('❌ Database connection error:', err))
        mongoose.connection.on('disconnected', ()=> console.log('⚠️ Database disconnected'))

        await mongoose.connect(`${mongoUri}/quickgpt`)
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        console.error('⚠️ Server will continue but database operations will fail')
        // Don't throw error - allow server to start without database
    }
}

export default connectDB;