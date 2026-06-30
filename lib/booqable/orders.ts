import { booqable } from './client'
import type { BookingState, BookingConfirmation } from '@/lib/types'

interface BooqableOrderResponse {
  data: { id: string; attributes: { number: string } }
}

interface BooqableCustomerResponse {
  data: { id: string }
}

export async function createOrder(state: BookingState): Promise<BookingConfirmation> {
  // 1. Create customer
  const customerRes = await booqable.post<BooqableCustomerResponse>('/customers', {
    data: {
      type: 'customers',
      attributes: {
        name: `${state.firstName} ${state.lastName}`.trim() || state.name,
        email: state.email,
      },
    },
  })
  const customerId = customerRes.data.id

  // 2. Create order — tag with package name so staff see it in Booqable UI
  const orderRes = await booqable.post<BooqableOrderResponse>('/orders', {
    data: {
      type: 'orders',
      attributes: {
        starts_at: `${state.startDate}T08:00:00Z`,
        stops_at: `${state.endDate}T20:00:00Z`,
        tag_list: [state.packageName, `${state.guests} gäster`].filter(Boolean),
      },
      relationships: {
        customer: { data: { type: 'customers', id: customerId } },
      },
    },
  })
  const orderId = orderRes.data.id

  // 3. Transition order from "new" → "reserved" so it appears in Booqable Orders
  try {
    await booqable.post('/order_status_transitions', {
      data: {
        type: 'order_status_transitions',
        attributes: {
          order_id: orderId,
          transition_from: 'new',
          transition_to: 'reserved',
          confirm_shortage: false,
        },
      },
    })
  } catch {
    // Order stays as "new" — still created and visible via search
  }

  const orderNumber = orderRes.data.attributes.number ?? orderId.slice(0, 8).toUpperCase()

  return { orderId, orderNumber, email: state.email }
}
