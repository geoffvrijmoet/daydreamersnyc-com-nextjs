import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    // Allow Shopify checkout URLs to pass through
    if (request.nextUrl.pathname.startsWith('/cart/c/') || request.nextUrl.pathname.startsWith('/checkouts/')) {
      return NextResponse.rewrite(new URL(`https://daydreamers-pet-supply.myshopify.com${request.nextUrl.pathname}${request.nextUrl.search}`, request.url))
    }

    // Add authentication logic here when we implement Shopify customer accounts
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Return to homepage on error
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match paths that need authentication:
     * - /account (customer account pages)
     * - /api (API routes except auth)
     * - /cart/c/* (Shopify cart URLs)
     * - /checkouts/* (Shopify checkout URLs)
     * Skip:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/account/:path*',
    '/api/((?!auth|webhooks).*)',
    '/cart/c/:path*',
    '/checkouts/:path*',
  ],
} as const