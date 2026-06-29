import { booqable } from './client'
import type { BookingState, BookingConfirmation } from '@/lib/types'

interface BooqableOrderResponse {
  data: { id: string; attributes: { number: string; status: string } }
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

  // 2. Create order
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

  // 3. Transition order from "new" → "reserved" so it appears in Booqable UI
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
    // Transition failed — order stays as "new" but is still created
  }

  // 4. Add the package as a product line
  if (state.packageId) {
    try {
      await booqable.post('/lines', {
        data: {
          type: 'lines',
          attributes: { quantity: 1 },
          relationships: {
            order: { data: { type: 'orders', id: orderId } },
            item: { data: { type: 'product_groups', id: state.packageId } },
          },
        },
      })
    } catch {
      // Line could not be added — staff can add product manually in Booqable
    }
  }

  const orderNumber = orderRes.data.attributes.number ?? orderId.slice(0, 8).toUpperCase()

  return {
    orderId,
    orderNumber,
    email: state.email,
  }
}
