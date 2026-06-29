import { renderHook, act } from '@testing-library/react'
import { useBookingState } from '@/hooks/useBookingState'

beforeEach(() => {
  // Reset store between tests
  useBookingState.setState({
    state: {
      packageId: '', packageSlug: '', packageName: '', packagePriceInCents: 0,
      startDate: '', endDate: '', guests: 1,
      selectedAddOns: [],
      customerType: 'private',
      name: '', firstName: '', lastName: '', phone: '', email: '',
      address: '', postalCode: '', city: '', eventLocation: '', notes: '',
    },
    currentStep: 1,
  })
})

test('update merges partial state', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => result.current.update({ name: 'Anna', email: 'anna@test.se' }))
  expect(result.current.state.name).toBe('Anna')
  expect(result.current.state.email).toBe('anna@test.se')
})

test('setStep updates currentStep', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => result.current.setStep(2))
  expect(result.current.currentStep).toBe(2)
})

test('reset clears state and step to initial', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => {
    result.current.update({ name: 'Anna' })
    result.current.setStep(3)
    result.current.reset()
  })
  expect(result.current.state.name).toBe('')
  expect(result.current.currentStep).toBe(1)
})

test('update does not overwrite unrelated fields', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => result.current.update({ name: 'Anna' }))
  act(() => result.current.update({ email: 'anna@test.se' }))
  expect(result.current.state.name).toBe('Anna')
  expect(result.current.state.email).toBe('anna@test.se')
})
