'use client'
import { formatSEK } from '@/lib/price'
import type { AddOn, SelectedAddOn } from '@/lib/types'

interface Props {
  addOns: AddOn[]
  selected: SelectedAddOn[]
  onToggle: (addOn: AddOn) => void
  onQuantityChange: (addOnId: string, qty: number) => void
}

export function AddOnSelector({ addOns, selected, onToggle, onQuantityChange }: Props) {
  const isSelected = (id: string) => selected.some(s => s.addOnId === id)
  const getQty = (id: string) => selected.find(s => s.addOnId === id)?.quantity ?? 1

  if (addOns.length === 0) {
    return <p className="text-sm text-[var(--color-ink-secondary)]">Inga tillval tillgängliga för detta paket.</p>
  }

  return (
    <div className="space-y-3">
      {addOns.map(addOn => {
        const active = isSelected(addOn.id)
        return (
          <div
            key={addOn.id}
            className={`
              p-4 rounded-[var(--radius-card)] border transition-all duration-[var(--duration-fast)] cursor-pointer
              ${active
                ? 'border-[var(--color-brand)] bg-[var(--color-brand-light)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:border-[var(--color-brand)]'
              }
            `}
            onClick={() => onToggle(addOn)}
            role="checkbox"
            aria-checked={active}
            tabIndex={0}
            onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(addOn) } }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${active ? 'bg-[var(--color-brand)] border-[var(--color-brand)]' : 'border-[var(--color-border)]'}`}
                  aria-hidden="true"
                >
                  {active && <span className="text-white text-xs leading-none">✓</span>}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{addOn.name}</p>
                  {addOn.description && (
                    <p className="text-xs text-[var(--color-ink-secondary)]">{addOn.description}</p>
                  )}
                </div>
              </div>
              <p className="font-bold text-[var(--color-ink)] tabular-nums shrink-0">
                +{formatSEK(addOn.priceInCents)}
              </p>
            </div>

            {active && addOn.type === 'quantity' && (
              <div
                className="mt-3 flex items-center gap-3"
                onClick={e => e.stopPropagation()}
                role="group"
                aria-label={`Antal ${addOn.name}`}
              >
                <button
                  type="button"
                  aria-label="Minska"
                  onClick={() => onQuantityChange(addOn.id, Math.max(1, getQty(addOn.id) - 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] text-lg font-light hover:border-[var(--color-brand)] transition-colors"
                >−</button>
                <span className="tabular-nums w-8 text-center font-bold" aria-live="polite">{getQty(addOn.id)}</span>
                <button
                  type="button"
                  aria-label="Öka"
                  onClick={() => onQuantityChange(addOn.id, Math.min(addOn.maxQuantity ?? 99, getQty(addOn.id) + 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] text-lg font-light hover:border-[var(--color-brand)] transition-colors"
                >+</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
