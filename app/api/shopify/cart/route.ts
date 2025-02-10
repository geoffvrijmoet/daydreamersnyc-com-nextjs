import { NextResponse } from 'next/server'
import { shopifyClient } from '@/lib/shopify'

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`

interface CartItem {
  merchandiseId: string
  quantity: number
  attributes?: Array<{
    key: string
    value: string
  }>
}

interface CartRequestBody {
  items: CartItem[]
}

interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string
      checkoutUrl: string
    }
    userErrors: Array<{
      field: string[]
      message: string
    }>
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CartRequestBody
    const { items } = body

    console.log('Creating cart with items:', items)

    // Create cart with all items
    const response = await shopifyClient.request<CartCreateResponse>(CART_CREATE_MUTATION, {
      input: {
        lines: items.map(item => ({
          merchandiseId: item.merchandiseId,
          quantity: item.quantity,
          attributes: item.attributes
        }))
      }
    })

    console.log('Cart creation response:', response)

    if (response.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', response.cartCreate.userErrors)
      throw new Error(JSON.stringify(response.cartCreate.userErrors))
    }

    // Get the checkout URL and ensure it uses the store's myshopify.com domain
    const cartUrl = response.cartCreate.cart.checkoutUrl
    const checkoutUrl = cartUrl.replace('daydreamersnyc.com', 'daydreamers-pet-supply.myshopify.com')
    console.log('Checkout URL:', checkoutUrl)

    return NextResponse.json({
      checkoutUrl
    })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create cart' },
      { status: 500 }
    )
  }
} 