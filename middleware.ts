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
    return authMiddleware(req as any);
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
