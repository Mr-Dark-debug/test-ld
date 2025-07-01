import mongoose from 'mongoose';
import { DATABASE_CONFIG, MONGODB_OPTIONS } from './config';

declare global {
  var mongoose: any; // This must be a `var` and not a `let / const`
}

// Use MongoDB URI from config
const MONGODB_URI = DATABASE_CONFIG.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Check if already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      // Continue to create new connection
    }
  }

  if (!cached.promise) {
    const opts = MONGODB_OPTIONS;

    console.log('🔄 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;

    // Ensure connection is ready with reduced timeout
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Waiting for MongoDB connection to be ready...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MongoDB connection timeout after 5 seconds'));
        }, 5000); // Reduced to 5 second timeout

        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });

        mongoose.connection.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });

        // If already connected, resolve immediately
        if (mongoose.connection.readyState === 1) {
          clearTimeout(timeout);
          resolve(true);
        }
      });
    }

  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);

    // If it's a timeout error, provide more specific error message
    if (e instanceof Error && e.message.includes('timeout')) {
      throw new Error('Database connection timeout. Please try again.');
    }

    throw e;
  }

  return cached.conn;
}

export default connectDB;
