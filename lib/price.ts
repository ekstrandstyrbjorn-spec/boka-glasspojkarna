import type { BookingState, PriceBreakdown } from '@/lib/types'

const VAT_RATE = 0.25
const DELIVERY_ADD_ON_NAMES = ['Leverans']

export function calculatePrice(state: BookingState): PriceBreakdown {
  const baseInCents = state.packagePriceInCents

  let addOnsInCents = 0
  let deliveryInCents = 0

  for (const addOn of state.selectedAddOns) {
    const cost = addOn.priceInCents * addOn.quantity
    if (DELIVERY_ADD_ON_NAMES.includes(addOn.name)) {
      deliveryInCents += cost
    } else {
      addOnsInCents += cost
    }
  }

  const subtotalInCents = baseInCents + addOnsInCents + deliveryInCents
  const vatInCents = Math.round(subtotalInCents * VAT_RATE)
  const totalInCents = subtotalInCents + vatInCents

  return { baseInCents, addOnsInCents, deliveryInCents, subtotalInCents, vatInCents, totalInCents }
}

export function formatSEK(cents: number): string {
  return (cents / 100).toLocaleString('sv-SE') + ' kr'
}
