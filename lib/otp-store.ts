// In-memory OTP storage for email verification before checkout
// OTPs are stored with their expiry time and auto-cleaned
// Pattern based on token-blacklist.ts

import crypto from 'crypto';

interface OTPEntry {
  email: string;
  otp: string;
  createdAt: number;
  expiresAt: number;
  verified: boolean;
  cartHash: string; // Prevent cart manipulation between OTP send and verify
  attempts: number; // Track verification attempts for rate limiting
}

class OTPStore {
  private store: Map<string, OTPEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired OTPs every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Create a new OTP for the given email and cart hash
   * Returns the generated 6-digit OTP
   */
  create(email: string, cartHash: string): string {
    // Generate cryptographically secure 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const now = Date.now();

    this.store.set(email.toLowerCase(), {
      email: email.toLowerCase(),
      otp,
      createdAt: now,
      expiresAt: now + 10 * 60 * 1000, // 10 minutes expiry
      verified: false,
      cartHash,
      attempts: 0,
    });

    return otp;
  }

  /**
   * Verify an OTP for the given email
   * Returns success status and error message if failed
   */
  verify(
    email: string,
    otp: string,
    cartHash: string
  ): { success: boolean; error?: string } {
    const entry = this.store.get(email.toLowerCase());

    if (!entry) {
      return { success: false, error: 'OTP not found or expired' };
    }

    // Check if OTP has expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(email.toLowerCase());
      return { success: false, error: 'OTP expired' };
    }

    // Check if OTP was already verified (single-use enforcement)
    if (entry.verified) {
      return { success: false, error: 'OTP already used' };
    }

    // Check if cart was modified after OTP was sent
    if (entry.cartHash !== cartHash) {
      return {
        success: false,
        error: 'Cart was modified. Please request a new verification code.',
      };
    }

    // Check attempt limit (prevent brute force)
    if (entry.attempts >= 3) {
      this.store.delete(email.toLowerCase());
      return {
        success: false,
        error: 'Too many failed attempts. Please request a new code.',
      };
    }

    // Increment attempt counter
    entry.attempts++;

    // Verify the OTP
    if (entry.otp !== otp) {
      return { success: false, error: 'Invalid OTP' };
    }

    // Mark as verified
    entry.verified = true;
    return { success: true };
  }

  /**
   * Check if an email has a verified OTP
   * Used to ensure OTP was verified before allowing payment
   */
  isVerified(email: string): boolean {
    const entry = this.store.get(email.toLowerCase());
    return entry
      ? entry.verified && Date.now() <= entry.expiresAt
      : false;
  }

  /**
   * Delete an OTP entry (e.g., after successful payment)
   */
  delete(email: string): void {
    this.store.delete(email.toLowerCase());
  }

  /**
   * Clean up expired OTP entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [email, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(email);
      }
    }
  }

  /**
   * Get the current store size (for debugging/monitoring)
   */
  getSize(): number {
    return this.store.size;
  }

  /**
   * Get cart hash for a verified OTP (used to validate cart hasn't changed)
   */
  getCartHash(email: string): string | null {
    const entry = this.store.get(email.toLowerCase());
    return entry && entry.verified ? entry.cartHash : null;
  }
}

// Singleton instance
const otpStore = new OTPStore();

export default otpStore;
