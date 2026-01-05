import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import { getPresignedDownloadUrl } from '@/app/lib/r2';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const { email, items } = paymentIntent.metadata;
      const itemsArray = JSON.parse(items);
      const total = paymentIntent.amount / 100;

      // Generate presigned download URLs (7-day expiry)
      const itemsWithUrls = await Promise.all(
        itemsArray.map(async (item: any) => ({
          ...item,
          downloadUrl: await getPresignedDownloadUrl(
            item.key,
            7 * 24 * 3600
          ), // 7 days
        }))
      );

      // Send email with download links
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL!,
        subject: 'Your Maths Notes - Download Links',
        html: generatePurchaseEmailHTML(
          itemsWithUrls,
          total,
          paymentIntent.id
        ),
      };

      await sgMail.send(msg);

      console.log(
        `✅ Purchase email sent to ${email} for payment ${paymentIntent.id}`
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      // Log failed payments (NO EMAIL SENT)
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(
        `❌ Payment failed for ${paymentIntent.metadata.email} - No email sent`
      );
    } else {
      // Log other events
      console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

function generatePurchaseEmailHTML(
  items: any[],
  total: number,
  paymentIntentId: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
          .content { background: #f8f9fa; padding: 30px; }
          .note-item { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #2563eb; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .note-item h3 { margin: 0 0 10px 0; color: #2563eb; font-size: 18px; }
          .note-item p { color: #666; margin: 5px 0; font-size: 14px; }
          .download-btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold; transition: background 0.2s; }
          .download-btn:hover { background: #1d4ed8; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-radius: 0 0 10px 10px; background: #f8f9fa; }
          .total-box { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
          .total-box p { margin: 5px 0; }
          .info-box { margin-top: 30px; padding: 20px; background: #e0f2fe; border-radius: 8px; border-left: 4px solid #2563eb; }
          .info-box h4 { margin: 0 0 10px 0; color: #0369a1; font-size: 16px; }
          .info-box ul { margin: 0; padding-left: 20px; color: #0369a1; }
          .info-box li { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Purchase!</h1>
            <p>Your maths notes are ready for download</p>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Your order has been processed successfully. Download your notes below:</p>

            ${items
              .map(
                (item) => `
              <div class="note-item">
                <h3>${item.title}</h3>
                <p>Price: $${item.price.toFixed(2)}</p>
                <a href="${item.downloadUrl}" class="download-btn">📥 Download PDF</a>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">⏰ Download link expires in 7 days</p>
              </div>
            `
              )
              .join('')}

            <div class="total-box">
              <p style="margin: 0; font-size: 18px;"><strong>Total Paid:</strong> <span style="color: #2563eb;">$${total.toFixed(
                2
              )}</span></p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">Transaction ID: ${paymentIntentId}</p>
            </div>

            <div class="info-box">
              <h4>📋 Download Instructions</h4>
              <ul>
                <li>Click the "Download PDF" button for each note</li>
                <li>Save the files to your device</li>
                <li>Links are valid for 7 days from purchase</li>
                <li>If you have any issues, contact us with your transaction ID</li>
              </ul>
            </div>

            <p style="margin-top: 30px; font-size: 14px;">If you have any questions, reply to this email or contact us at <a href="mailto:${
              process.env.SENDGRID_FROM_EMAIL
            }" style="color: #2563eb;">${
    process.env.SENDGRID_FROM_EMAIL
  }</a></p>

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
