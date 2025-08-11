import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { ClientInput } from '@/models/Client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken);

    const { id } = params;
    const clientDoc = await adminDb.collection('clients').doc(id).get();

    if (!clientDoc.exists) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    const client = {
      id: clientDoc.id,
      ...clientDoc.data(),
      createdAt: clientDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(client);
  } catch (error: any) {
    console.error('Error fetching client:', error);
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
    const clientData: Partial<ClientInput> = await req.json();

    await adminDb.collection('clients').doc(id).update(clientData);

    return NextResponse.json({ message: 'Client updated successfully' });
  } catch (error: any) {
    console.error('Error updating client:', error);
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
    await adminDb.collection('clients').doc(id).delete();

    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
