import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { EmployeeInput } from '@/models/Employee';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    const idToken = authHeader?.split('Bearer ')[1];

    if (!idToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await adminAuth.verifyIdToken(idToken); // Verify user is authenticated

    const employeesSnapshot = await adminDb.collection('employees').get();
    const employees = employeesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      hireDate: doc.data().hireDate?.toDate().toISOString().split('T')[0],
      createdAt: doc.data().createdAt?.toDate(),
    }));

    return NextResponse.json(employees);
  } catch (error: any) {
    console.error('Error fetching employees:', error);
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

    const employeeData: EmployeeInput = await req.json();

    const newEmployeeRef = await adminDb.collection('employees').add({
      ...employeeData,
      hireDate: employeeData.hireDate ? new Date(employeeData.hireDate) : null,
      createdAt: new Date(),
    });

    const newEmployeeDoc = await newEmployeeRef.get();
    const newEmployee = {
      id: newEmployeeDoc.id,
      ...newEmployeeDoc.data(),
      hireDate: newEmployeeDoc.data()?.hireDate?.toDate().toISOString().split('T')[0],
      createdAt: newEmployeeDoc.data()?.createdAt?.toDate(),
    };

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error: any) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
