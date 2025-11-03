import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware for protected routes
const authMiddleware = withAuth(
  function middleware(_req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Main middleware that adds pathname to headers and handles auth
export default function middleware(req: NextRequest) {
  // Add pathname to headers for all requests
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  // For protected /go/cm routes, use auth middleware
  if (req.nextUrl.pathname.startsWith("/go/cm")) {
    // @ts-expect-error - withAuth middleware signature compatibility
    const response = authMiddleware(req as any);

    // Add no-cache headers for all /go routes
    if (response instanceof NextResponse) {
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
    }

    return response;
  }

  // Add no-cache headers for all /go routes (including /go itself)
  if (req.nextUrl.pathname.startsWith("/go")) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  }

  // For all other routes, just pass through with the pathname header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Run middleware on all routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.svg).*)",
  ],
};
