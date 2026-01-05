import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import otpStore from '@/lib/otp-store';
import rateLimiter, { getRateLimitIdentifier } from '@/lib/rate-limiter';
import crypto from 'crypto';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    // Rate limiting: 3 requests per 10 minutes per IP
    const identifier = getRateLimitIdentifier(request, 'otp-send');
    const rateLimit = rateLimiter.check(identifier, 3, 10 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
        },
        { status: 429 }
      );
    }

    const { email, cartTotal, items } = await request.json();

    // Validation
    if (!email || !cartTotal || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate cart hash to prevent manipulation
    const cartHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(items))
      .digest('hex');

    // Generate and store OTP
    const otp = otpStore.create(email, cartHash);

    // Send OTP via email
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL!,
      subject: 'Your Verification Code - Maths Notes Purchase',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .header h2 { margin: 0; font-size: 24px; }
              .content { background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px; }
              .otp-box { background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #2563eb; }
              .otp-code { margin: 0; font-size: 36px; color: #2563eb; letter-spacing: 8px; font-weight: bold; }
              .info-box { margin-top: 20px; padding: 15px; background: #e0f2fe; border-left: 4px solid #2563eb; border-radius: 4px; }
              .info-box p { margin: 5px 0; font-size: 14px; color: #0369a1; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Verify Your Email</h2>
              </div>
              <div class="content">
                <p style="font-size: 16px; color: #333; margin-bottom: 10px;">Hello,</p>
                <p style="font-size: 16px; color: #333;">You're almost ready to complete your purchase. Please use the verification code below:</p>

                <div class="otp-box">
                  <p class="otp-code">${otp}</p>
                </div>

                <p style="color: #666; font-size: 14px; text-align: center;">This code will expire in <strong>10 minutes</strong>.</p>
                <p style="color: #666; font-size: 14px; text-align: center;">If you didn't request this code, please ignore this email.</p>

                <div class="info-box">
                  <p style="margin: 0; font-size: 14px;"><strong>Order Summary:</strong></p>
                  <p style="margin: 5px 0 0 0;"><strong>Items:</strong> ${items.length} note(s)</p>
                  <p style="margin: 5px 0 0 0;"><strong>Total:</strong> $${cartTotal.toFixed(2)}</p>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply directly to this message.</p>
                <p>&copy; ${new Date().getFullYear()} Zeeshan Maths. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      cartHash, // Return to client for verification step
    });
  } catch (error) {
    console.error('Send OTP error:', error);

    let errorMessage = 'Failed to send verification code';
    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as {
        response?: { body?: { errors?: Array<{ message: string }> } };
      };
      if (sgError.response?.body?.errors) {
        errorMessage = sgError.response.body.errors
          .map((e) => e.message)
          .join(', ');
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
