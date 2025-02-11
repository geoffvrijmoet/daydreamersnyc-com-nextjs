import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { shopifyClient, createCart } from '@/lib/shopify'

interface LineItem {
  variantId: string
  quantity: number
  attributes?: Array<{
    key: string
    value: string
  }>
}

interface ShippingAddress {
  address1: string
  address2?: string
  city: string
  province: string
  zip: string
  country: string
}

interface CartInput {
  lines: LineItem[]
  shippingAddress?: ShippingAddress
}

interface CartResponse {
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
    const { lines, shippingAddress } = await request.json() as CartInput;

    console.log('Creating cart with lines:', lines);
    console.log('Shipping address:', shippingAddress);

    // Convert variantId to merchandiseId format and add shipping address to first line
    const cartLines = lines.map((line, index) => ({
      merchandiseId: line.variantId.includes('gid://') 
        ? line.variantId 
        : `gid://shopify/ProductVariant/${line.variantId}`,
      quantity: line.quantity,
      attributes: [
        ...(line.attributes || []),
        // Add shipping address to the first line item only
        ...(shippingAddress && index === 0 ? [
          { key: "shipping_address1", value: shippingAddress.address1 },
          { key: "shipping_address2", value: shippingAddress.address2 || '' },
          { key: "shipping_city", value: shippingAddress.city },
          { key: "shipping_province", value: shippingAddress.province },
          { key: "shipping_zip", value: shippingAddress.zip },
          { key: "shipping_country", value: shippingAddress.country }
        ] : [])
      ]
    }));

    // Create cart
    const response = await shopifyClient.request<CartResponse>(createCart, {
      input: {
        lines: cartLines
      }
    });

    if (response.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', response.cartCreate.userErrors);
      return NextResponse.json(
        { error: 'There was an error creating the cart. Please try again.' },
        { status: 400 }
      );
    }

    // Use the checkout URL exactly as Shopify provides it
    const checkoutUrl = response.cartCreate.cart.checkoutUrl;
    console.log('Final checkout URL:', checkoutUrl);

    // Set cart ID in cookies
    cookies().set('cartId', response.cartCreate.cart.id);

    return NextResponse.json({
      checkoutUrl
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating cart:', error);
    return NextResponse.json(
      { error: 'There was an error creating the cart. Please try again.' },
      { status: 500 }
    );
  }
}