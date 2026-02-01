import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, customerName, items, total, orderDate } = body;

    // In production, you would use a service like:
    // - Resend (https://resend.com)
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP

    // Simulated email content
    const emailContent = {
      to,
      subject: 'Your Mathematical Notes - Download Links',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f8f9fa; padding: 30px; }
              .note-item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #2563eb; }
              .download-btn { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Purchase!</h1>
                <p>Your mathematical notes are ready for download</p>
              </div>
              <div class="content">
                <p>Dear ${customerName},</p>
                <p>Thank you for purchasing mathematical notes from Zeeshan Maths. Your order has been processed successfully.</p>

                <h3>Order Details (${orderDate})</h3>
                ${items.map((item: { title: string; price: number; pages: number }) => `
                  <div class="note-item">
                    <h4>${item.title}</h4>
                    <p>${item.pages} pages - $${item.price.toFixed(2)}</p>
                    <a href="#" class="download-btn">Download PDF</a>
                  </div>
                `).join('')}

                <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px;">
                  <strong>Total Paid: $${total.toFixed(2)}</strong>
                </div>

                <p style="margin-top: 20px;">
                  <strong>Download Instructions:</strong><br>
                  Click the "Download PDF" button for each note to save it to your device.
                  The download links are valid for 30 days.
                </p>

                <p>If you have any questions or need assistance, please don't hesitate to contact us at
                  <a href="mailto:alexander.theorem@university.edu">alexander.theorem@university.edu</a>
                </p>

                <p>Happy studying!</p>
                <p>Best regards,<br>Zeeshan</p>
              </div>
              <div class="footer">
                <p>This is an automated email. Please do not reply directly to this message.</p>
                <p>&copy; ${new Date().getFullYear()} Zeeshan Maths. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Here's where you would actually send the email
    // Example with Resend:
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'notes@drtheorem.com',
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    */

    // For demonstration, we'll just return success
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      preview: emailContent
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
