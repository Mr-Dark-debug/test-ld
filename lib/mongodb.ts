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
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
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

    // Ensure connection is ready with timeout
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ Waiting for MongoDB connection to be ready...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('MongoDB connection timeout'));
        }, 10000); // 10 second timeout

        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
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
    throw e;
  }

  return cached.conn;
}

export default connectDB;
