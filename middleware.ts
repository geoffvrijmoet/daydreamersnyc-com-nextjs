import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname, searchParams } = request.nextUrl

  // Handle cart URLs
  if (pathname.startsWith('/cart/')) {
    const shopifyUrl = new URL(
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
      'https://daydreamers-pet-supply.myshopify.com'
    )
    return NextResponse.redirect(shopifyUrl)
  }

  // For all other routes, continue normally
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all paths that need special handling:
     * - /cart (cart and checkout URLs)
     * - /account (customer account pages)
     * - /api (API routes except auth)
     */
    '/cart/:path*',
    '/account/:path*',
    '/api/((?!auth|webhooks).*)',
  ],
} as const