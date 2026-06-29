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

  // 2. Create order (only date + customer relationship — Booqable rejects unknown attributes)
  const orderRes = await booqable.post<BooqableOrderResponse>('/orders', {
    data: {
      type: 'orders',
      attributes: {
        starts_at: `${state.startDate}T08:00:00Z`,
        stops_at: `${state.endDate}T20:00:00Z`,
      },
      relationships: {
        customer: {
          data: { type: 'customers', id: customerId },
        },
      },
    },
  })
  const orderId = orderRes.data.id

  // 3. Add the main package as a product line
  if (state.packageId) {
    await booqable.post('/lines', {
      data: {
        type: 'lines',
        attributes: {
          order_id: orderId,
          item_id: state.packageId,
          quantity: 1,
          starts_at: `${state.startDate}T08:00:00Z`,
          stops_at: `${state.endDate}T20:00:00Z`,
        },
      },
    })
  }

  return {
    orderId,
    orderNumber: orderRes.data.attributes.number,
    email: state.email,
  }
}
