import mongoose, { Schema, Document } from 'mongoose';
import type { UserRole } from '../types/index.ts';

export interface SeekerProfile {
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  resumeUrl?: string;
  experienceYears?: number;
}

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  phone?: string;
  avatarUrl?: string;
  seekerProfile?: SeekerProfile;
  createdAt: Date;
  updatedAt: Date;
}

const seekerProfileSchema = new Schema(
  {
    headline: String,
    bio: String,
    location: String,
    skills: [String],
    resumeUrl: String,
    experienceYears: Number,
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['seeker', 'hirer', 'admin'], required: true },
    name: { type: String, required: true, trim: true },
    phone: String,
    avatarUrl: String,
    seekerProfile: seekerProfileSchema,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
