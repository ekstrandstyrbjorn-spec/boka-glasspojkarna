import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Glass S product variant ID (child of product_group)
  const productId = '36e90601-0fc4-4fdd-a7ba-80ce0f146b74'
  const productGroupId = '6540b76e-65a8-490c-98ea-08059183191c'

  // Create a fresh customer
  let customerId: string
  try {
    const c = await booqable.post<{ data: { id: string } }>('/customers', {
      data: { type: 'customers', attributes: { name: 'Sidepost Kund', email: 'sidepost@glasspojkarna.se' } },
    })
    customerId = c.data.id
    results.customer_id = customerId
  } catch (e) { results.customer_error = String(e); return Response.json(results) }

  // Try 1: Create order with line sideposted using product variant (products type)
  try {
    const o = await booqable.post<unknown>('/orders', {
      data: {
        type: 'orders',
        attributes: { starts_at: '2026-08-15T08:00:00Z', stops_at: '2026-08-16T20:00:00Z' },
        relationships: {
          customer: { data: { type: 'customers', id: customerId } },
        },
      },
      included: [
        {
          type: 'lines',
          attributes: { quantity: 1 },
          relationships: {
            item: { data: { type: 'products', id: productId } },
          },
        },
      ],
    })
    results.order_with_product_variant = o
  } catch (e) {
    results.sidepost_product_variant_error = String(e)
  }

  // Try 2: Create order with line sideposted using product_group
  try {
    const o = await booqable.post<unknown>('/orders', {
      data: {
        type: 'orders',
        attributes: { starts_at: '2026-08-17T08:00:00Z', stops_at: '2026-08-18T20:00:00Z' },
        relationships: {
          customer: { data: { type: 'customers', id: customerId } },
        },
      },
      included: [
        {
          type: 'lines',
          attributes: { quantity: 1 },
          relationships: {
            item: { data: { type: 'product_groups', id: productGroupId } },
          },
        },
      ],
    })
    results.order_with_product_group = o
  } catch (e) {
    results.sidepost_product_group_error = String(e)
  }

  return Response.json(results)
}
