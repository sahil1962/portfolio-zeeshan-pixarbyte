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
    if (!email || !otp || !cartHash || !items || total === undefined || total === null) {
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

    // Handle free items (total = 0)
    if (total === 0) {
      // For free items, send email with download links
      try {
        const sgMail = (await import('@sendgrid/mail')).default;
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

        const { getPresignedDownloadUrl } = await import('@/app/lib/r2');

        // Generate presigned download URLs (7-day expiry)
        const itemsWithUrls = await Promise.all(
          items.map(async (item: { id: string; title: string; key?: string }) => ({
            title: item.title,
            downloadUrl: await getPresignedDownloadUrl(
              item.key || item.id,
              7 * 24 * 3600 // 7 days
            ),
          }))
        );

        // Send email
        const msg = {
          to: email,
          from: process.env.SENDGRID_FROM_EMAIL!,
          subject: 'Your Free Maths Notes - Download Links',
          html: generateFreeDownloadEmailHTML(itemsWithUrls),
        };

        await sgMail.send(msg);
        console.log(`✅ Free download email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send free download email:', emailError);
        // Don't fail the request if email fails - still return success
      }

      return NextResponse.json({
        success: true,
        isFree: true,
        message: 'Free items verified. Download links sent to your email.',
        items: items.map((item: { id: string; title: string; key?: string }) => ({
          id: item.id,
          title: item.title,
          key: item.key || item.id,
        })),
      });
    }

    // Create Stripe Payment Intent for paid items
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
          items.map((item: { id: string; title: string; price: number; key?: string }) => ({
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

    // In development mode, webhooks don't work, so we'll send email on payment success
    // In production, the webhook (app/api/checkout/webhook/route.ts) handles this
    console.log('💳 Payment intent created:', paymentIntent.id);
    console.log('📧 In production, webhook will send email to:', email);

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

function generateFreeDownloadEmailHTML(items: Array<{ title: string; downloadUrl: string }>): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { background: #f8f9fa; padding: 30px; }
          .note-item { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #ea580c; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .note-item h3 { margin: 0 0 10px 0; color: #ea580c; font-size: 18px; }
          .download-btn { display: inline-block; background: #ea580c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold; transition: background 0.2s; }
          .download-btn:hover { background: #c2410c; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; background: #f8f9fa; }
          .info-box { margin-top: 30px; padding: 20px; background: #fed7aa; border-radius: 8px; border-left: 4px solid #ea580c; }
          .info-box h4 { margin: 0 0 10px 0; color: #9a3412; font-size: 16px; }
          .info-box ul { margin: 0; padding-left: 20px; color: #9a3412; }
          .info-box li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Free Notes Are Ready!</h1>
            <p>Download your maths notes below</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your interest! Your free notes are ready for download:</p>

            ${items
              .map(
                (item) => `
              <div class="note-item">
                <h3>${item.title}</h3>
                <a href="${item.downloadUrl}" class="download-btn">📥 Download PDF</a>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">⏰ Download link expires in 7 days</p>
              </div>
            `
              )
              .join('')}

            <div class="info-box">
              <h4>📋 Download Instructions</h4>
              <ul>
                <li>Click the "Download PDF" button for each note</li>
                <li>Save the files to your device</li>
                <li>Links are valid for 7 days</li>
                <li>If you have any issues, contact us</li>
              </ul>
            </div>

            <p style="margin-top: 30px; font-size: 14px;">If you have any questions, reply to this email or contact us at <a href="mailto:${
              process.env.SENDGRID_FROM_EMAIL
            }" style="color: #ea580c;">${process.env.SENDGRID_FROM_EMAIL}</a></p>

            <p style="margin-top: 20px; font-size: 16px; font-weight: bold;">Happy studying! 📚</p>
            <p style="margin: 5px 0 0 0;"><strong>Zeeshan Maths</strong></p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply directly to this message.</p>
            <p>&copy; ${new Date().getFullYear()} Zeeshan Maths. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
