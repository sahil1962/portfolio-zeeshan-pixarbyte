import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import sgMail from '@sendgrid/mail';
import { getPresignedDownloadUrl } from '@/app/lib/r2';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface PurchaseItem {
  key: string;
  title: string;
  price: number;
  downloadUrl?: string;
}

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
      const metadata = paymentIntent.metadata;

      const email = metadata.email;

      // Check if email was already sent
      if (metadata.emailSent === 'true') {
        return NextResponse.json({ received: true });
      }

      // Reconstruct items from chunked metadata (items_0, items_1, etc.)
      let itemsJson = '';
      let chunkIndex = 0;
      while (metadata[`items_${chunkIndex}`]) {
        itemsJson += metadata[`items_${chunkIndex}`];
        chunkIndex++;
      }

      // Parse compressed items format: { k: key, t: title, p: price }
      const compressedItems = JSON.parse(itemsJson);
      const itemsArray = compressedItems.map((item: { k: string; t: string; p: number }) => ({
        key: item.k,
        title: item.t,
        price: item.p,
      }));

      const total = paymentIntent.amount / 100;

      // Generate presigned download URLs (7-day expiry)
      const itemsWithUrls = await Promise.all(
        itemsArray.map(async (item: PurchaseItem) => ({
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

      // Mark email as sent in payment intent metadata to prevent duplicates
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { ...metadata, emailSent: 'true' },
      });

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
  items: Array<PurchaseItem & { downloadUrl: string }>,
  total: number,
  paymentIntentId: string
): string {
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
          .transaction-info { font-size: 12px; color: #999; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Purchase!</h1>
          </div>
          <div class="content">
            <p class="greeting">Dear Student,</p>

            <p class="message">Thank you for your purchase!</p>
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
              <a href="mailto:${process.env.SENDGRID_FROM_EMAIL}">${process.env.SENDGRID_FROM_EMAIL}</a>
            </div>

            <p class="message">We hope you find these resources useful and wish you all the best with your A Level Maths studies.</p>

            <div class="signature">
              <p>Kind regards,</p>
              <p><strong>Zeeshan Zamurred Maths</strong></p>
            </div>

            <div class="transaction-info">
              Transaction ID: ${paymentIntentId} | Total: $${total.toFixed(2)}
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
