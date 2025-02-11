import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { shopifyClient, createCheckout, CheckoutResponse } from '@/lib/shopify'

interface LineItem {
  variantId: string
  quantity: number
  customAttributes?: Array<{
    key: string
    value: string
  }>
}

interface CheckoutInput {
  lines: LineItem[]
}

export async function POST(request: Request) {
  try {
    const { lines } = await request.json() as CheckoutInput;

    console.log('Creating checkout with lines:', lines);

    const response = await shopifyClient.request<CheckoutResponse>(createCheckout, {
      input: {
        lineItems: lines.map(line => ({
          variantId: line.variantId,
          quantity: line.quantity,
          customAttributes: line.customAttributes
        }))
      }
    });

    if (response.checkoutCreate.checkoutUserErrors.length > 0) {
      console.error('Checkout creation errors:', response.checkoutCreate.checkoutUserErrors);
      return NextResponse.json(
        { error: 'There was an error creating the checkout. Please try again.' },
        { status: 400 }
      );
    }

    // Use the checkout URL exactly as Shopify provides it
    const checkoutUrl = response.checkoutCreate.checkout.webUrl;
    console.log('Final checkout URL:', checkoutUrl);

    // Set checkout ID in cookies
    cookies().set('checkoutId', response.checkoutCreate.checkout.id);

    return NextResponse.json({
      checkout: response.checkoutCreate.checkout,
      checkoutUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating checkout:', error);
    return NextResponse.json(
      { error: 'There was an error creating the checkout. Please try again.' },
      { status: 500 }
    );
  }
}