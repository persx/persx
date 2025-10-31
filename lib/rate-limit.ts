import { NextRequest } from "next/server";

interface RateLimitConfig {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max requests per interval
}

class RateLimiter {
  private cache: Map<string, number[]>;
  private interval: number;
  private uniqueTokenPerInterval: number;

  constructor(config: RateLimitConfig) {
    this.cache = new Map();
    this.interval = config.interval;
    this.uniqueTokenPerInterval = config.uniqueTokenPerInterval;
  }

  check(identifier: string): { success: boolean; remaining: number; reset: number } {
    const now = Date.now();
    const tokenCache = this.cache.get(identifier) || [];

    // Remove timestamps outside the current window
    const validTokens = tokenCache.filter(timestamp => now - timestamp < this.interval);

    if (validTokens.length >= this.uniqueTokenPerInterval) {
      const oldestToken = Math.min(...validTokens);
      const resetTime = oldestToken + this.interval;

      return {
        success: false,
        remaining: 0,
        reset: resetTime,
      };
    }

    // Add current request timestamp
    validTokens.push(now);
    this.cache.set(identifier, validTokens);

    return {
      success: true,
      remaining: this.uniqueTokenPerInterval - validTokens.length,
      reset: now + this.interval,
    };
  }

  // Clean up old entries periodically
  cleanup() {
    const now = Date.now();
    for (const [identifier, timestamps] of this.cache.entries()) {
      const validTokens = timestamps.filter(timestamp => now - timestamp < this.interval);
      if (validTokens.length === 0) {
        this.cache.delete(identifier);
      } else {
        this.cache.set(identifier, validTokens);
      }
    }
  }
}

// Rate limiters for different endpoints
export const loginRateLimiter = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5, // 5 attempts per 15 minutes
});

export const formRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 3, // 3 submissions per minute
});

export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 10, // 10 requests per minute
});

// Helper to get identifier from request
export function getIdentifier(request: NextRequest): string {
  // Try to get IP address from various headers
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] :
             request.headers.get("x-real-ip") ||
             "unknown";

  return ip;
}

// Cleanup job - run periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    loginRateLimiter.cleanup();
    formRateLimiter.cleanup();
    apiRateLimiter.cleanup();
  }, 60 * 1000); // Clean up every minute
}
