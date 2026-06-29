# Task 2: Design System

## Context
You are implementing Task 2 of boka.glasspojkarna.se — a premium Next.js booking site for Glasspojkarna's party packages. Task 1 (project bootstrap) is complete: Next.js 16, Tailwind CSS, Vitest, framer-motion, and zustand are all installed. The project is at `C:/claude code`.

## Your job
Implement the design system: CSS custom properties, Button component, Badge component, and tests for both.

## Files to create/modify

### 1. `styles/globals.css` — replace entire contents
```css
@import "tailwindcss";

:root {
  --color-brand: #D0021B;
  --color-brand-light: rgba(208, 2, 27, 0.08);
  --color-cream: #FDFAF6;
  --color-ink: #0F0D0C;
  --color-ink-secondary: #6B6560;
  --color-ink-tertiary: #B8B3AE;
  --color-surface: #FFFFFF;
  --color-surface-raised: #FDFAF6;
  --color-border: #EBEBEA;
  --color-success: #1A9E6B;
  --color-warning: #D97706;

  --radius-card: 20px;
  --radius-button: 12px;
  --radius-input: 12px;
  --radius-pill: 999px;
  --radius-sheet: 24px;

  --shadow-card: 0 2px 12px rgba(15,13,12,0.06);
  --shadow-card-hover: 0 8px 32px rgba(15,13,12,0.12);
  --shadow-sticky: 0 -4px 24px rgba(15,13,12,0.08);
  --shadow-modal: 0 24px 64px rgba(15,13,12,0.18);

  --duration-fast: 120ms;
  --duration-base: 220ms;
  --duration-slow: 380ms;
}

body {
  color: var(--color-ink);
  background: var(--color-surface);
  -webkit-font-smoothing: antialiased;
}
```

### 2. `components/ui/Button.tsx` — create (new file, new directory)
```tsx
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
```

### 3. `components/ui/Badge.tsx` — create
```tsx
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
```

### 4. `lib/__tests__/design-system.test.tsx` — create (new directory)
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

test('Button renders with label and handles click', async () => {
  const onClick = vi.fn()
  render(<Button onClick={onClick}>Boka nu</Button>)
  expect(screen.getByRole('button', { name: 'Boka nu' })).toBeInTheDocument()
  await userEvent.click(screen.getByRole('button'))
  expect(onClick).toHaveBeenCalledTimes(1)
})

test('Button is disabled when disabled prop is true', () => {
  render(<Button disabled>Boka nu</Button>)
  expect(screen.getByRole('button')).toBeDisabled()
})

test('Badge renders children', () => {
  render(<Badge>Populärt</Badge>)
  expect(screen.getByText('Populärt')).toBeInTheDocument()
})
```

## Steps
1. Write the files above exactly as shown
2. Run: `pnpm test:run`
3. All 3 tests must pass
4. Commit: `git add . && git commit -m "feat: design system — CSS tokens, Button, Badge"`

## Report
Write your full report to: `C:/claude code/.superpowers/sdd/task-2-report.md`

Then reply with:
- Status: DONE / BLOCKED / NEEDS_CONTEXT
- Commits: (short SHA)
- Tests: (e.g. "3/3 passing")
- Concerns: (any, or "none")
