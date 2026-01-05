// In-memory rate limiter for API endpoints
// Prevents abuse of OTP and payment endpoints

import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 10 * 60 * 1000);
  }

  /**
   * Check if a request should be allowed
   * @param identifier - Unique identifier (e.g., IP address + endpoint)
   * @param maxRequests - Maximum number of requests allowed
   * @param windowMs - Time window in milliseconds
   * @returns Object with allowed status and optional retryAfter seconds
   */
  check(
    identifier: string,
    maxRequests: number,
    windowMs: number
  ): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetAt) {
      // No entry or expired - create new entry
      this.limits.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      });
      return { allowed: true };
    }

    if (entry.count >= maxRequests) {
      // Limit exceeded
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      return {
        allowed: false,
        retryAfter,
      };
    }

    // Increment count and allow
    entry.count++;
    return { allowed: true };
  }

  /**
   * Reset rate limit for an identifier
   */
  reset(identifier: string): void {
    this.limits.delete(identifier);
  }

  /**
   * Clean up expired rate limit entries
   */
  private cleanup() {
    const now = Date.now();
    for (const [identifier, entry] of this.limits.entries()) {
      if (now > entry.resetAt) {
        this.limits.delete(identifier);
      }
    }
  }

  /**
   * Get the current store size (for debugging/monitoring)
   */
  getSize(): number {
    return this.limits.size;
  }
}

// Singleton instance
const rateLimiter = new RateLimiter();

/**
 * Helper function to get rate limit identifier from request
 * Combines IP address with endpoint type for granular limiting
 */
export function getRateLimitIdentifier(
  req: NextRequest,
  type: 'otp-send' | 'otp-verify' | 'payment'
): string {
  // Try to get real IP from headers (for proxied requests)
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwardedFor?.split(',')[0].trim() || realIp || 'unknown';

  return `${type}:${ip}`;
}

export default rateLimiter;
