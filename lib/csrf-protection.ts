/**
 * CSRF Protection Utilities
 *
 * Provides CSRF protection for API endpoints by validating
 * Origin and Referer headers to ensure requests come from trusted sources.
 */

/**
 * Validate that the request comes from a trusted origin
 * Prevents CSRF attacks by checking Origin and Referer headers
 */
export function validateRequestOrigin(request: Request): {
  valid: boolean;
  error?: string;
} {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Get the expected origin from environment or construct from request
  const expectedOrigins = [
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "http://localhost:3000", // Allow localhost in development
    "https://persx.ai",
    "https://www.persx.ai",
  ].filter(Boolean) as string[];

  // If no origin or referer, this might be a direct API call (not from browser)
  // In production, we might want to reject these for public forms
  if (!origin && !referer) {
    // Allow in development for testing
    if (process.env.NODE_ENV === "development") {
      return { valid: true };
    }

    return {
      valid: false,
      error: "Missing origin and referer headers",
    };
  }

  // Check if origin matches expected origins
  if (origin) {
    const isValidOrigin = expectedOrigins.some((expected) => {
      try {
        const expectedUrl = new URL(expected);
        const originUrl = new URL(origin);
        return expectedUrl.origin === originUrl.origin;
      } catch {
        return false;
      }
    });

    if (isValidOrigin) {
      return { valid: true };
    }
  }

  // Check if referer matches expected origins
  if (referer) {
    const isValidReferer = expectedOrigins.some((expected) => {
      try {
        const expectedUrl = new URL(expected);
        const refererUrl = new URL(referer);
        return refererUrl.origin === expectedUrl.origin;
      } catch {
        return false;
      }
    });

    if (isValidReferer) {
      return { valid: true };
    }
  }

  return {
    valid: false,
    error: "Request origin not allowed",
  };
}

/**
 * Middleware wrapper to add CSRF protection to API routes
 */
export function withOriginValidation(
  handler: (request: Request) => Promise<Response>
): (request: Request) => Promise<Response> {
  return async (request: Request) => {
    const validation = validateRequestOrigin(request);

    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          error: "Forbidden",
          message: validation.error,
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return handler(request);
  };
}
