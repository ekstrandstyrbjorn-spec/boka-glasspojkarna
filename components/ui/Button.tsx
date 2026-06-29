'use client'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-brand)] text-white hover:opacity-90 active:scale-[0.98]',
  secondary: 'border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]',
  ghost: 'text-[var(--color-ink-secondary)] hover:text-[var(--color-ink)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        rounded-[var(--radius-button)] transition-all duration-[var(--duration-fast)]
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
