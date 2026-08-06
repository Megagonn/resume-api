import mongoose, { Schema, Document, Types } from 'mongoose';
import type { JobType, JobStatus } from '../types/index.js';

export interface IJob extends Document {
  companyId: Types.ObjectId;
  hirerId: Types.ObjectId;
  title: string;
  description: string;
  type: JobType;
  location: string;
  remote: boolean;
  salaryRange?: { min?: number; max?: number; currency: string };
  status: JobStatus;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    hirerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'gig'],
      required: true,
    },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    salaryRange: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'NGN' },
    },
    status: { type: String, enum: ['draft', 'open', 'closed'], default: 'open' },
    featured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', tags: 'text' });

export const Job = mongoose.model<IJob>('Job', jobSchema);
