import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  clientId: mongoose.Types.ObjectId;
  clientName: string; // Denormalized client name for easier display
  serviceCost: number;
  paidAmount: number;
  pendingAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  status: 'completed' | 'partial' | 'pending' | 'overdue';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  method?: string;
  notes?: string;
  createdAt: Date;
}

export interface PaymentInput {
  clientId: string;
  amount: number;
  currency?: string;
  paymentDate: string; // ISO date string for input
  method?: string;
  notes?: string;
}

const PaymentSchema: Schema = new Schema({
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  clientName: { type: String, required: true },
  serviceCost: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  pendingAmount: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['completed', 'partial', 'pending', 'overdue'], default: 'pending' },
  notes: { type: String },
  currency: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
