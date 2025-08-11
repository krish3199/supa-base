import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { ClientInput } from '@/models/Client';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken); // Verify user is authenticated

    const clientsSnapshot = await adminDb.collection('clients').get();
    const clients = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(), // Convert Firestore Timestamp to Date
    }));

    return NextResponse.json(clients);
  } catch (error: any) {
    console.error('Error fetching clients:', error);
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

    const clientData: ClientInput = await req.json();

    const newClientRef = await adminDb.collection('clients').add({
      ...clientData,
      createdAt: new Date(),
    });

    const newClientDoc = await newClientRef.get();
    const newClient = {
      id: newClientDoc.id,
      ...newClientDoc.data(),
      createdAt: newClientDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(newClient, { status: 201 });
  } catch (error: any) {
    console.error('Error adding client:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
