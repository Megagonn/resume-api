import mongoose, { Schema, Document, Types } from 'mongoose';
import type { CompanySubscription } from '../types/index.ts';

export interface ICompany extends Document {
  hirerId: Types.ObjectId;
  name: string;
  logo?: string;
  website?: string;
  about?: string;
  location?: string;
  subscription: CompanySubscription;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema(
  {
    plan: {
      type: String,
      enum: ['free', 'premium', 'custom'],
      default: 'free',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'past_due', 'cancelled'],
      default: 'active',
      required: true,
    },
    maxOpenJobs: { type: Number, default: undefined },
    featuredAllowed: { type: Boolean, default: undefined },
    fullApplicantAccess: { type: Boolean, default: undefined },
    applicantPreviewLimit: { type: Number, default: undefined },
    notes: String,
    startedAt: { type: Date, default: Date.now },
    renewsAt: Date,
  },
  { _id: false }
);

const companySchema = new Schema<ICompany>(
  {
    hirerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    logo: String,
    website: String,
    about: String,
    location: String,
    subscription: {
      type: subscriptionSchema,
      default: () => ({
        plan: 'free',
        status: 'active',
        startedAt: new Date(),
      }),
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', companySchema);
