'use client'
import { AddOnSelector } from './AddOnSelector'
import { PriceCounter } from './PriceCounter'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import { calculatePrice } from '@/lib/price'
import type { AddOn, Package } from '@/lib/types'

export function StepExtras({ pkg }: { pkg: Package }) {
  const { state, update, setStep } = useBookingState()

  const handleToggle = (addOn: AddOn) => {
    const exists = state.selectedAddOns.some(s => s.addOnId === addOn.id)
    if (exists) {
      update({ selectedAddOns: state.selectedAddOns.filter(s => s.addOnId !== addOn.id) })
    } else {
      update({
        selectedAddOns: [...state.selectedAddOns, {
          addOnId: addOn.id, name: addOn.name, quantity: 1, priceInCents: addOn.priceInCents,
        }],
      })
    }
  }

  const handleQuantityChange = (addOnId: string, qty: number) => {
    update({
      selectedAddOns: state.selectedAddOns.map(s =>
        s.addOnId === addOnId ? { ...s, quantity: qty } : s
      ),
    })
  }

  const breakdown = calculatePrice(state)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Välj tillval</h2>
      <AddOnSelector
        addOns={pkg.addOns}
        selected={state.selectedAddOns}
        onToggle={handleToggle}
        onQuantityChange={handleQuantityChange}
      />
      <PriceCounter breakdown={breakdown} />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(1)}>← Tillbaka</Button>
        <Button onClick={() => setStep(3)}>Fortsätt →</Button>
      </div>
    </div>
  )
}
