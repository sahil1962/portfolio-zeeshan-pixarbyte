# Email Setup Guide

This API route handles sending PDF notes to customers after purchase.

## Current Status
The API is set up with email preview functionality. To enable actual email sending, follow the setup below.

## Recommended Email Service: Resend

Resend is the easiest and most modern option for Next.js projects.

### Setup Instructions:

1. **Install Resend:**
```bash
npm install resend
```

2. **Get API Key:**
   - Sign up at https://resend.com
   - Get your API key from the dashboard
   - Add to `.env.local`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

3. **Verify Domain (Optional but recommended):**
   - Add your domain in Resend dashboard
   - Follow DNS verification steps
   - Use `notes@yourdomain.com` as sender

4. **Update route.ts:**
   Uncomment the Resend code in `app/api/send-notes/route.ts`:
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);

   await resend.emails.send({
     from: 'notes@yourdomain.com',
     to: emailContent.to,
     subject: emailContent.subject,
     html: emailContent.html,
   });
   ```

## Alternative Email Services

### Option 1: SendGrid
```bash
npm install @sendgrid/mail
```
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: emailContent.to,
  from: 'notes@yourdomain.com',
  subject: emailContent.subject,
  html: emailContent.html,
});
```

### Option 2: AWS SES
```bash
npm install @aws-sdk/client-ses
```
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const client = new SESClient({ region: 'us-east-1' });
const command = new SendEmailCommand({
  Source: 'notes@yourdomain.com',
  Destination: { ToAddresses: [emailContent.to] },
  Message: {
    Subject: { Data: emailContent.subject },
    Body: { Html: { Data: emailContent.html } }
  }
});
await client.send(command);
```

## Adding PDF Attachments

To attach actual PDF files to emails:

1. Store PDFs in a secure location (AWS S3, Vercel Blob, etc.)
2. Generate signed/temporary URLs for downloads
3. Include URLs in email template
4. Or attach PDFs directly:

```typescript
// With Resend
await resend.emails.send({
  from: 'notes@yourdomain.com',
  to: emailContent.to,
  subject: emailContent.subject,
  html: emailContent.html,
  attachments: [
    {
      filename: 'algebraic-topology.pdf',
      path: '/path/to/pdf/algebraic-topology.pdf'
    }
  ]
});
```

## Testing

Test emails in development:
```bash
npm run dev
```

1. Add notes to cart
2. Proceed to checkout
3. Fill in form with your email
4. Check console logs for email preview
5. Once configured, check your inbox

## Production Checklist

- [ ] Email service configured (Resend/SendGrid/SES)
- [ ] Domain verified
- [ ] Environment variables set
- [ ] PDF storage configured
- [ ] Test email delivery
- [ ] Check spam folder settings
- [ ] Set up email analytics
- [ ] Configure bounce/complaint handling
