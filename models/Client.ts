import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  clientName: string;
  companyName: string;
  email: string;
  phone: string;
  address: string;
  serviceName: string;
  additionalServices: string[];
  status: 'active' | 'inactive' | 'pending';
  totalPaid: number;
  totalPending: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface ClientInput {
  name: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
}

const ClientSchema: Schema = new Schema({
  clientName: { type: String, required: true },
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  serviceName: { type: String, required: true },
  additionalServices: [{ type: String }],
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  totalPaid: { type: Number, default: 0 },
  totalPending: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
