import { NextResponse } from 'next/server'
import { shopifyClient, createCheckout } from '@/lib/shopify'

interface LineItem {
  variantId: string
  quantity: number
}

interface CustomAttribute {
  key: string
  value: string
}

interface CheckoutInput {
  lineItems: LineItem[]
  customAttributes: CustomAttribute[]
}

interface CheckoutResponse {
  checkoutCreate: {
    checkout: {
      webUrl: string
    }
    checkoutUserErrors: Array<{
      code: string
      field: string[]
      message: string
    }>
  }
}

export async function POST(request: Request) {
  try {
    const { lineItems, customAttributes } = await request.json() as CheckoutInput

    // Create the checkout
    const response = await shopifyClient.request<CheckoutResponse>(createCheckout, {
      input: {
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity
        })),
        customAttributes,
      },
    })

    if (response.checkoutCreate.checkoutUserErrors.length > 0) {
      console.error('Checkout creation errors:', response.checkoutCreate.checkoutUserErrors)
      return NextResponse.json(
        { error: 'There was an error generating the checkoutURL. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { checkoutUrl: response.checkoutCreate.checkout.webUrl },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating checkout:', error)
    return NextResponse.json(
      { error: 'There was an error generating the checkoutURL. Please try again.' },
      { status: 500 }
    )
  }
} 