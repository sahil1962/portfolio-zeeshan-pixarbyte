// In-memory token blacklist for single-use magic links
// Tokens are stored with their expiry time and auto-cleaned

interface BlacklistEntry {
  usedAt: number;
  expiresAt: number;
}

class TokenBlacklist {
  private blacklist: Map<string, BlacklistEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired tokens every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  isBlacklisted(tokenId: string): boolean {
    const entry = this.blacklist.get(tokenId);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.blacklist.delete(tokenId);
      return false;
    }

    return true;
  }

  add(tokenId: string, expiryMinutes: number = 30) {
    const now = Date.now();
    this.blacklist.set(tokenId, {
      usedAt: now,
      expiresAt: now + expiryMinutes * 60 * 1000,
    });
  }

  private cleanup() {
    const now = Date.now();
    for (const [tokenId, entry] of this.blacklist.entries()) {
      if (now > entry.expiresAt) {
        this.blacklist.delete(tokenId);
      }
    }
  }

  getSize(): number {
    return this.blacklist.size;
  }
}

// Singleton instance
const tokenBlacklist = new TokenBlacklist();

export default tokenBlacklist;
