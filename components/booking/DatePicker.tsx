'use client'
import { useState, useEffect } from 'react'

interface Props {
  productId: string
  startDate: string
  endDate: string
  onStartChange: (d: string) => void
  onEndChange: (d: string) => void
}

type AvailabilityStatus = 'unknown' | 'checking' | 'available' | 'unavailable'

export function DatePicker({ productId, startDate, endDate, onStartChange, onEndChange }: Props) {
  const [status, setStatus] = useState<AvailabilityStatus>('unknown')

  useEffect(() => {
    if (!startDate || !endDate || !productId) return
    setStatus('checking')
    const params = new URLSearchParams({ productId, startDate, endDate })
    fetch(`/api/availability?${params}`)
      .then(r => r.json())
      .then((d: { available: boolean }) => setStatus(d.available ? 'available' : 'unavailable'))
      .catch(() => setStatus('unknown'))
  }, [productId, startDate, endDate])

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Eventdatum *</span>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={e => {
              onStartChange(e.target.value)
              if (!endDate || e.target.value > endDate) onEndChange(e.target.value)
            }}
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)]"
            aria-label="Välj eventdatum"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Återlämning *</span>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={e => onEndChange(e.target.value)}
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)]"
            aria-label="Välj återlämningsdatum"
          />
        </label>
      </div>

      {status !== 'unknown' && (
        <p
          className={`text-sm font-medium ${
            status === 'checking' ? 'text-[var(--color-ink-secondary)]' :
            status === 'available' ? 'text-[var(--color-success)]' :
            'text-red-600'
          }`}
          aria-live="polite"
        >
          {status === 'checking' && 'Kontrollerar tillgänglighet…'}
          {status === 'available' && '✓ Tillgänglig på valt datum'}
          {status === 'unavailable' && '✗ Ej tillgänglig — välj ett annat datum'}
        </p>
      )}
    </div>
  )
}
