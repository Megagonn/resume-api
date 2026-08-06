import mongoose, { Schema, Document, Types } from 'mongoose';
import type { ApplicationStatus } from '../types/index.ts';

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  seekerId: Types.ObjectId;
  coverNote?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  timeline: { status: ApplicationStatus; at: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    seekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverNote: String,
    resumeUrl: String,
    status: {
      type: String,
      enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
      default: 'new',
    },
    timeline: [
      {
        status: {
          type: String,
          enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'],
        },
        at: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
