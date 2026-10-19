import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isAtlas = uri && uri.includes('mongodb+srv://') && !uri.includes('<username>');

  // Try connecting to primary URI if provided and not placeholder
  if (uri && !uri.includes('<username>')) {
    try {
      console.log(`[MongoDB] Attempting connection to: ${isAtlas ? 'MongoDB Atlas Cluster' : uri}`);
      await mongoose.connect(uri, {
        dbName: 'nexora',
        serverSelectionTimeoutMS: 5000
      });
      console.log(`[MongoDB] Successfully connected to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}: nexora`);
      return mongoose.connection;
    } catch (err) {
      console.warn(`[MongoDB] Primary connection failed (${err.message}). Activating in-memory fallback...`);
    }
  } else {
    console.log('[MongoDB] No direct MongoDB URI or placeholder detected in .env. Initializing in-memory fallback...');
  }

  // Resilient fallback with MongoMemoryServer for immediate local development and zero-config college viva demo
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: { dbName: 'nexora' }
    });
    const fallbackUri = memoryServer.getUri();
    await mongoose.connect(fallbackUri, { dbName: 'nexora' });
    console.log('[MongoDB] Connected to MongoDB in-memory database: nexora');
    return mongoose.connection;
  } catch (memErr) {
    console.error('[MongoDB] Critical: Failed to establish any MongoDB connection:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    console.log('[MongoDB] Disconnected successfully');
  } catch (err) {
    console.error('[MongoDB] Error during disconnect:', err.message);
  }
};

// Graceful process termination
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
