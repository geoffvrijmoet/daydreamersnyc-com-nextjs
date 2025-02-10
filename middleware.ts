import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if this is a Shopify cart URL
    if (request.nextUrl.pathname.startsWith('/cart/')) {
      // Get the full URL and replace the domain with the Shopify domain
      const url = request.url.replace('daydreamersnyc.com', 'daydreamers-pet-supply.myshopify.com')
      return NextResponse.redirect(new URL(url))
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
     * - /cart (Shopify cart URLs)
     * Skip:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     */
    '/account/:path*',
    '/api/((?!auth|webhooks).*)',
    '/cart/:path*',
  ],
} as const