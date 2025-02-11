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
  requiresShipping?: boolean
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
    const { lines, shippingAddress, requiresShipping = true } = await request.json() as CartInput;

    console.log('Creating cart with lines:', lines);
    console.log('Shipping address:', shippingAddress);
    console.log('Requires shipping:', requiresShipping);

    // Convert variantId to merchandiseId format
    const cartLines = lines.map(line => ({
      merchandiseId: line.variantId.includes('gid://') 
        ? line.variantId 
        : `gid://shopify/ProductVariant/${line.variantId}`,
      quantity: line.quantity,
      attributes: line.attributes || []
    }));

    // Create cart
    const response = await shopifyClient.request<CartResponse>(createCart, {
      input: {
        lines: cartLines,
        deliveryGroups: requiresShipping ? undefined : [{ 
          deliveryOptions: [{ 
            handle: "no-shipping-required" 
          }]
        }]
      }
    });

    if (response.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', response.cartCreate.userErrors);
      return NextResponse.json(
        { error: 'There was an error creating the cart. Please try again.' },
        { status: 400 }
      );
    }

    // Get the base checkout URL
    let checkoutUrl = response.cartCreate.cart.checkoutUrl;
    console.log('Base checkout URL:', checkoutUrl);

    // Add shipping address parameters if provided
    if (shippingAddress) {
      const addressParams = {
        'checkout[shipping_address][address1]': shippingAddress.address1,
        'checkout[shipping_address][address2]': shippingAddress.address2 || '',
        'checkout[shipping_address][city]': shippingAddress.city,
        'checkout[shipping_address][province]': shippingAddress.province,
        'checkout[shipping_address][zip]': shippingAddress.zip,
        'checkout[shipping_address][country]': shippingAddress.country,
        'checkout[shipping_address][country_code]': shippingAddress.country
      };

      // Convert to query string manually to avoid URLSearchParams encoding
      const queryString = Object.entries(addressParams)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

      // Append parameters to checkout URL
      checkoutUrl += `${checkoutUrl.includes('?') ? '&' : '?'}${queryString}`;
      console.log('Final checkout URL with address:', checkoutUrl);
    }

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