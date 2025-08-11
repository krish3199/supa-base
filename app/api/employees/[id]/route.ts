import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { EmployeeInput } from '@/models/Employee';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken);

    const { id } = params;
    const employeeDoc = await adminDb.collection('employees').doc(id).get();

    if (!employeeDoc.exists) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const employee = {
      id: employeeDoc.id,
      ...employeeDoc.data(),
      hireDate: employeeDoc.data()?.hireDate?.toDate().toISOString().split('T')[0],
      createdAt: employeeDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(employee);
  } catch (error: any) {
    console.error('Error fetching employee:', error);
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
    const employeeData: Partial<EmployeeInput> = await req.json();

    const updateData: any = { ...employeeData };
    if (employeeData.hireDate) {
      updateData.hireDate = new Date(employeeData.hireDate);
    }

    await adminDb.collection('employees').doc(id).update(updateData);

    return NextResponse.json({ message: 'Employee updated successfully' });
  } catch (error: any) {
    console.error('Error updating employee:', error);
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
    await adminDb.collection('employees').doc(id).delete();

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
