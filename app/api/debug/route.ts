import { booqable } from '@/lib/booqable/client'

export async function GET() {
  const results: Record<string, unknown> = {}

  // Create customer
  let customerId: string
  try {
    const c = await booqable.post<{ data: { id: string } }>('/customers', {
      data: { type: 'customers', attributes: { name: 'Debug Kund', email: 'debug@glasspojkarna.se' } },
    })
    customerId = c.data.id
    results.customer_id = customerId
  } catch (e) { results.customer_error = String(e); return Response.json(results) }

  // Create order
  let orderId: string
  try {
    const o = await booqable.post<{ data: { id: string; attributes: { number: string } } }>('/orders', {
      data: {
        type: 'orders',
        attributes: { starts_at: '2026-08-10T08:00:00Z', stops_at: '2026-08-11T20:00:00Z' },
        relationships: { customer: { data: { type: 'customers', id: customerId } } },
      },
    })
    orderId = o.data.id
    results.order_id = orderId
  } catch (e) { results.order_error = String(e); return Response.json(results) }

  // Transition to reserved
  try {
    const t = await booqable.post<unknown>('/order_status_transitions', {
      data: {
        type: 'order_status_transitions',
        attributes: { order_id: orderId, transition_from: 'new', transition_to: 'reserved', confirm_shortage: false },
      },
    })
    results.transition = t
  } catch (e) { results.transition_error = String(e) }

  results.success = true
  return Response.json(results)
}
