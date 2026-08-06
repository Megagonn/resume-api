import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  slug: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  popular: boolean;
  sellaUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const packageSchema = new Schema<IPackage>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    popular: { type: Boolean, default: false },
    sellaUrl: String,
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Package = mongoose.model<IPackage>('Package', packageSchema);
