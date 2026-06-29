'use client'
import type { PackageCategory } from '@/lib/types'

const CATEGORIES: Array<{ value: PackageCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Alla' },
  { value: 'glass', label: 'Glassmaskin' },
  { value: 'popcorn', label: 'Popcornmaskin' },
  { value: 'slush', label: 'Slushmaskin' },
  { value: 'sockervadds', label: 'Sockervaddsmaskin' },
]

interface Props {
  activeCategory: PackageCategory | 'all'
  onChange: (cat: PackageCategory | 'all') => void
}

export function CategoryFilter({ activeCategory, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrera paket">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          role="tab"
          aria-selected={activeCategory === cat.value}
          onClick={() => onChange(cat.value)}
          className={`
            shrink-0 px-5 py-2.5 rounded-[var(--radius-pill)] text-sm font-semibold
            transition-all duration-[var(--duration-base)] whitespace-nowrap
            ${activeCategory === cat.value
              ? 'bg-[var(--color-brand)] text-white'
              : 'bg-[var(--color-surface-raised)] text-[var(--color-ink-secondary)] border border-[var(--color-border)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
            }
          `}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
