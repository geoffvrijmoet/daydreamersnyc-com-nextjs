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

    // Set cart ID in cookies
    cookies().set('cartId', response.cartCreate.cart.id)

    return NextResponse.json({
      cart: response.cartCreate.cart,
      checkoutUrl: response.cartCreate.cart.checkoutUrl
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: 'There was an error creating the cart. Please try again.' },
      { status: 500 }
    )
  }
} 