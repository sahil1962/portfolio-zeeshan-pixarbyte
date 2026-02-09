interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

interface MailgunResponse {
  id: string;
  message: string;
}

interface MailgunError {
  message: string;
}

export async function sendEmail(options: EmailOptions): Promise<MailgunResponse> {
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL;

  if (!domain || !apiKey || !fromEmail) {
    throw new Error('Mailgun configuration missing. Check MAILGUN_DOMAIN, MAILGUN_API_KEY, and MAILGUN_FROM_EMAIL environment variables.');
  }

  const form = new FormData();
  form.append('from', fromEmail);
  form.append('to', options.to);
  form.append('subject', options.subject);
  form.append('html', options.html);

  if (options.text) {
    form.append('text', options.text);
  }

  if (options.replyTo) {
    form.append('h:Reply-To', options.replyTo);
  }

  // Use EU API endpoint if MAILGUN_REGION is set to 'eu', otherwise use US
  const apiBase = process.env.MAILGUN_REGION === 'eu'
    ? 'https://api.eu.mailgun.net'
    : 'https://api.mailgun.net';

  const response = await fetch(
    `${apiBase}/v3/${domain}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      },
      body: form,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' })) as MailgunError;
    throw new Error(`Mailgun API error: ${errorData.message || response.statusText}`);
  }

  return response.json() as Promise<MailgunResponse>;
}
