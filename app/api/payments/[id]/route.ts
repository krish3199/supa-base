import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { PaymentInput } from '@/models/Payment';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken);

    const { id } = params;
    const paymentDoc = await adminDb.collection('payments').doc(id).get();

    if (!paymentDoc.exists) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 });
    }

    const payment = {
      id: paymentDoc.id,
      ...paymentDoc.data(),
      paymentDate: paymentDoc.data()?.paymentDate?.toDate().toISOString().split('T')[0],
      createdAt: paymentDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(payment);
  } catch (error: any) {
    console.error('Error fetching payment:', error);
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

    await adminAuth.verifyIdToken(idToken);

    const { id } = params;
    const paymentData: Partial<PaymentInput> = await req.json();

    const updateData: any = { ...paymentData };
    if (paymentData.paymentDate) {
      updateData.paymentDate = new Date(paymentData.paymentDate);
    }

    await adminDb.collection('payments').doc(id).update(updateData);

    return NextResponse.json({ message: 'Payment updated successfully' });
  } catch (error: any) {
    console.error('Error updating payment:', error);
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

    await adminAuth.verifyIdToken(idToken);

    const { id } = params;
    await adminDb.collection('payments').doc(id).delete();

    return NextResponse.json({ message: 'Payment deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
