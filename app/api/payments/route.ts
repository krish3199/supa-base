import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { PaymentInput } from '@/models/Payment';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken); // Verify user is authenticated

    const paymentsSnapshot = await adminDb.collection('payments').get();
    const payments = paymentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      paymentDate: doc.data().paymentDate?.toDate().toISOString().split('T')[0],
      createdAt: doc.data().createdAt?.toDate(),
    }));

    return NextResponse.json(payments);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
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

    await adminAuth.verifyIdToken(idToken); // Verify user is authenticated

    const paymentData: PaymentInput = await req.json();

    const newPaymentRef = await adminDb.collection('payments').add({
      ...paymentData,
      paymentDate: new Date(paymentData.paymentDate),
      createdAt: new Date(),
    });

    const newPaymentDoc = await newPaymentRef.get();
    const newPayment = {
      id: newPaymentDoc.id,
      ...newPaymentDoc.data(),
      paymentDate: newPaymentDoc.data()?.paymentDate?.toDate().toISOString().split('T')[0],
      createdAt: newPaymentDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error: any) {
    console.error('Error adding payment:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
