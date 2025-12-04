import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/atypikhouse';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
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
      serverSelectionTimeoutMS: 10000, // 10 secondes timeout
      socketTimeoutMS: 45000, // 45 secondes socket timeout
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connexion MongoDB réussie');
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ Erreur de connexion MongoDB:', error.message);
        console.error('MONGODB_URI configuré:', MONGODB_URI ? 'Oui' : 'Non');
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    console.error('❌ Échec de la connexion MongoDB:', e?.message);
    throw new Error(`Erreur de connexion à la base de données: ${e?.message}`);
  }

  return cached.conn;
}

export default dbConnect;


