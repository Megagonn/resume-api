import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceFaq {
  question: string;
  answer: string;
  sortOrder?: number;
}

export interface IServiceTestimonial {
  name: string;
  role: string;
  company?: string;
  quote: string;
  rating?: number;
}

export interface IServiceExample {
  title: string;
  description: string;
  highlight?: string;
}

export interface IServiceBenefit {
  title: string;
  description: string;
}

export interface IServiceProcessStep {
  title: string;
  description: string;
}

export interface IServicePage extends Document {
  slug: string;
  published: boolean;
  sortOrder: number;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  headline: string;
  subheadline: string;
  benefits: IServiceBenefit[];
  processSteps: IServiceProcessStep[];
  faqs: IServiceFaq[];
  testimonials: IServiceTestimonial[];
  examples: IServiceExample[];
  recommendedPackageSlug: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  createdAt: Date;
  updatedAt: Date;
}

const servicePageSchema = new Schema<IServicePage>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    keywords: [{ type: String }],
    eyebrow: { type: String, required: true },
    headline: { type: String, required: true },
    subheadline: { type: String, required: true },
    benefits: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    processSteps: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        sortOrder: Number,
      },
    ],
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, required: true },
        company: String,
        quote: { type: String, required: true },
        rating: Number,
      },
    ],
    examples: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        highlight: String,
      },
    ],
    recommendedPackageSlug: { type: String, required: true },
    primaryCtaLabel: { type: String, required: true },
    primaryCtaHref: { type: String, required: true },
  },
  { timestamps: true }
);

servicePageSchema.index({ metaTitle: 'text', metaDescription: 'text', keywords: 'text' });

export const ServicePage = mongoose.model<IServicePage>('ServicePage', servicePageSchema);
