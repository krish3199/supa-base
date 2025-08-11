import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('session')?.value || '';

    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true); // checkRevoked: true
    return NextResponse.json({ isAuthenticated: true, user: decodedClaims });
  } catch (error: any) {
    console.error('Error verifying session cookie:', error);
    return NextResponse.json({ isAuthenticated: false, error: error.message || 'Unauthorized' }, { status: 401 });
  }
}
