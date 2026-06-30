import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Use the order we know works
  const orderId = 'e0a2f37f-c2ca-4e3b-9e43-738482187899'
  // Glass S product group ID from earlier
  const productGroupId = '6540b76e-65a8-490c-98ea-08059183191c'

  // Try lines with product_groups relationship
  try {
    const line = await booqable.post<unknown>('/lines', {
      data: {
        type: 'lines',
        attributes: { quantity: 1 },
        relationships: {
          order: { data: { type: 'orders', id: orderId } },
          item: { data: { type: 'product_groups', id: productGroupId } },
        },
      },
    })
    results.line_product_groups = line
  } catch (e) {
    results.line_product_groups_error = String(e)
  }

  // Also fetch the product group to see if it has a default product/variant
  try {
    const pg = await booqable.get<unknown>(`/product_groups/${productGroupId}?include=products`)
    results.product_group_with_products = pg
  } catch (e) {
    results.product_group_error = String(e)
  }

  return Response.json(results)
}
