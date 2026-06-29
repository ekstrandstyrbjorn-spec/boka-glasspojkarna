import { booqable } from './client'
import type { BookingState, BookingConfirmation } from '@/lib/types'

interface BooqableOrderResponse {
  data: { id: string; attributes: { number: string } }
}

interface BooqableCustomerResponse {
  data: { id: string }
}

export async function createOrder(state: BookingState): Promise<BookingConfirmation> {
  const customerRes = await booqable.post<BooqableCustomerResponse>('/customers', {
    data: {
      type: 'customers',
      attributes: {
        name: state.name,
        email: state.email,
        phone: state.phone,
      },
    },
  })
  const customerId = customerRes.data.id

  const addOnNote = state.selectedAddOns
    .map(a => `${a.name} ×${a.quantity}`)
    .join(', ')

  const orderRes = await booqable.post<BooqableOrderResponse>('/orders', {
    data: {
      type: 'orders',
      attributes: {
        starts_at: `${state.startDate}T00:00:00Z`,
        stops_at: `${state.endDate}T23:59:59Z`,
        customer_id: customerId,
        note: [
          `Gäster: ${state.guests}`,
          `Eventplats: ${state.eventLocation}`,
          `Adress: ${state.address}`,
          addOnNote ? `Tillval: ${addOnNote}` : '',
          state.notes ? `Övrigt: ${state.notes}` : '',
          state.customerType === 'business'
            ? `Företag: ${state.companyName ?? ''}, Org: ${state.orgNumber ?? ''}`
            : '',
        ].filter(Boolean).join('\n'),
      },
    },
  })

  return {
    orderId: orderRes.data.id,
    orderNumber: orderRes.data.attributes.number,
    email: state.email,
  }
}
