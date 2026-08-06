import mongoose, { Schema, Document, Types } from 'mongoose';
import type { OrderStatus } from '../types/index.js';

export interface IOrder extends Document {
  seekerId: Types.ObjectId;
  packageId: Types.ObjectId;
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentRef?: string;
  notes?: string;
  attachmentFileUrl?: string;
  attachmentFileName?: string;
  deliverables?: string;
  deliveryFileUrl?: string;
  deliveryFileName?: string;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    seekerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'in_progress', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentRef: String,
    notes: String,
    attachmentFileUrl: String,
    attachmentFileName: String,
    deliverables: String,
    deliveryFileUrl: String,
    deliveryFileName: String,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
