import { calculatePrice, formatSEK } from '@/lib/price'
import type { BookingState } from '@/lib/types'

const base: BookingState = {
  packageId: '1', packageSlug: 'glass-l', packageName: 'Glass L',
  packagePriceInCents: 195000,
  startDate: '2026-08-01', endDate: '2026-08-01',
  guests: 80,
  selectedAddOns: [],
  customerType: 'private',
  name: '', phone: '', email: '', address: '', eventLocation: '', notes: '',
}

test('base price only — correct VAT and total', () => {
  const result = calculatePrice(base)
  expect(result.baseInCents).toBe(195000)
  expect(result.addOnsInCents).toBe(0)
  expect(result.deliveryInCents).toBe(0)
  expect(result.subtotalInCents).toBe(195000)
  expect(result.vatInCents).toBe(48750)   // 25% of 195000
  expect(result.totalInCents).toBe(243750)
})

test('delivery add-on is separated from regular add-ons', () => {
  const state: BookingState = {
    ...base,
    selectedAddOns: [
      { addOnId: '2', name: 'Leverans', quantity: 1, priceInCents: 150000 },
    ],
  }
  const result = calculatePrice(state)
  expect(result.addOnsInCents).toBe(0)
  expect(result.deliveryInCents).toBe(150000)
  expect(result.subtotalInCents).toBe(345000)
  expect(result.totalInCents).toBe(431250)
})

test('quantity add-ons multiply correctly', () => {
  const state: BookingState = {
    ...base,
    selectedAddOns: [
      { addOnId: '3', name: 'Extra portioner', quantity: 3, priceInCents: 5000 },
    ],
  }
  const result = calculatePrice(state)
  expect(result.addOnsInCents).toBe(15000)
  expect(result.deliveryInCents).toBe(0)
})

test('formatSEK formats Swedish currency', () => {
  // Accept any format where 1950 and kr appear — locale may vary per OS
  expect(formatSEK(195000)).toMatch(/1.?950/)
  expect(formatSEK(195000)).toMatch(/kr/)
})
