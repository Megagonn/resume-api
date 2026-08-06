import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  authorId: Types.ObjectId;
  published: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    published: { type: Boolean, default: false },
    publishedAt: Date,
  },
  { timestamps: true }
);

blogPostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', blogPostSchema);
