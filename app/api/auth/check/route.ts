import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getJWTSecret } from '@/lib/jwt-secret';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, getJWTSecret());

    return NextResponse.json({
      authenticated: true,
      email: payload.email
    });

  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
