'use client'
import { DatePicker } from './DatePicker'
import { GuestCounter } from './GuestCounter'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import type { Package } from '@/lib/types'

export function StepDate({ pkg }: { pkg: Package }) {
  const { state, update, setStep } = useBookingState()
  const canProceed = !!state.startDate && !!state.endDate && state.guests >= 1

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-6">Välj datum och antal gäster</h2>
        <DatePicker
          productId={pkg.id}
          startDate={state.startDate}
          endDate={state.endDate}
          onStartChange={d => update({ startDate: d })}
          onEndChange={d => update({ endDate: d })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-4">Antal gäster</p>
        {state.guests > pkg.guestsMax && (
          <p className="text-sm text-[var(--color-warning)] mb-3" role="alert">
            Paketet passar upp till {pkg.guestsMax} gäster. Kontakta oss för större event.
          </p>
        )}
        <GuestCounter
          value={state.guests}
          max={pkg.guestsMax * 2}
          onChange={n => update({ guests: n })}
        />
      </div>

      <Button disabled={!canProceed} onClick={() => setStep(2)} size="lg" className="w-full sm:w-auto">
        Fortsätt →
      </Button>
    </div>
  )
}
