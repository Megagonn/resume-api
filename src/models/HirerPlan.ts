import mongoose, { Schema, Document } from 'mongoose';
import type { HirerPlanSlug } from '../types/index.js';

export interface IHirerPlan extends Document {
  slug: HirerPlanSlug;
  name: string;
  price: number | null;
  currency: string;
  description: string;
  features: string[];
  active: boolean;
  maxOpenJobs: number | null;
  featuredAllowed: boolean;
  fullApplicantAccess: boolean;
  applicantPreviewLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const hirerPlanSchema = new Schema<IHirerPlan>(
  {
    slug: {
      type: String,
      enum: ['free', 'premium', 'custom'],
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    price: { type: Number, default: null },
    currency: { type: String, default: 'NGN' },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    active: { type: Boolean, default: true },
    maxOpenJobs: { type: Number, default: null },
    featuredAllowed: { type: Boolean, default: false },
    fullApplicantAccess: { type: Boolean, default: false },
    applicantPreviewLimit: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export const HirerPlan = mongoose.model<IHirerPlan>('HirerPlan', hirerPlanSchema);
