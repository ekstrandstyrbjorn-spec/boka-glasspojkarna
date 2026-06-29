'use client'

interface Props {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
}

export function GuestCounter({ value, min = 1, max = 999, onChange }: Props) {
  return (
    <div className="flex items-center gap-4" role="group" aria-label="Antal gäster">
      <button
        type="button"
        aria-label="Minska antal"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-12 h-12 rounded-full border border-[var(--color-border)] text-2xl font-light disabled:opacity-30 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
      >
        −
      </button>
      <span className="text-3xl font-bold tabular-nums w-12 text-center" aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Öka antal"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-12 h-12 rounded-full border border-[var(--color-border)] text-2xl font-light disabled:opacity-30 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
      >
        +
      </button>
    </div>
  )
}
