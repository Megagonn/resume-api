import mongoose from 'mongoose';
import { env } from './env.ts';

export async function connectDb(): Promise<void> {
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
}
