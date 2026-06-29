type Variant = 'brand' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  brand: 'bg-[var(--color-brand)] text-white',
  neutral: 'bg-[var(--color-surface-raised)] text-[var(--color-ink-secondary)] border border-[var(--color-border)]',
}

export function Badge({ children, variant = 'brand' }: BadgeProps) {
  return (
    <span className={`
      inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wide
      rounded-[var(--radius-pill)] ${variantClasses[variant]}
    `}>
      {children}
    </span>
  )
}
