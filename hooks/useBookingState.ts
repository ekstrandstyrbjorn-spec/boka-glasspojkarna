import { create } from 'zustand'
import type { BookingState } from '@/lib/types'

const INITIAL_STATE: BookingState = {
  packageId: '', packageSlug: '', packageName: '', packagePriceInCents: 0,
  startDate: '', endDate: '', guests: 1,
  selectedAddOns: [],
  customerType: 'private',
  name: '', phone: '', email: '', address: '', eventLocation: '', notes: '',
}

interface BookingStore {
  state: BookingState
  currentStep: number
  update: (patch: Partial<BookingState>) => void
  reset: () => void
  setStep: (step: number) => void
}

export const useBookingState = create<BookingStore>(set => ({
  state: INITIAL_STATE,
  currentStep: 1,
  update: patch => set(s => ({ state: { ...s.state, ...patch } })),
  reset: () => set({ state: INITIAL_STATE, currentStep: 1 }),
  setStep: step => set({ currentStep: step }),
}))
