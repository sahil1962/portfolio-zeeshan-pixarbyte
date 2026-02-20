import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailgun';
import { SignJWT } from 'jose';
import { randomBytes } from 'crypto';
import { getJWTSecret } from '@/lib/jwt-secret';

const AUTHORIZED_EMAILS = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim()) || [];

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if email is authorized
    if (!AUTHORIZED_EMAILS.includes(email)) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    // Generate a unique nonce for single-use token
    const nonce = randomBytes(16).toString('hex');

    // Create a magic link token (valid for 15 minutes)
    const token = await new SignJWT({
      email,
      nonce,
      type: 'magic_link'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15m')
      .setIssuedAt()
      .sign(getJWTSecret());

    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://zeeshanzamurred.com';
    const magicLink = `${baseUrl}/api/auth/verify?token=${token}`;

    // Send email with magic link
    await sendEmail({
      to: email,
      subject: 'Admin Login - Magic Link',
      text: `Click this link to login to your admin panel: ${magicLink}\n\nThis link will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Admin Login</h2>
          <p>Click the button below to login to your admin panel:</p>
          <a href="${magicLink}"
             style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Login to Admin Panel
          </a>
          <p style="color: #666; font-size: 14px;">This link will expire in 15 minutes and can only be used once.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this login, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    });

  } catch (error) {
    console.error('Login error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to send magic link';

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NEXT_PUBLIC_NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}
