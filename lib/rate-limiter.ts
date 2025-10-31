/**
 * Rate Limiter Utility
 *
 * Implements a simple token bucket rate limiting algorithm.
 * Tracks requests by IP address and enforces configurable limits.
 *
 * Note: Uses in-memory storage. For production at scale, consider
 * migrating to Vercel KV, Redis, or similar distributed store.
 */

interface RateLimitConfig {
  /** Maximum number of requests allowed in the time window */
  maxRequests: number;
  /** Time window in milliseconds */
  windowMs: number;
  /** Optional custom message when rate limit is exceeded */
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  });
}, 5 * 60 * 1000);

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier for the client (usually IP address)
 * @param config - Rate limit configuration
 * @returns Object with { limited: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, entry);
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  const limited = entry.count > config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    limited,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client identifier from request
 * Uses IP address from various headers (Vercel, Cloudflare, etc.)
 */
export function getClientIdentifier(request: Request): string {
  const headers = request.headers;

  // Try various IP headers (Vercel provides x-forwarded-for)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return "unknown";
}

/**
 * Common rate limit configurations for different endpoint types
 */
export const RATE_LIMITS = {
  // Authentication endpoints - strict limits
  AUTH: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many authentication attempts. Please try again later.",
  },

  // Form submissions - moderate limits
  FORM_SUBMISSION: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many submissions. Please try again later.",
  },

  // API calls - generous limits
  API: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: "Too many requests. Please slow down.",
  },

  // Contact form - strict limits to prevent spam
  CONTACT: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many contact form submissions. Please try again later.",
  },
} as const;
