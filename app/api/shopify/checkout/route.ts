import { NextResponse } from 'next/server'
import { shopifyClient } from '@/lib/shopify'

interface LineItem {
  merchandiseId: string
  quantity: number
}

interface CustomAttribute {
  key: string
  value: string
}

interface CartInput {
  lineItems: LineItem[]
  customAttributes: CustomAttribute[]
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

const CREATE_CART_MUTATION = `
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

export async function POST(request: Request) {
  try {
    const { lineItems, customAttributes } = await request.json() as CartInput

    // Create the cart
    const cartResponse = await shopifyClient.request<CartCreateResponse>(CREATE_CART_MUTATION, {
      input: {
        lines: lineItems.map(item => ({
          merchandiseId: item.merchandiseId,
          quantity: item.quantity
        })),
        attributes: customAttributes,
      },
    })

    if (cartResponse.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', cartResponse.cartCreate.userErrors)
      return NextResponse.json({ error: cartResponse.cartCreate.userErrors[0].message }, { status: 400 })
    }

    // Return the checkout URL directly from Shopify
    return NextResponse.json({ checkoutUrl: cartResponse.cartCreate.cart.checkoutUrl })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
  }
} 