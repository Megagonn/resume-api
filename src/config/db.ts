import mongoose from 'mongoose';
import { env } from './env.ts';

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 });
    console.log('MongoDB connected');
  } catch (err) {
    const hint =
      env.mongoUri.includes('mongodb+srv')
        ? 'Atlas SRV lookup failed — check cluster exists, IP allowlist, and URI includes /ready-brand'
        : 'Local MongoDB unreachable — run: docker compose up -d';
    console.error(`MongoDB connection failed. ${hint}`);
    throw err;
  }
}
