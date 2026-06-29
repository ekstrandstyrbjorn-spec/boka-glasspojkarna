import type { Inclusion } from '@/lib/types'

export function InclusionList({ inclusions }: { inclusions: Inclusion[] }) {
  if (inclusions.length === 0) return null
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Vad ingår</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inclusions.map((item, i) => (
          <li key={i} className="flex gap-3 items-start p-4 rounded-[var(--radius-card)] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <span className="text-[var(--color-brand)] text-lg font-bold mt-0.5 shrink-0" aria-hidden="true">✓</span>
            <div>
              <p className="font-semibold text-[var(--color-ink)]">{item.label}</p>
              {item.quantity && <p className="text-sm text-[var(--color-ink-secondary)]">{item.quantity}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
