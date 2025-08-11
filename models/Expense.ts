import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  expenseDate: Date;
  expenseDetails: string;
  category: string;
  amount: number;
  clientId?: mongoose.Types.ObjectId;
  clientName?: string; // Denormalized client name for easier display
  receipt?: string; // URL or path to receipt image/document
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  userId: string;
  clientId?: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  category?: string;
  notes?: string;
  createdAt: Date;
}

export interface ExpenseInput {
  userId: string;
  clientId?: string;
  description: string;
  amount: number;
  currency?: string;
  expenseDate: string; // ISO date string for input
  category?: string;
  notes?: string;
}

const ExpenseSchema: Schema = new Schema({
  expenseDate: { type: Date, required: true },
  expenseDetails: { type: String, required: true },
  category: { type: String, required: false },
  amount: { type: Number, required: true },
  clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: false },
  clientName: { type: String, required: false },
  receipt: { type: String, required: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  userId: { type: String, required: true },
  currency: { type: String, required: true },
  notes: { type: String, required: false },
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
