import { NextResponse } from 'next/server'

const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')
const ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN

interface BonusItem {
  variantId: string
  quantity: number
  title?: string
  price?: number
}

interface DraftOrderRequestBody {
  bagPrice: number
  dogName: string
  note: string
  deliveryInfo: string
  bonusItems: BonusItem[]
}

export async function POST(request: Request) {
  try {
    if (!STORE_DOMAIN || !ADMIN_ACCESS_TOKEN) {
      throw new Error('Missing Shopify credentials')
    }

    console.log('Creating draft order with store domain:', STORE_DOMAIN)

    const body = await request.json() as DraftOrderRequestBody
    const { bagPrice, dogName, note, deliveryInfo, bonusItems } = body

    // Prepare line items
    const lineItems = [
      {
        title: "Puppy Palentines Bag",
        price: bagPrice.toFixed(2),
        quantity: 1,
        custom: true,
        properties: [
          { name: "Dog Name", value: dogName },
          { name: "Note", value: note },
          { name: "Delivery Info", value: deliveryInfo }
        ]
      },
      ...bonusItems.map((item) => ({
        variant_id: item.variantId.split('/').pop() || '',
        quantity: item.quantity
      }))
    ]

    // Create draft order
    const response = await fetch(
      `https://${STORE_DOMAIN}/admin/api/2024-01/draft_orders.json`,
      {
        method: 'POST',
        headers: new Headers({
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          draft_order: {
            line_items: lineItems,
            note: `Puppy Palentines Order for ${dogName}`,
            shipping_address: deliveryInfo.includes('Need to find:') 
              ? null 
              : {
                  address1: deliveryInfo.split(',')[0].trim(),
                  city: deliveryInfo.split(',')[1].trim(),
                  province: deliveryInfo.split(',')[2].trim().split(' ')[1],
                  zip: deliveryInfo.split(',')[2].trim().split(' ')[2],
                  country: 'US'
                },
            // Skip shipping requirement if address is unknown
            requires_shipping: !deliveryInfo.includes('Need to find:')
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      console.error('Draft order API error response:', error)
      throw new Error(`Failed to create draft order: ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    console.log('Draft order response:', data)
    
    if (!data?.draft_order?.id) {
      throw new Error('No draft order ID returned')
    }

    // Get the invoice URL from the draft order response
    const invoiceUrl = data.draft_order.invoice_url
    if (!invoiceUrl) {
      throw new Error('No invoice URL in draft order response')
    }

    // Send the invoice email
    const invoiceResponse = await fetch(
      `https://${STORE_DOMAIN}/admin/api/2024-01/draft_orders/${data.draft_order.id}/send_invoice.json`,
      {
        method: 'POST',
        headers: new Headers({
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          draft_order_invoice: {
            to: "orders@daydreamersnyc.com",
            subject: `Puppy Palentines Order for ${dogName}`,
            custom_message: `New Puppy Palentines order received for ${dogName}!`
          }
        })
      }
    )

    if (!invoiceResponse.ok) {
      console.error('Warning: Failed to send invoice email:', await invoiceResponse.json())
      // Don't throw error here, we still want to return the invoice URL
    }
    
    return NextResponse.json({ 
      invoiceUrl 
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create draft order' },
      { status: 500 }
    )
  }
} 