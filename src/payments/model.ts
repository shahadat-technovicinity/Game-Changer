// models/Payment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed';
  stripePaymentIntentId: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  stripePaymentIntentId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IPayment>('Payment', paymentSchema);
