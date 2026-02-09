import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailgun';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAILS?.split(',')[0].trim();

    if (!adminEmail) {
      console.error('ADMIN_EMAILS not configured');
      return NextResponse.json(
        { error: 'Contact form not configured properly' },
        { status: 500 }
      );
    }

    // Send email to admin
    await sendEmail({
      to: adminEmail,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      text: `
New contact form submission:

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">New Contact Form Submission</h2>
          </div>

          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2563eb; margin-top: 0;">Contact Information</h3>
              <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2563eb; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-left: 4px solid #2563eb; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #0369a1;">
                <strong>Reply to this message:</strong> Simply reply to this email to respond directly to ${name}
              </p>
            </div>
          </div>

          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>Received on ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NEXT_PUBLIC_NODE_ENV === 'development' && error instanceof Error ? error.message : undefined
    }, { status: 500 });
  }
}
