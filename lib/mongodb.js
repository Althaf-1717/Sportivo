import mongoose from "mongoose";

const cached = globalThis.mongooseCache || (globalThis.mongooseCache = { conn: null, promise: null });

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MongoDB is not configured. Add MONGODB_URI to your local .env file.");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
