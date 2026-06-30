import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  const customerId = '2662cd5a-9d22-47a9-9eec-8ca9b214ad3a'
  const productId = '36e90601-0fc4-4fdd-a7ba-80ce0f146b74'

  // Try proper JSON:API sideposting: order.relationships.lines references line by lid
  try {
    const o = await booqable.post<unknown>('/orders', {
      data: {
        type: 'orders',
        lid: 'order-1',
        attributes: { starts_at: '2026-08-20T08:00:00Z', stops_at: '2026-08-21T20:00:00Z' },
        relationships: {
          customer: { data: { type: 'customers', id: customerId } },
          lines: { data: [{ type: 'lines', lid: 'line-1' }] },
        },
      },
      included: [
        {
          type: 'lines',
          lid: 'line-1',
          attributes: { quantity: 1 },
          relationships: {
            item: { data: { type: 'products', id: productId } },
          },
        },
      ],
    })
    results.lid_sidepost = o
  } catch (e) {
    results.lid_sidepost_error = String(e)
  }

  // Also: try writing tag_list on order (so staff see package name even if line fails)
  try {
    const o = await booqable.post<unknown>('/orders', {
      data: {
        type: 'orders',
        attributes: {
          starts_at: '2026-08-22T08:00:00Z',
          stops_at: '2026-08-23T20:00:00Z',
          tag_list: ['Glass S'],
        },
        relationships: {
          customer: { data: { type: 'customers', id: customerId } },
        },
      },
    })
    results.tag_list_order = o
  } catch (e) {
    results.tag_list_error = String(e)
  }

  return Response.json(results)
}
