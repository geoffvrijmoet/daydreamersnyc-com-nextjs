import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const url = request.nextUrl.pathname
  const searchParams = request.nextUrl.search

  // If it's a cart URL, handle it on the custom domain
  if (url.startsWith('/cart') || url.startsWith('/checkout')) {
    // If the URL already contains checkout=true, let it pass through
    if (searchParams.includes('checkout=true')) {
      return NextResponse.next()
    }

    // Otherwise, append checkout=true to trigger Shopify's checkout flow
    const newUrl = new URL(request.url)
    newUrl.searchParams.append('checkout', 'true')
    return NextResponse.redirect(newUrl)
  }

  // For all other routes, continue normally
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
    '/cart/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/api/((?!auth|webhooks).*)',
  ],
} as const