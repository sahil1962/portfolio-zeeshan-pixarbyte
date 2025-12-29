import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import { getJWTSecret } from '@/lib/jwt-secret';
import tokenBlacklist from '@/lib/token-blacklist';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login?error=missing_token', request.url));
    }

    // Verify the magic link token
    const { payload } = await jwtVerify(token, getJWTSecret());

    // Check if this is a magic link token
    if (payload.type !== 'magic_link') {
      return NextResponse.redirect(
        new URL('/admin/login?error=invalid_token', request.url)
      );
    }

    // Check if token has already been used (nonce blacklist)
    const nonce = payload.nonce as string;
    if (!nonce || tokenBlacklist.isBlacklisted(nonce)) {
      return NextResponse.redirect(
        new URL('/admin/login?error=token_already_used', request.url)
      );
    }

    // Blacklist this token (valid for 30 minutes to cover token expiry)
    tokenBlacklist.add(nonce, 30);

    // Create a session token (valid for 24 hours)
    const sessionToken = await new SignJWT({
      email: payload.email,
      type: 'session'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .setIssuedAt()
      .sign(getJWTSecret());

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/admin', request.url));

    // Set HTTP-only cookie
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.redirect(
      new URL('/admin/login?error=invalid_token', request.url)
    );
  }
}
