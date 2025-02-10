import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(_request: NextRequest): Promise<NextResponse> {
  // For all routes, continue normally
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match paths that need authentication:
     * - /account (customer account pages)
     * - /api (API routes except auth)
     * Skip:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/account/:path*',
    '/api/((?!auth|webhooks).*)',
  ],
} as const