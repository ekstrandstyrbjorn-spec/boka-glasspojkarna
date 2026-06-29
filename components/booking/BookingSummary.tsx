'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import { calculatePrice, formatSEK } from '@/lib/price'

export function BookingSummary() {
  const { state, setStep, reset } = useBookingState()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const breakdown = calculatePrice(state)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      if (!res.ok) throw new Error('Kunde inte skapa bokning')
      const data = await res.json()
      reset()
      router.push(`/bekraftelse?orderId=${data.orderNumber}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ett fel uppstod. Försök igen.')
      setSubmitting(false)
    }
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2 border-b border-[var(--color-border)] last:border-0">
      <span className="text-sm text-[var(--color-ink-secondary)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-ink)]">{value}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Granska din bokning</h2>

      <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] divide-y divide-[var(--color-border)] overflow-hidden">
        <div className="p-4 bg-[var(--color-surface-raised)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3">Paket</p>
          <Row label="Paket" value={state.packageName} />
          <Row label="Datum" value={`${state.startDate} – ${state.endDate}`} />
          <Row label="Antal gäster" value={`${state.guests} st`} />
        </div>

        {state.selectedAddOns.length > 0 && (
          <div className="p-4 bg-[var(--color-surface-raised)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3">Tillval</p>
            {state.selectedAddOns.map(a => (
              <Row key={a.addOnId} label={`${a.name}${a.quantity > 1 ? ` × ${a.quantity}` : ''}`} value={formatSEK(a.priceInCents * a.quantity)} />
            ))}
          </div>
        )}

        <div className="p-4 bg-[var(--color-surface-raised)]">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-tertiary)] mb-3">Kontakt</p>
          <Row label="Namn" value={`${state.firstName} ${state.lastName}`} />
          <Row label="E-post" value={state.email} />
          <Row label="Telefon" value={state.phone} />
          {state.address && <Row label="Adress" value={`${state.address}, ${state.postalCode} ${state.city}`} />}
        </div>

        <div className="p-4">
          {breakdown.addOnsInCents > 0 && (
            <Row label="Tillval" value={formatSEK(breakdown.addOnsInCents)} />
          )}
          {breakdown.deliveryInCents > 0 && (
            <Row label="Leverans" value={formatSEK(breakdown.deliveryInCents)} />
          )}
          <Row label="Moms (25%)" value={formatSEK(breakdown.vatInCents)} />
          <div className="flex justify-between pt-3 mt-1">
            <span className="font-bold text-[var(--color-ink)]">Totalt att betala</span>
            <span className="text-2xl font-bold tabular-nums text-[var(--color-ink)]">{formatSEK(breakdown.totalInCents)}</span>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 p-3 rounded-[var(--radius-input)] bg-red-50" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-[var(--color-ink-tertiary)]">
        Genom att klicka på "Bekräfta bokning" godkänner du våra{' '}
        <a href="https://glasspojkarna.se/villkor" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-brand)]">
          bokningsvillkor
        </a>.
      </p>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(3)} disabled={submitting}>← Tillbaka</Button>
        <Button onClick={handleSubmit} disabled={submitting} size="lg">
          {submitting ? 'Skickar…' : 'Bekräfta bokning'}
        </Button>
      </div>
    </div>
  )
}
