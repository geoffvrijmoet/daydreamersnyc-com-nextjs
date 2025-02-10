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

    console.log('Original checkout URL:', response.cartCreate.cart.checkoutUrl)

    // Set cart ID in cookies
    cookies().set('cartId', response.cartCreate.cart.id)

    // For headless commerce, ensure we're using the Shopify checkout domain
    const checkoutUrl = response.cartCreate.cart.checkoutUrl.replace(
      /^https?:\/\/[^\/]+/,
      'https://checkout.shopify.com'
    ).replace(
      'daydreamersnyc.com',
      'daydreamers-pet-supply.myshopify.com'
    )
    
    console.log('Modified checkout URL:', checkoutUrl)

    // Validate the URL before returning
    try {
      const url = new URL(checkoutUrl)
      if (!url.hostname.includes('shopify.com')) {
        throw new Error('Invalid checkout domain')
      }
      console.log('Final checkout URL:', url.toString())
    } catch {
      console.error('Invalid checkout URL:', checkoutUrl)
      throw new Error('Invalid checkout URL returned from Shopify')
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