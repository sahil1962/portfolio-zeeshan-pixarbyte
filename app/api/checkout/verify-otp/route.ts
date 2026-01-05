import { NextRequest, NextResponse } from 'next/server';
import otpStore from '@/lib/otp-store';
import rateLimiter, { getRateLimitIdentifier } from '@/lib/rate-limiter';
import Stripe from 'stripe';

// Check if Stripe key is configured
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not configured');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Rate limiting: 5 requests per 10 minutes per IP
    const identifier = getRateLimitIdentifier(request, 'otp-verify');
    const rateLimit = rateLimiter.check(identifier, 5, 10 * 60 * 1000);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Too many attempts. Please try again in ${rateLimit.retryAfter} seconds.`,
        },
        { status: 429 }
      );
    }

    const { email, otp, cartHash, items, total } = await request.json();

    // Validation
    if (!email || !otp || !cartHash || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify OTP
    const verification = otpStore.verify(email, otp, cartHash);

    if (!verification.success) {
      return NextResponse.json({ error: verification.error }, { status: 400 });
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        email,
        cartHash,
        items: JSON.stringify(
          items.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            key: item.key || item.id, // R2 key for download
          }))
        ),
      },
      description: `Purchase of ${items.length} maths note(s)`,
      receipt_email: email,
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Verify OTP error:', error);

    let errorMessage = 'Failed to verify code and create payment';
    if (error instanceof Stripe.errors.StripeError) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
