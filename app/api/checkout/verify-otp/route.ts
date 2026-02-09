import { NextRequest, NextResponse } from 'next/server';
import otpStore from '@/lib/otp-store';
import rateLimiter, { getRateLimitIdentifier } from '@/lib/rate-limiter';
import Stripe from 'stripe';
import { listPDFs } from '@/app/lib/r2';

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

    // Server-side price validation - NEVER trust client prices
    const serverPDFs = await listPDFs();
    const priceMap = new Map(serverPDFs.map(pdf => [pdf.key, parseFloat(pdf.price || '0')]));

    // Recalculate total from server prices
    let serverTotal = 0;
    for (const item of items) {
      const itemKey = item.key || item.id;
      const serverPrice = priceMap.get(itemKey);
      if (serverPrice === undefined) {
        return NextResponse.json(
          { error: `Product not found: ${item.title}` },
          { status: 400 }
        );
      }
      serverTotal += serverPrice;
    }

    // Allow small floating point differences (0.01)
    if (Math.abs(serverTotal - total) > 0.01) {
      console.warn(`Price mismatch detected: client=${total}, server=${serverTotal}`);
      return NextResponse.json(
        { error: 'Price mismatch detected. Please refresh and try again.' },
        { status: 400 }
      );
    }

    // Handle free items (total = 0)
    if (total === 0) {
      // For free items, send email with download links
      try {
        const { sendEmail } = await import('@/lib/mailgun');
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
        await sendEmail({
          to: email,
          subject: 'Your Free Maths Notes - Download Links',
          html: generateFreeDownloadEmailHTML(itemsWithUrls),
        });
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

    // Create Stripe Payment Intent
    // Stripe metadata has 500 char limit per value, so we compress item data
    // Store ALL items (both free and paid) so email includes everything
    const compressedItems = items.map((item: { id: string; title: string; price: number; key?: string }) => ({
      k: item.key || item.id, // key for R2 download
      t: item.title.substring(0, 50), // truncate title to 50 chars
      p: item.price,
    }));

    // Split items across multiple metadata fields if needed (each field max 500 chars)
    const itemsJson = JSON.stringify(compressedItems);
    const metadata: Record<string, string> = {
      email,
      cartHash,
      itemCount: items.length.toString(),
    };

    // Split items JSON into chunks of 490 chars (leaving room for safety)
    const chunkSize = 490;
    for (let i = 0; i < itemsJson.length; i += chunkSize) {
      const chunkIndex = Math.floor(i / chunkSize);
      metadata[`items_${chunkIndex}`] = itemsJson.substring(i, i + chunkSize);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
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

function generateFreeDownloadEmailHTML(items: Array<{ title: string; downloadUrl: string }>): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: normal; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 16px; margin-bottom: 20px; }
          .message { font-size: 15px; color: #555; margin-bottom: 25px; }
          .download-section { margin: 30px 0; }
          .download-item { background: #fff8f5; padding: 20px; margin: 15px 0; border-radius: 8px; border: 1px solid #fed7aa; }
          .download-item h3 { margin: 0 0 15px 0; color: #ea580c; font-size: 16px; }
          .download-btn { display: inline-block; background: #ea580c; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; }
          .help-text { font-size: 14px; color: #666; margin: 25px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
          .help-text a { color: #ea580c; }
          .signature { margin-top: 30px; font-size: 15px; }
          .signature p { margin: 5px 0; }
          .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; background: #f9fafb; }
          .expiry-note { font-size: 12px; color: #999; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Free Resources Are Ready!</h1>
          </div>
          <div class="content">
            <p class="greeting">Dear Student,</p>

            <p class="message">Thank you for your interest!</p>
            <p class="message">Your A Level Maths resources are now ready to download.</p>
            <p class="message">You can access them using the links below:</p>

            <div class="download-section">
              ${items
                .map(
                  (item) => `
                <div class="download-item">
                  <h3>${item.title}</h3>
                  <a href="${item.downloadUrl}" class="download-btn">Download your resource</a>
                  <p class="expiry-note">Link expires in 7 days</p>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="help-text">
              If you have any trouble accessing the material or have any questions, feel free to reply to this email and we'll be happy to help.
              <br><br>
              <a href="mailto:${process.env.MAILGUN_FROM_EMAIL}">${process.env.MAILGUN_FROM_EMAIL}</a>
            </div>

            <p class="message">We hope you find these resources useful and wish you all the best with your A Level Maths studies.</p>

            <div class="signature">
              <p>Kind regards,</p>
              <p><strong>Zeeshan Zamurred Maths</strong></p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Zeeshan Zamurred Maths. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
