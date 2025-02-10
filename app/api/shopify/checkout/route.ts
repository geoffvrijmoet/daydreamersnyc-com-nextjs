import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { shopifyClient, createCart, CartResponse } from '@/lib/shopify'

interface LineItem {
  merchandiseId: string
  quantity: number
  attributes?: Array<{
    key: string
    value: string
  }>
}

interface CartInput {
  lines: LineItem[]
}

export async function POST(request: Request) {
  try {
    const { lines } = await request.json() as CartInput

    console.log('Creating cart with lines:', lines)

    const response = await shopifyClient.request<CartResponse>(createCart, {
      input: { lines }
    })

    if (response.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', response.cartCreate.userErrors)
      return NextResponse.json(
        { error: 'There was an error creating the cart. Please try again.' },
        { status: 400 }
      )
    }

    // Get the original checkout URL
    const originalCheckoutUrl = response.cartCreate.cart.checkoutUrl
    console.log('Original checkout URL:', originalCheckoutUrl)

    // Set cart ID in cookies
    cookies().set('cartId', response.cartCreate.cart.id)

    // Parse the original URL to preserve the path and query parameters
    const originalUrl = new URL(originalCheckoutUrl)
    
    // Construct new checkout URL with myshopify domain
    const checkoutUrl = `https://daydreamers-pet-supply.myshopify.com${originalUrl.pathname}${originalUrl.search}`
    console.log('Modified checkout URL:', checkoutUrl)

    try {
      // Validate the URL
      const url = new URL(checkoutUrl)
      if (!url.hostname.includes('myshopify.com')) {
        throw new Error('Invalid checkout domain')
      }
      console.log('Final checkout URL:', url.toString())
    } catch (error) {
      console.error('URL validation error:', error)
      throw new Error('Invalid checkout URL')
    }

    return NextResponse.json({
      cart: {
        ...response.cartCreate.cart,
        checkoutUrl
      },
      checkoutUrl
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: 'There was an error creating the cart. Please try again.' },
      { status: 500 }
    )
  }
} 