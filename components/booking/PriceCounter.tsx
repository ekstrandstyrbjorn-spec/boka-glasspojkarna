'use client'
import { formatSEK } from '@/lib/price'
import type { PriceBreakdown } from '@/lib/types'

export function PriceCounter({ breakdown }: { breakdown: PriceBreakdown }) {
  return (
    <div className="sticky bottom-4 z-30 mt-8">
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] border border-[var(--color-border)] p-4">
        {breakdown.addOnsInCents > 0 && (
          <div className="flex justify-between text-sm text-[var(--color-ink-secondary)] mb-1">
            <span>Tillval</span>
            <span className="tabular-nums">{formatSEK(breakdown.addOnsInCents)}</span>
          </div>
        )}
        {breakdown.deliveryInCents > 0 && (
          <div className="flex justify-between text-sm text-[var(--color-ink-secondary)] mb-1">
            <span>Leverans</span>
            <span className="tabular-nums">{formatSEK(breakdown.deliveryInCents)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-[var(--color-ink-secondary)] mb-1">
          <span>Moms (25%)</span>
          <span className="tabular-nums">{formatSEK(breakdown.vatInCents)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[var(--color-border)]">
          <span className="font-bold text-[var(--color-ink)]">Totalt</span>
          <span
            className="text-2xl font-bold tabular-nums text-[var(--color-ink)]"
            aria-live="polite"
            aria-atomic="true"
          >
            {formatSEK(breakdown.totalInCents)}
          </span>
        </div>
      </div>
    </div>
  )
}
