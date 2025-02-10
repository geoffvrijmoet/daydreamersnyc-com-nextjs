import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    // Check if this is a Shopify cart URL
    if (request.nextUrl.pathname.startsWith('/cart/')) {
      // Get the full path including search params
      const fullPath = request.nextUrl.pathname + request.nextUrl.search
      
      // Construct the checkout URL directly
      const checkoutUrl = `https://daydreamers-pet-supply.myshopify.com/cart/checkout`
      
      // Extract the cart items and attributes from the URL
      const cartItems = fullPath.split('/cart/')[1].split('?')[0]
      const searchParams = request.nextUrl.searchParams
      
      // Construct the final URL with all parameters
      const finalUrl = `${checkoutUrl}/${cartItems}${searchParams.toString() ? '?' + searchParams.toString() : ''}`
      
      // Use 307 Temporary Redirect to preserve the request method
      return NextResponse.redirect(finalUrl, 307)
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