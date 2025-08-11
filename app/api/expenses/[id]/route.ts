import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { ExpenseInput } from '@/models/Expense';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id } = params;
    const expenseDoc = await adminDb.collection('expenses').doc(id).get();

    if (!expenseDoc.exists || expenseDoc.data()?.userId !== userId) {
      return NextResponse.json({ message: 'Expense not found or unauthorized' }, { status: 404 });
    }

    const expense = {
      id: expenseDoc.id,
      ...expenseDoc.data(),
      expenseDate: expenseDoc.data()?.expenseDate?.toDate().toISOString().split('T')[0],
      createdAt: expenseDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(expense);
  } catch (error: any) {
    console.error('Error fetching expense:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id } = params;
    const expenseData: Partial<ExpenseInput> = await req.json();

    const expenseDoc = await adminDb.collection('expenses').doc(id).get();
    if (!expenseDoc.exists || expenseDoc.data()?.userId !== userId) {
      return NextResponse.json({ message: 'Expense not found or unauthorized' }, { status: 404 });
    }

    const updateData: any = { ...expenseData };
    if (expenseData.expenseDate) {
      updateData.expenseDate = new Date(expenseData.expenseDate);
    }

    await adminDb.collection('expenses').doc(id).update(updateData);

    return NextResponse.json({ message: 'Expense updated successfully' });
  } catch (error: any) {
    console.error('Error updating expense:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { id } = params;
    const expenseDoc = await adminDb.collection('expenses').doc(id).get();

    if (!expenseDoc.exists || expenseDoc.data()?.userId !== userId) {
      return NextResponse.json({ message: 'Expense not found or unauthorized' }, { status: 404 });
    }

    await adminDb.collection('expenses').doc(id).delete();

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
