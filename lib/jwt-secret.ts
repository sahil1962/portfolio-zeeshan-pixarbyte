import { randomBytes } from 'crypto';

let cachedSecret: Uint8Array | null = null;

export function getJWTSecret(): Uint8Array {
  if (cachedSecret) {
    return cachedSecret;
  }

  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

  if (!secret || secret === 'change-this-to-a-random-secret-key-at-least-32-characters-long') {
    // Generate a random secret if not set or still using default
    const generatedSecret = randomBytes(32).toString('hex');
    console.warn('⚠️  JWT_SECRET not set or using default value. Generated a random secret for this session.');
    console.warn('⚠️  Add this to your .env.local file for persistent sessions:');
    console.warn(`JWT_SECRET=${generatedSecret}`);
    cachedSecret = new TextEncoder().encode(generatedSecret);
    return cachedSecret;
  }

  cachedSecret = new TextEncoder().encode(secret);
  return cachedSecret;
}
