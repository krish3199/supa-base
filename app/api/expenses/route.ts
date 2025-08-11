import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { ExpenseInput } from '@/models/Expense';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const expensesSnapshot = await adminDb.collection('expenses').where('userId', '==', userId).get();
    const expenses = expensesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      expenseDate: doc.data().expenseDate?.toDate().toISOString().split('T')[0], // Convert to YYYY-MM-DD string
      createdAt: doc.data().createdAt?.toDate(),
    }));

    return NextResponse.json(expenses);
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const expenseData: ExpenseInput = await req.json();

    const newExpenseRef = await adminDb.collection('expenses').add({
      ...expenseData,
      userId: userId, // Ensure expense is linked to the authenticated user
      expenseDate: new Date(expenseData.expenseDate), // Convert string to Date object for Firestore
      createdAt: new Date(),
    });

    const newExpenseDoc = await newExpenseRef.get();
    const newExpense = {
      id: newExpenseDoc.id,
      ...newExpenseDoc.data(),
      expenseDate: newExpenseDoc.data()?.expenseDate?.toDate().toISOString().split('T')[0],
      createdAt: newExpenseDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    console.error('Error adding expense:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
