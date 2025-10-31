import { NextRequest, NextResponse } from "next/server";

/**
 * Verify that the request comes from the same origin
 * This helps prevent CSRF attacks
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  // Only check for state-changing methods
  const method = request.method;
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  // Get the origin and referer headers
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // In production, verify origin matches host
  if (process.env.NODE_ENV === "production") {
    // Allow requests with proper origin
    if (origin) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return false;
      }
    } else if (referer) {
      // Fallback to referer if origin is not present
      const refererUrl = new URL(referer);
      if (refererUrl.host !== host) {
        return false;
      }
    } else {
      // No origin or referer in production is suspicious
      return false;
    }
  }

  return true;
}

/**
 * Create a CSRF error response
 */
export function createCsrfErrorResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid request origin. Possible CSRF attack detected.",
    },
    {
      status: 403,
      headers: {
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

/**
 * Middleware to check CSRF token
 */
export function withCsrfProtection(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    if (!verifyCsrfToken(request)) {
      return createCsrfErrorResponse();
    }
    return handler(request);
  };
}
