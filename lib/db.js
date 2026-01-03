import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            // Connection pool settings
            maxPoolSize: 10,
            minPoolSize: 2,
            // Timeout settings to handle stale connections
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            // Automatically retry failed connections
            retryWrites: true,
            retryReads: true,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('✅ MongoDB connected successfully');
            return mongoose;
        }).catch((error) => {
            console.error('❌ MongoDB connection error:', error.message);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
