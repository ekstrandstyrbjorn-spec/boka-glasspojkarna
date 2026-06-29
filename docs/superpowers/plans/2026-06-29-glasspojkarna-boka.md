# boka.glasspojkarna.se Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build boka.glasspojkarna.se — a premium Next.js 15 booking experience for Glasspojkarna's party packages, backed by the Booqable Boomerang API.

**Architecture:** Next.js 15 App Router app on Vercel. Package data is fetched server-side from Booqable. Availability is checked via a Next.js Route Handler (keeps API key server-side). The 4-step booking flow is a client-side multi-step form; on completion it POSTs to a Route Handler that creates an order in Booqable. Booqable's native Fortnox integration handles invoicing automatically.

**Tech Stack:** Next.js 15, TypeScript 5, Tailwind CSS 4, Framer Motion 11, Vitest + Testing Library, Booqable Boomerang API v1

## Global Constraints

- All UI copy in Swedish
- Mobile-first: design at 375px, enhance upward
- WCAG 2.1 AA: keyboard navigable, sufficient contrast, ARIA labels
- `BOOQABLE_API_KEY` never exposed to browser — all Booqable calls via Route Handlers or server components
- All Framer Motion animations check `useReducedMotion()` and skip animation when true
- Prices in SEK: `amount.toLocaleString('sv-SE')` + ` kr`
- Node.js ≥ 20, pnpm as package manager

---

## File Map

```
boka.glasspojkarna.se/
├── app/
│   ├── layout.tsx                     root layout, NavBar, fonts
│   ├── page.tsx                       landing page
│   ├── paket/[slug]/
│   │   ├── page.tsx                   package detail
│   │   └── boka/page.tsx              booking flow
│   ├── bekraftelse/page.tsx           confirmation
│   ├── offert/page.tsx                quote form
│   └── api/
│       ├── availability/route.ts      proxy: Booqable availability
│       └── orders/route.ts            proxy: Booqable order creation
├── components/
│   ├── layout/NavBar.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── PackageGrid.tsx
│   │   └── PackageCard.tsx
│   ├── detail/
│   │   ├── PackageHero.tsx
│   │   ├── InclusionList.tsx
│   │   ├── GalleryGrid.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── FAQAccordion.tsx
│   │   └── StickyBookButton.tsx
│   ├── booking/
│   │   ├── BookingProgress.tsx
│   │   ├── StepDate.tsx
│   │   ├── DatePicker.tsx
│   │   ├── GuestCounter.tsx
│   │   ├── StepExtras.tsx
│   │   ├── AddOnSelector.tsx
│   │   ├── PriceCounter.tsx
│   │   ├── StepContact.tsx
│   │   ├── ContactForm.tsx
│   │   ├── StepSummary.tsx
│   │   └── BookingSummary.tsx
│   ├── confirmation/ConfirmationScreen.tsx
│   ├── quote/QuoteForm.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Badge.tsx
├── lib/
│   ├── booqable/
│   │   ├── client.ts                  fetch wrapper with auth
│   │   ├── products.ts                list product groups + variants
│   │   ├── availability.ts            check date availability
│   │   └── orders.ts                  create order + customer
│   ├── types.ts                       all shared TypeScript types
│   └── price.ts                       client-side price calculation
├── hooks/useBookingState.ts           booking flow state (zustand)
├── styles/globals.css                 CSS custom properties
├── tailwind.config.ts
├── next.config.ts
├── vitest.config.ts
├── .env.local
└── .env.example
```

---

## Prerequisites (Do Before Any Coding)

### Booqable Account Setup
- [ ] Log into booqable.com, go to Settings → API → create API key, save as `BOOQABLE_API_KEY`
- [ ] Note your subdomain (e.g. `glasspojkarna`) — save as `BOOQABLE_SUBDOMAIN`
- [ ] Create 12 product groups (one per package tier — see spec section 4)
- [ ] For each product group: set name, description, base price, and rental period (daily)
- [ ] Create add-on products: Leverans (1500 kr), Personal, Städning, Extra portioner, Extra koner, Extra mix, Godis
- [ ] Enable Fortnox integration in Booqable Settings → Integrations
- [ ] Configure confirmation email template in Booqable Settings → Emails

---

## Task 1: Project Bootstrap

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`, `.env.example`, `styles/globals.css`

**Interfaces:**
- Produces: runnable dev server at localhost:3000, passing `pnpm test` baseline

- [ ] **Step 1: Scaffold Next.js project**

```bash
pnpm create next-app@latest boka.glasspojkarna.se \
  --typescript --tailwind --app --src-dir=false \
  --import-alias="@/*" --no-eslint
cd boka.glasspojkarna.se
```

- [ ] **Step 2: Install dependencies**

```bash
pnpm add framer-motion zustand
pnpm add -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/user-event \
  @testing-library/jest-dom
```

- [ ] **Step 3: Write vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': new URL('./').pathname },
  },
})
```

- [ ] **Step 4: Write vitest.setup.ts**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

In `package.json` scripts, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Write .env.example**

```
BOOQABLE_API_KEY=your_api_key_here
BOOQABLE_SUBDOMAIN=your_subdomain_here
NEXT_PUBLIC_SITE_URL=https://boka.glasspojkarna.se
```

- [ ] **Step 7: Copy .env.example to .env.local and fill in real values**

```bash
cp .env.example .env.local
# Edit .env.local with real BOOQABLE_API_KEY and BOOQABLE_SUBDOMAIN
```

- [ ] **Step 8: Verify dev server starts**

```bash
pnpm dev
```
Expected: server running at http://localhost:3000 with default Next.js page.

- [ ] **Step 9: Run tests baseline**

```bash
pnpm test:run
```
Expected: "No test files found" — not an error at this stage.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: bootstrap Next.js 15 project with Tailwind and Vitest"
```

---

## Task 2: Design System

**Files:**
- Modify: `styles/globals.css`
- Create: `components/ui/Button.tsx`, `components/ui/Badge.tsx`
- Create: `lib/__tests__/design-system.test.tsx`

**Interfaces:**
- Produces:
  - `Button` — `({ children, variant?, size?, onClick?, type?, disabled?, className? }: ButtonProps) => JSX.Element`
  - `Badge` — `({ children, variant? }: BadgeProps) => JSX.Element`

- [ ] **Step 1: Write failing test**

```tsx
// lib/__tests__/design-system.test.tsx
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

- [ ] **Step 2: Run to confirm failure**

```bash
pnpm test:run
```
Expected: FAIL — cannot find module `@/components/ui/Button`

- [ ] **Step 3: Write globals.css with CSS custom properties**

```css
/* styles/globals.css */
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
  font-family: var(--font-sans, system-ui, sans-serif);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Write Button.tsx**

```tsx
// components/ui/Button.tsx
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

- [ ] **Step 5: Write Badge.tsx**

```tsx
// components/ui/Badge.tsx
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

- [ ] **Step 6: Run tests — expect pass**

```bash
pnpm test:run
```
Expected: 3 tests passing

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: design system — CSS tokens, Button, Badge"
```

---

## Task 3: TypeScript Types

**Files:**
- Create: `lib/types.ts`

**Interfaces:**
- Produces: all shared types consumed by every subsequent task

- [ ] **Step 1: Write lib/types.ts**

```ts
// lib/types.ts

export type PackageCategory = 'glass' | 'popcorn' | 'slush' | 'sockervadds'
export type PackageTier = 'S' | 'L' | 'XL'
export type CustomerType = 'private' | 'business'

export interface Inclusion {
  label: string
  quantity?: string
}

export interface AddOn {
  id: string           // Booqable product ID
  name: string
  description?: string
  priceInCents: number
  type: 'toggle' | 'quantity'
  maxQuantity?: number
}

export interface Package {
  id: string           // Booqable product group ID
  slug: string
  name: string
  category: PackageCategory
  tier: PackageTier
  description: string
  guestsMax: number
  basePriceInCents: number
  inclusions: Inclusion[]
  addOns: AddOn[]
  imageUrl: string
  gallery: string[]
  isPopular: boolean
}

export interface BookingState {
  packageId: string
  packageSlug: string
  packageName: string
  packagePriceInCents: number
  startDate: string        // ISO date string "YYYY-MM-DD"
  endDate: string          // ISO date string "YYYY-MM-DD"
  guests: number
  selectedAddOns: SelectedAddOn[]
  customerType: CustomerType
  name: string
  phone: string
  email: string
  address: string
  eventLocation: string
  notes: string
  companyName?: string
  orgNumber?: string
}

export interface SelectedAddOn {
  addOnId: string
  name: string
  quantity: number
  priceInCents: number
}

export interface PriceBreakdown {
  baseInCents: number
  addOnsInCents: number
  deliveryInCents: number
  subtotalInCents: number
  vatInCents: number
  totalInCents: number
}

export interface BookingConfirmation {
  orderId: string
  orderNumber: string
  email: string
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: shared TypeScript types"
```

---

## Task 4: Price Calculation

**Files:**
- Create: `lib/price.ts`
- Create: `lib/__tests__/price.test.ts`

**Interfaces:**
- Consumes: `BookingState`, `PriceBreakdown` from `@/lib/types`
- Produces: `calculatePrice(state: BookingState): PriceBreakdown`

- [ ] **Step 1: Write failing tests**

```ts
// lib/__tests__/price.test.ts
import { calculatePrice } from '@/lib/price'
import type { BookingState } from '@/lib/types'

const base: BookingState = {
  packageId: '1', packageSlug: 'glass-l', packageName: 'Glass L',
  packagePriceInCents: 195000,
  startDate: '2026-08-01', endDate: '2026-08-01',
  guests: 80,
  selectedAddOns: [],
  customerType: 'private',
  name: '', phone: '', email: '', address: '', eventLocation: '', notes: '',
}

test('base price only', () => {
  const result = calculatePrice(base)
  expect(result.baseInCents).toBe(195000)
  expect(result.addOnsInCents).toBe(0)
  expect(result.deliveryInCents).toBe(0)
  expect(result.subtotalInCents).toBe(195000)
  expect(result.vatInCents).toBe(48750)   // 25% of 195000
  expect(result.totalInCents).toBe(243750)
})

test('adds add-on costs', () => {
  const state = {
    ...base,
    selectedAddOns: [
      { addOnId: '2', name: 'Leverans', quantity: 1, priceInCents: 150000 },
    ],
  }
  const result = calculatePrice(state)
  expect(result.deliveryInCents).toBe(150000)
  expect(result.subtotalInCents).toBe(345000)
  expect(result.totalInCents).toBe(431250)
})

test('adds quantity add-ons', () => {
  const state = {
    ...base,
    selectedAddOns: [
      { addOnId: '3', name: 'Extra portioner', quantity: 3, priceInCents: 5000 },
    ],
  }
  const result = calculatePrice(state)
  expect(result.addOnsInCents).toBe(15000)
})
```

- [ ] **Step 2: Run — expect failure**

```bash
pnpm test:run lib/__tests__/price.test.ts
```
Expected: FAIL — cannot find module

- [ ] **Step 3: Write lib/price.ts**

```ts
// lib/price.ts
import type { BookingState, PriceBreakdown } from '@/lib/types'

const VAT_RATE = 0.25
const DELIVERY_ADD_ON_NAMES = ['Leverans']

export function calculatePrice(state: BookingState): PriceBreakdown {
  const baseInCents = state.packagePriceInCents

  let addOnsInCents = 0
  let deliveryInCents = 0

  for (const addOn of state.selectedAddOns) {
    const cost = addOn.priceInCents * addOn.quantity
    if (DELIVERY_ADD_ON_NAMES.includes(addOn.name)) {
      deliveryInCents += cost
    } else {
      addOnsInCents += cost
    }
  }

  const subtotalInCents = baseInCents + addOnsInCents + deliveryInCents
  const vatInCents = Math.round(subtotalInCents * VAT_RATE)
  const totalInCents = subtotalInCents + vatInCents

  return { baseInCents, addOnsInCents, deliveryInCents, subtotalInCents, vatInCents, totalInCents }
}

export function formatSEK(cents: number): string {
  return (cents / 100).toLocaleString('sv-SE') + ' kr'
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
pnpm test:run lib/__tests__/price.test.ts
```
Expected: 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add lib/price.ts lib/__tests__/price.test.ts
git commit -m "feat: price calculation with VAT"
```

---

## Task 5: Booqable API Client

**Files:**
- Create: `lib/booqable/client.ts`
- Create: `lib/booqable/products.ts`
- Create: `lib/booqable/availability.ts`
- Create: `lib/booqable/orders.ts`
- Create: `lib/__tests__/booqable.test.ts`

**Interfaces:**
- Produces:
  - `booqable.get<T>(path: string): Promise<T>`
  - `booqable.post<T>(path: string, body: unknown): Promise<T>`
  - `getPackages(): Promise<Package[]>`
  - `getPackage(slug: string): Promise<Package>`
  - `checkAvailability(productId: string, startDate: string, endDate: string): Promise<boolean>`
  - `createOrder(state: BookingState): Promise<BookingConfirmation>`

- [ ] **Step 1: Write failing tests (mocked fetch)**

```ts
// lib/__tests__/booqable.test.ts
import { vi, test, expect, beforeEach } from 'vitest'
import { booqable } from '@/lib/booqable/client'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => {
  vi.resetAllMocks()
  process.env.BOOQABLE_API_KEY = 'test-key'
  process.env.BOOQABLE_SUBDOMAIN = 'test-subdomain'
})

test('GET request sends correct auth header', async () => {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: [] }),
  })
  await booqable.get('/products')
  expect(mockFetch).toHaveBeenCalledWith(
    'https://test-subdomain.booqable.com/api/boomerang/products',
    expect.objectContaining({
      headers: expect.objectContaining({
        Authorization: 'Bearer test-key',
      }),
    })
  )
})

test('GET throws on non-ok response', async () => {
  mockFetch.mockResolvedValueOnce({ ok: false, status: 401, json: async () => ({}) })
  await expect(booqable.get('/products')).rejects.toThrow('Booqable API error 401')
})
```

- [ ] **Step 2: Run — expect failure**

```bash
pnpm test:run lib/__tests__/booqable.test.ts
```
Expected: FAIL

- [ ] **Step 3: Write lib/booqable/client.ts**

```ts
// lib/booqable/client.ts
function baseUrl() {
  const subdomain = process.env.BOOQABLE_SUBDOMAIN
  if (!subdomain) throw new Error('BOOQABLE_SUBDOMAIN is not set')
  return `https://${subdomain}.booqable.com/api/boomerang`
}

function headers() {
  const key = process.env.BOOQABLE_API_KEY
  if (!key) throw new Error('BOOQABLE_API_KEY is not set')
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: { ...headers(), ...(init.headers ?? {}) },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`Booqable API error ${res.status}`)
  return res.json() as Promise<T>
}

export const booqable = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
}
```

- [ ] **Step 4: Write lib/booqable/products.ts**

```ts
// lib/booqable/products.ts
import { booqable } from './client'
import type { Package, PackageCategory } from '@/lib/types'

interface BooqableProductGroup {
  id: string
  attributes: {
    name: string
    description: string
    base_price_in_cents: number
    slug: string
    photo_url?: string
    extra_information?: string  // JSON stringified metadata stored in Booqable
  }
}

// Booqable does not know our domain model — we enrich from name convention.
// Package names must follow pattern: "[Category] [Tier]" e.g. "Glass S", "Popcorn L"
function parseCategoryAndTier(name: string): { category: PackageCategory; tier: 'S' | 'L' | 'XL' } {
  const parts = name.toLowerCase().split(' ')
  const tierMap: Record<string, 'S' | 'L' | 'XL'> = { s: 'S', l: 'L', xl: 'XL' }
  const categoryMap: Record<string, PackageCategory> = {
    glass: 'glass', popcorn: 'popcorn', slush: 'slush', sockervadds: 'sockervadds',
  }
  return {
    category: categoryMap[parts[0]] ?? 'glass',
    tier: tierMap[parts[1]] ?? 'S',
  }
}

export async function getPackages(): Promise<Package[]> {
  const res = await booqable.get<{ data: BooqableProductGroup[] }>('/product_groups?filter[product_type]=rental')
  return res.data.map(pg => {
    const { category, tier } = parseCategoryAndTier(pg.attributes.name)
    const meta = pg.attributes.extra_information
      ? JSON.parse(pg.attributes.extra_information)
      : {}
    return {
      id: pg.id,
      slug: pg.attributes.slug,
      name: pg.attributes.name,
      category,
      tier,
      description: pg.attributes.description,
      guestsMax: meta.guestsMax ?? 50,
      basePriceInCents: pg.attributes.base_price_in_cents,
      inclusions: meta.inclusions ?? [],
      addOns: meta.addOns ?? [],
      imageUrl: pg.attributes.photo_url ?? '',
      gallery: meta.gallery ?? [],
      isPopular: tier === 'L',
    }
  })
}

export async function getPackage(slug: string): Promise<Package> {
  const packages = await getPackages()
  const pkg = packages.find(p => p.slug === slug)
  if (!pkg) throw new Error(`Package not found: ${slug}`)
  return pkg
}
```

- [ ] **Step 5: Write lib/booqable/availability.ts**

```ts
// lib/booqable/availability.ts
import { booqable } from './client'

interface PlanningResponse {
  data: Array<{ attributes: { available: boolean } }>
}

export async function checkAvailability(
  productGroupId: string,
  startDate: string,
  endDate: string,
): Promise<boolean> {
  const params = new URLSearchParams({
    'filter[item_id]': productGroupId,
    'filter[starts_at]': `${startDate}T00:00:00Z`,
    'filter[ends_at]': `${endDate}T23:59:59Z`,
  })
  const res = await booqable.get<PlanningResponse>(`/planning_suggestions?${params}`)
  return res.data.every(d => d.attributes.available)
}
```

- [ ] **Step 6: Write lib/booqable/orders.ts**

```ts
// lib/booqable/orders.ts
import { booqable } from './client'
import type { BookingState, BookingConfirmation } from '@/lib/types'

interface BooqableOrderResponse {
  data: { id: string; attributes: { number: string } }
}

interface BooqableCustomerResponse {
  data: { id: string }
}

export async function createOrder(state: BookingState): Promise<BookingConfirmation> {
  // 1. Create customer
  const customerRes = await booqable.post<BooqableCustomerResponse>('/customers', {
    data: {
      type: 'customers',
      attributes: {
        name: state.name,
        email: state.email,
        phone: state.phone,
      },
    },
  })
  const customerId = customerRes.data.id

  // 2. Create order
  const addOnNote = state.selectedAddOns
    .map(a => `${a.name} ×${a.quantity}`)
    .join(', ')
  const orderRes = await booqable.post<BooqableOrderResponse>('/orders', {
    data: {
      type: 'orders',
      attributes: {
        starts_at: `${state.startDate}T00:00:00Z`,
        stops_at: `${state.endDate}T23:59:59Z`,
        customer_id: customerId,
        note: [
          `Gäster: ${state.guests}`,
          `Eventplats: ${state.eventLocation}`,
          `Adress: ${state.address}`,
          addOnNote ? `Tillval: ${addOnNote}` : '',
          state.notes ? `Övrigt: ${state.notes}` : '',
          state.customerType === 'business'
            ? `Företag: ${state.companyName}, Org: ${state.orgNumber}`
            : '',
        ].filter(Boolean).join('\n'),
      },
    },
  })

  return {
    orderId: orderRes.data.id,
    orderNumber: orderRes.data.attributes.number,
    email: state.email,
  }
}
```

- [ ] **Step 7: Run all tests**

```bash
pnpm test:run
```
Expected: all previous tests still pass; Booqable client tests pass

- [ ] **Step 8: Commit**

```bash
git add lib/booqable/ lib/__tests__/booqable.test.ts
git commit -m "feat: Booqable API client — products, availability, orders"
```

---

## Task 6: Route Handlers (API Proxy)

**Files:**
- Create: `app/api/availability/route.ts`
- Create: `app/api/orders/route.ts`

**Interfaces:**
- Consumes: `checkAvailability`, `createOrder` from `@/lib/booqable/`
- Produces:
  - `GET /api/availability?productId=&startDate=&endDate=` → `{ available: boolean }`
  - `POST /api/orders` body: `BookingState` → `BookingConfirmation`

- [ ] **Step 1: Write app/api/availability/route.ts**

```ts
// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { checkAvailability } from '@/lib/booqable/availability'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const productId = searchParams.get('productId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  if (!productId || !startDate || !endDate) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const available = await checkAvailability(productId, startDate, endDate)
    return NextResponse.json({ available })
  } catch {
    return NextResponse.json({ error: 'Could not check availability' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Write app/api/orders/route.ts**

```ts
// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/booqable/orders'
import type { BookingState } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const state: BookingState = await req.json()
    const confirmation = await createOrder(state)
    return NextResponse.json(confirmation)
  } catch {
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add app/api/
git commit -m "feat: API route handlers for availability and order creation"
```

---

## Task 7: Booking State (Zustand)

**Files:**
- Create: `hooks/useBookingState.ts`
- Create: `lib/__tests__/useBookingState.test.ts`

**Interfaces:**
- Produces:
  - `useBookingState()` — returns `{ state: BookingState, update: (patch: Partial<BookingState>) => void, reset: () => void, currentStep: number, setStep: (n: number) => void }`

- [ ] **Step 1: Write failing test**

```ts
// lib/__tests__/useBookingState.test.ts
import { renderHook, act } from '@testing-library/react'
import { useBookingState } from '@/hooks/useBookingState'

test('update merges partial state', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => result.current.update({ name: 'Anna', email: 'anna@test.se' }))
  expect(result.current.state.name).toBe('Anna')
  expect(result.current.state.email).toBe('anna@test.se')
})

test('setStep updates currentStep', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => result.current.setStep(2))
  expect(result.current.currentStep).toBe(2)
})

test('reset clears state to initial', () => {
  const { result } = renderHook(() => useBookingState())
  act(() => {
    result.current.update({ name: 'Anna' })
    result.current.reset()
  })
  expect(result.current.state.name).toBe('')
  expect(result.current.currentStep).toBe(1)
})
```

- [ ] **Step 2: Run — expect failure**

```bash
pnpm test:run lib/__tests__/useBookingState.test.ts
```

- [ ] **Step 3: Write hooks/useBookingState.ts**

```ts
// hooks/useBookingState.ts
import { create } from 'zustand'
import type { BookingState } from '@/lib/types'

const INITIAL_STATE: BookingState = {
  packageId: '', packageSlug: '', packageName: '', packagePriceInCents: 0,
  startDate: '', endDate: '', guests: 1,
  selectedAddOns: [],
  customerType: 'private',
  name: '', phone: '', email: '', address: '', eventLocation: '', notes: '',
}

interface BookingStore {
  state: BookingState
  currentStep: number
  update: (patch: Partial<BookingState>) => void
  reset: () => void
  setStep: (step: number) => void
}

export const useBookingState = create<BookingStore>(set => ({
  state: INITIAL_STATE,
  currentStep: 1,
  update: patch => set(s => ({ state: { ...s.state, ...patch } })),
  reset: () => set({ state: INITIAL_STATE, currentStep: 1 }),
  setStep: step => set({ currentStep: step }),
}))
```

- [ ] **Step 4: Run tests — expect pass**

```bash
pnpm test:run
```

- [ ] **Step 5: Commit**

```bash
git add hooks/useBookingState.ts lib/__tests__/useBookingState.test.ts
git commit -m "feat: booking flow state with zustand"
```

---

## Task 8: NavBar

**Files:**
- Create: `components/layout/NavBar.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `NavBar` component rendered in root layout

- [ ] **Step 1: Write components/layout/NavBar.tsx**

```tsx
// components/layout/NavBar.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export function NavBar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-[var(--duration-base)]
        ${scrolled ? 'backdrop-blur-md bg-white/80 shadow-sm' : 'bg-transparent'}
      `}
    >
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="https://glasspojkarna.se" aria-label="Glasspojkarna">
          <Image src="/images/logo.svg" alt="Glasspojkarna" width={140} height={36} priority />
        </Link>
        <a
          href="tel:+46850924501"
          className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink-secondary)] hover:text-[var(--color-brand)] transition-colors"
          aria-label="Ring oss"
        >
          <span className="hidden sm:inline">08-509 245 01</span>
          <span className="sm:hidden" aria-hidden>📞</span>
        </a>
      </nav>
    </header>
  )
}
```

- [ ] **Step 2: Update app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NavBar } from '@/components/layout/NavBar'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Boka partypaket – Glasspojkarna',
  description: 'Boka glassmaskiner, popcornmaskiner, slushmaskin och sockervaddsmaskin direkt online.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body className={inter.variable}>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Add logo to public/images/**

Place `logo.svg` from the Glasspojkarna brand at `public/images/logo.svg`. Export the red variant from the existing site.

- [ ] **Step 4: Verify in browser**

```bash
pnpm dev
```
Open http://localhost:3000. NavBar should appear with logo. Scroll — background should blur.

- [ ] **Step 5: Commit**

```bash
git add components/layout/ app/layout.tsx public/images/logo.svg
git commit -m "feat: NavBar with scroll blur effect"
```

---

## Task 9: Landing Page

**Files:**
- Create: `components/landing/HeroSection.tsx`
- Create: `components/landing/PackageCard.tsx`
- Create: `components/landing/PackageGrid.tsx`
- Create: `components/landing/CategoryFilter.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Package` from `@/lib/types`, `getPackages()` from `@/lib/booqable/products`
- Produces: full landing page at `/`

- [ ] **Step 1: Write HeroSection.tsx**

```tsx
// components/landing/HeroSection.tsx
'use client'
import { useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

export function HeroSection() {
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpg')" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" aria-hidden />

      {/* Content */}
      <div
        className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto pt-16"
        style={{
          opacity: reduce ? 1 : undefined,
          animation: reduce ? undefined : 'fadeUp 0.8s ease-out forwards',
        }}
      >
        <h1 className="text-[40px] sm:text-[64px] lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6">
          Gör festen<br />oförglömlig
        </h1>
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto">
          Allt inkluderat. Boka på några minuter.
        </p>
        <Button
          size="lg"
          onClick={() => {
            document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Se alla paket
        </Button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-sm flex flex-col items-center gap-2" aria-hidden>
        <span>Scrolla ned</span>
        <div className="w-px h-8 bg-white/40" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
```

- [ ] **Step 2: Write PackageCard.tsx**

```tsx
// components/landing/PackageCard.tsx
'use client'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatSEK } from '@/lib/price'
import type { Package } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  glass: 'Glassmaskin',
  popcorn: 'Popcornmaskin',
  slush: 'Slushmaskin',
  sockervadds: 'Sockervaddsmaskin',
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className="
        bg-[var(--color-surface-raised)] rounded-[var(--radius-card)]
        shadow-[var(--shadow-card)] overflow-hidden flex flex-col group
        cursor-pointer
      "
      whileHover={reduce ? {} : { y: -4, boxShadow: 'var(--shadow-card-hover)' }}
      transition={{ duration: 0.22 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={pkg.imageUrl || '/images/placeholder.jpg'}
          alt={pkg.name}
          fill
          className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {pkg.isPopular && (
          <div className="absolute top-3 left-3">
            <Badge>Populärt</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-secondary)] mb-1">
            {CATEGORY_LABELS[pkg.category]}
          </p>
          <h3 className="text-xl font-bold text-[var(--color-ink)]">{pkg.name}</h3>
          <p className="text-sm text-[var(--color-ink-secondary)] mt-2 line-clamp-2">{pkg.description}</p>
        </div>

        <ul className="text-sm text-[var(--color-ink-secondary)] space-y-1">
          {pkg.inclusions.slice(0, 3).map((item, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--color-brand)]" aria-hidden>✓</span>
              <span>{item.label}{item.quantity ? ` (${item.quantity})` : ''}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs text-[var(--color-ink-tertiary)]">
          Passar upp till <strong className="text-[var(--color-ink)]">{pkg.guestsMax} gäster</strong>
        </p>

        <div className="mt-auto pt-2 border-t border-[var(--color-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--color-ink-tertiary)]">Från</p>
            <p className="text-2xl font-bold text-[var(--color-ink)] tabular-nums">
              {formatSEK(pkg.basePriceInCents)}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Button variant="primary" size="sm" asChild>
              <Link href={`/paket/${pkg.slug}/boka`}>Boka nu</Link>
            </Button>
            <Link
              href={`/paket/${pkg.slug}`}
              className="text-xs text-[var(--color-ink-secondary)] hover:text-[var(--color-brand)] transition-colors"
            >
              Läs mer →
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
```

Note: the `asChild` prop on Button requires a small update to `Button.tsx` — add `asChild?: boolean` support using the Slot pattern from Radix UI, or simply remove `asChild` and render a plain Link styled as a button.

- [ ] **Step 3: Write CategoryFilter.tsx**

```tsx
// components/landing/CategoryFilter.tsx
'use client'
import { useState } from 'react'
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
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist" aria-label="Filtrera paket">
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
              ? 'bg-[var(--color-brand)] text-white shadow-sm'
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
```

- [ ] **Step 4: Write PackageGrid.tsx**

```tsx
// components/landing/PackageGrid.tsx
'use client'
import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { PackageCard } from './PackageCard'
import type { Package, PackageCategory } from '@/lib/types'

export function PackageGrid({ packages }: { packages: Package[] }) {
  const [activeCategory, setActiveCategory] = useState<PackageCategory | 'all'>('all')

  const filtered = activeCategory === 'all'
    ? packages
    : packages.filter(p => p.category === activeCategory)

  return (
    <section id="packages" className="max-w-6xl mx-auto px-4 py-24">
      <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-ink)] mb-4 text-center">
        Välj ditt paket
      </h2>
      <p className="text-[var(--color-ink-secondary)] text-center mb-10 max-w-xl mx-auto">
        Alla paket inkluderar maskin, ingredienser och tillbehör. Boka direkt online.
      </p>

      <div className="flex justify-center mb-10">
        <CategoryFilter activeCategory={activeCategory} onChange={setActiveCategory} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Write app/page.tsx**

```tsx
// app/page.tsx
import { HeroSection } from '@/components/landing/HeroSection'
import { PackageGrid } from '@/components/landing/PackageGrid'
import { getPackages } from '@/lib/booqable/products'

export default async function LandingPage() {
  const packages = await getPackages()
  return (
    <>
      <HeroSection />
      <PackageGrid packages={packages} />
    </>
  )
}
```

- [ ] **Step 6: Add hero image**

Place a high-quality lifestyle photo at `public/images/hero.jpg` (minimum 1920×1080px).

- [ ] **Step 7: Verify in browser**

```bash
pnpm dev
```
Open http://localhost:3000. Should see hero, scroll to package grid, filter tabs should filter cards.

- [ ] **Step 8: Commit**

```bash
git add components/landing/ app/page.tsx public/images/
git commit -m "feat: landing page — hero, package grid, category filter"
```

---

## Task 10: Package Detail Page

**Files:**
- Create: `components/detail/PackageHero.tsx`
- Create: `components/detail/InclusionList.tsx`
- Create: `components/detail/FAQAccordion.tsx`
- Create: `components/detail/GalleryGrid.tsx`
- Create: `components/detail/StickyBookButton.tsx`
- Create: `app/paket/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getPackage(slug)` from `@/lib/booqable/products`
- Produces: detail page at `/paket/[slug]`

- [ ] **Step 1: Write PackageHero.tsx**

```tsx
// components/detail/PackageHero.tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatSEK } from '@/lib/price'
import type { Package } from '@/lib/types'

export function PackageHero({ pkg }: { pkg: Package }) {
  return (
    <section className="pt-16">
      <div className="relative h-[50vh] sm:h-[60vh] min-h-[320px]">
        <Image src={pkg.imageUrl || '/images/placeholder.jpg'} alt={pkg.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white max-w-6xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-2">Partypaket</p>
          <h1 className="text-4xl sm:text-6xl font-bold mb-4">{pkg.name}</h1>
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-2xl font-bold">Från {formatSEK(pkg.basePriceInCents)}</span>
            <span className="text-white/70">Upp till {pkg.guestsMax} gäster</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-end">
        <Button size="lg" asChild>
          <Link href={`/paket/${pkg.slug}/boka`}>Boka nu</Link>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write InclusionList.tsx**

```tsx
// components/detail/InclusionList.tsx
import type { Inclusion } from '@/lib/types'

export function InclusionList({ inclusions }: { inclusions: Inclusion[] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8">Vad ingår</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inclusions.map((item, i) => (
          <li key={i} className="flex gap-3 items-start p-4 rounded-[var(--radius-card)] bg-[var(--color-surface-raised)] border border-[var(--color-border)]">
            <span className="text-[var(--color-brand)] text-lg font-bold mt-0.5" aria-hidden>✓</span>
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
```

- [ ] **Step 3: Write FAQAccordion.tsx**

```tsx
// components/detail/FAQAccordion.tsx
'use client'
import { useState } from 'react'

interface FAQItem { question: string; answer: string }

const FAQ_ITEMS: FAQItem[] = [
  { question: 'Hur lång tid tar leveransen?', answer: 'Vi levererar och hämtar utrustningen. Leveranstid bokas separat per order.' },
  { question: 'Ingår rengöring?', answer: 'Grundrengöring ingår för slushmaskin (120-gästpaketet). För övriga paket kan städning läggas till som tillval.' },
  { question: 'Kan jag hämta paketet själv?', answer: 'Ja, upphämtning sker i Sollentuna och är kostnadsfri.' },
  { question: 'Vad händer om något går sönder?', answer: 'Kontakta oss direkt på 08-509 245 01 så hjälper vi dig.' },
  { question: 'Kan jag boka samma dag?', answer: 'Vi försöker alltid hjälpa till. Ring oss för akuta bokningar.' },
]

export function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">Vanliga frågor</h2>
      <div className="space-y-2">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="border border-[var(--color-border)] rounded-[var(--radius-card)] overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-[var(--color-ink)] hover:text-[var(--color-brand)] transition-colors"
              aria-expanded={open === i}
            >
              {item.question}
              <span aria-hidden className={`transition-transform duration-[var(--duration-base)] ${open === i ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-[var(--color-ink-secondary)] text-sm leading-relaxed">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write StickyBookButton.tsx**

```tsx
// components/detail/StickyBookButton.tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { formatSEK } from '@/lib/price'

interface Props { slug: string; priceInCents: number; name: string }

export function StickyBookButton({ slug, priceInCents, name }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.5)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-white/90 backdrop-blur-md shadow-[var(--shadow-sticky)] flex items-center justify-between gap-4 sm:hidden"
      role="complementary"
      aria-label="Snabbbokning"
    >
      <div>
        <p className="text-xs text-[var(--color-ink-secondary)]">{name}</p>
        <p className="font-bold text-[var(--color-ink)] tabular-nums">Från {formatSEK(priceInCents)}</p>
      </div>
      <Button size="md" asChild>
        <Link href={`/paket/${slug}/boka`}>Boka nu</Link>
      </Button>
    </div>
  )
}
```

- [ ] **Step 5: Write app/paket/[slug]/page.tsx**

```tsx
// app/paket/[slug]/page.tsx
import { getPackage, getPackages } from '@/lib/booqable/products'
import { PackageHero } from '@/components/detail/PackageHero'
import { InclusionList } from '@/components/detail/InclusionList'
import { FAQAccordion } from '@/components/detail/FAQAccordion'
import { StickyBookButton } from '@/components/detail/StickyBookButton'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const packages = await getPackages()
  return packages.map(p => ({ slug: p.slug }))
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const pkg = await getPackage(params.slug).catch(() => null)
  if (!pkg) notFound()

  return (
    <>
      <PackageHero pkg={pkg} />
      <InclusionList inclusions={pkg.inclusions} />
      <FAQAccordion />
      <StickyBookButton slug={pkg.slug} priceInCents={pkg.basePriceInCents} name={pkg.name} />
      <div className="h-24" aria-hidden /> {/* bottom padding for sticky button */}
    </>
  )
}
```

- [ ] **Step 6: Verify in browser**

```bash
pnpm dev
```
Navigate to http://localhost:3000/paket/glass-l (replace with a real Booqable slug). Detail page should render. Scroll — sticky button appears on mobile.

- [ ] **Step 7: Commit**

```bash
git add components/detail/ app/paket/
git commit -m "feat: package detail page with inclusions, FAQ, sticky book button"
```

---

## Task 11: Booking Flow — Steps 1 & 2

**Files:**
- Create: `components/booking/BookingProgress.tsx`
- Create: `components/booking/StepDate.tsx`
- Create: `components/booking/DatePicker.tsx`
- Create: `components/booking/GuestCounter.tsx`
- Create: `components/booking/StepExtras.tsx`
- Create: `components/booking/AddOnSelector.tsx`
- Create: `components/booking/PriceCounter.tsx`
- Create: `app/paket/[slug]/boka/page.tsx`

**Interfaces:**
- Consumes: `useBookingState`, `getPackage`, `checkAvailability` (via `/api/availability`)
- Produces: `/paket/[slug]/boka` — booking flow steps 1 and 2

- [ ] **Step 1: Write BookingProgress.tsx**

```tsx
// components/booking/BookingProgress.tsx
const STEPS = ['Datum', 'Tillval', 'Uppgifter', 'Bekräfta']

export function BookingProgress({ currentStep }: { currentStep: number }) {
  return (
    <nav aria-label="Bokningssteg" className="flex items-center justify-center gap-2 py-6">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < currentStep
        const active = step === currentStep
        return (
          <div key={step} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? 'bg-[var(--color-success)] text-white' : ''}
                ${active ? 'bg-[var(--color-brand)] text-white' : ''}
                ${!done && !active ? 'bg-[var(--color-surface-raised)] text-[var(--color-ink-tertiary)] border border-[var(--color-border)]' : ''}
              `} aria-current={active ? 'step' : undefined}>
                {done ? '✓' : step}
              </div>
              <span className={`text-xs hidden sm:block ${active ? 'text-[var(--color-brand)] font-semibold' : 'text-[var(--color-ink-tertiary)]'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-8 sm:w-16 h-px mb-5 ${done ? 'bg-[var(--color-success)]' : 'bg-[var(--color-border)]'}`} aria-hidden />
            )}
          </div>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 2: Write GuestCounter.tsx**

```tsx
// components/booking/GuestCounter.tsx
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
        aria-label="Minska antal"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-12 h-12 rounded-full border border-[var(--color-border)] text-2xl font-light
          disabled:opacity-30 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
      >
        −
      </button>
      <span className="text-3xl font-bold tabular-nums w-12 text-center" aria-live="polite">{value}</span>
      <button
        aria-label="Öka antal"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-12 h-12 rounded-full border border-[var(--color-border)] text-2xl font-light
          disabled:opacity-30 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors"
      >
        +
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Write DatePicker.tsx**

```tsx
// components/booking/DatePicker.tsx
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
      .then(d => setStatus(d.available ? 'available' : 'unavailable'))
      .catch(() => setStatus('unknown'))
  }, [productId, startDate, endDate])

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Eventdatum</span>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={e => {
              onStartChange(e.target.value)
              if (!endDate || e.target.value > endDate) onEndChange(e.target.value)
            }}
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)]
              focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)]"
            aria-label="Välj eventdatum"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-[var(--color-ink)]">Återlämning</span>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={e => onEndChange(e.target.value)}
            className="px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)]
              focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)]"
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
```

- [ ] **Step 4: Write StepDate.tsx**

```tsx
// components/booking/StepDate.tsx
'use client'
import { DatePicker } from './DatePicker'
import { GuestCounter } from './GuestCounter'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import type { Package } from '@/lib/types'

export function StepDate({ pkg }: { pkg: Package }) {
  const { state, update, setStep } = useBookingState()

  const canProceed = !!state.startDate && !!state.endDate && state.guests >= 1

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-6">Välj datum och antal gäster</h2>
        <DatePicker
          productId={pkg.id}
          startDate={state.startDate}
          endDate={state.endDate}
          onStartChange={d => update({ startDate: d })}
          onEndChange={d => update({ endDate: d })}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-[var(--color-ink)] mb-4">Antal gäster</p>
        {state.guests > pkg.guestsMax && (
          <p className="text-sm text-[var(--color-warning)] mb-3">
            Paketet passar upp till {pkg.guestsMax} gäster. Kontakta oss för större event.
          </p>
        )}
        <GuestCounter
          value={state.guests}
          max={pkg.guestsMax * 2}
          onChange={n => update({ guests: n })}
        />
      </div>

      <Button disabled={!canProceed} onClick={() => setStep(2)} size="lg" className="w-full sm:w-auto">
        Fortsätt →
      </Button>
    </div>
  )
}
```

- [ ] **Step 5: Write AddOnSelector.tsx**

```tsx
// components/booking/AddOnSelector.tsx
'use client'
import type { AddOn, SelectedAddOn } from '@/lib/types'
import { formatSEK } from '@/lib/price'

interface Props {
  addOns: AddOn[]
  selected: SelectedAddOn[]
  onToggle: (addOn: AddOn) => void
  onQuantityChange: (addOnId: string, qty: number) => void
}

export function AddOnSelector({ addOns, selected, onToggle, onQuantityChange }: Props) {
  const isSelected = (id: string) => selected.some(s => s.addOnId === id)
  const getQty = (id: string) => selected.find(s => s.addOnId === id)?.quantity ?? 0

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
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all
                  ${active ? 'bg-[var(--color-brand)] border-[var(--color-brand)]' : 'border-[var(--color-border)]'}`}
                  aria-hidden
                >
                  {active && <span className="text-white text-xs">✓</span>}
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-ink)]">{addOn.name}</p>
                  {addOn.description && (
                    <p className="text-xs text-[var(--color-ink-secondary)]">{addOn.description}</p>
                  )}
                </div>
              </div>
              <p className="font-bold text-[var(--color-ink)] tabular-nums shrink-0">
                {formatSEK(addOn.priceInCents)}
              </p>
            </div>

            {active && addOn.type === 'quantity' && (
              <div className="mt-3 flex items-center gap-3" onClick={e => e.stopPropagation()}>
                <button
                  aria-label="Minska"
                  onClick={() => onQuantityChange(addOn.id, Math.max(1, getQty(addOn.id) - 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] text-lg font-light hover:border-[var(--color-brand)]"
                >−</button>
                <span className="tabular-nums w-8 text-center font-bold" aria-live="polite">{getQty(addOn.id)}</span>
                <button
                  aria-label="Öka"
                  onClick={() => onQuantityChange(addOn.id, Math.min(addOn.maxQuantity ?? 99, getQty(addOn.id) + 1))}
                  className="w-8 h-8 rounded-full border border-[var(--color-border)] text-lg font-light hover:border-[var(--color-brand)]"
                >+</button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: Write PriceCounter.tsx**

```tsx
// components/booking/PriceCounter.tsx
'use client'
import { useEffect, useRef } from 'react'
import { formatSEK } from '@/lib/price'
import type { PriceBreakdown } from '@/lib/types'

export function PriceCounter({ breakdown }: { breakdown: PriceBreakdown }) {
  const prevRef = useRef(breakdown.totalInCents)
  const changed = prevRef.current !== breakdown.totalInCents
  useEffect(() => { prevRef.current = breakdown.totalInCents })

  return (
    <div className="sticky bottom-4 z-30 mt-8">
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] border border-[var(--color-border)] p-4">
        <div className="flex justify-between text-sm text-[var(--color-ink-secondary)] mb-1">
          <span>Moms (25%)</span>
          <span>{formatSEK(breakdown.vatInCents)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-[var(--color-ink)]">Totalt</span>
          <span
            className={`text-2xl font-bold tabular-nums text-[var(--color-ink)] transition-all duration-[var(--duration-fast)] ${changed ? 'scale-110 text-[var(--color-brand)]' : ''}`}
            aria-live="polite"
            aria-atomic
          >
            {formatSEK(breakdown.totalInCents)}
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Write StepExtras.tsx**

```tsx
// components/booking/StepExtras.tsx
'use client'
import { AddOnSelector } from './AddOnSelector'
import { PriceCounter } from './PriceCounter'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import { calculatePrice } from '@/lib/price'
import type { AddOn, Package } from '@/lib/types'

export function StepExtras({ pkg }: { pkg: Package }) {
  const { state, update, setStep } = useBookingState()

  const handleToggle = (addOn: AddOn) => {
    const exists = state.selectedAddOns.some(s => s.addOnId === addOn.id)
    if (exists) {
      update({ selectedAddOns: state.selectedAddOns.filter(s => s.addOnId !== addOn.id) })
    } else {
      update({
        selectedAddOns: [...state.selectedAddOns, {
          addOnId: addOn.id, name: addOn.name, quantity: 1, priceInCents: addOn.priceInCents,
        }],
      })
    }
  }

  const handleQuantityChange = (addOnId: string, qty: number) => {
    update({
      selectedAddOns: state.selectedAddOns.map(s =>
        s.addOnId === addOnId ? { ...s, quantity: qty } : s
      ),
    })
  }

  const breakdown = calculatePrice(state)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Välj tillval</h2>
      <AddOnSelector
        addOns={pkg.addOns}
        selected={state.selectedAddOns}
        onToggle={handleToggle}
        onQuantityChange={handleQuantityChange}
      />
      <PriceCounter breakdown={breakdown} />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(1)}>← Tillbaka</Button>
        <Button onClick={() => setStep(3)} className="flex-1 sm:flex-none">Fortsätt →</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Write app/paket/[slug]/boka/page.tsx**

```tsx
// app/paket/[slug]/boka/page.tsx
'use client'
import { use } from 'react'
import { useEffect } from 'react'
import { BookingProgress } from '@/components/booking/BookingProgress'
import { StepDate } from '@/components/booking/StepDate'
import { StepExtras } from '@/components/booking/StepExtras'
import { StepContact } from '@/components/booking/StepContact'
import { StepSummary } from '@/components/booking/StepSummary'
import { useBookingState } from '@/hooks/useBookingState'
import { getPackage } from '@/lib/booqable/products'
import { use as reactUse } from 'react'

// Note: this page must be a client component because it uses booking state.
// Package data is passed down from a server parent or fetched client-side.
// For simplicity, fetch package client-side here.

import { useState, useEffect as ue } from 'react'
import type { Package } from '@/lib/types'

export default function BookingPage({ params }: { params: { slug: string } }) {
  const { currentStep } = useBookingState()
  const [pkg, setPkg] = useState<Package | null>(null)

  useEffect(() => {
    fetch(`/api/packages/${params.slug}`)
      .then(r => r.json())
      .then(setPkg)
  }, [params.slug])

  if (!pkg) return <div className="min-h-screen flex items-center justify-center text-[var(--color-ink-secondary)]">Laddar…</div>

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-xl mx-auto px-4 pb-24">
        <BookingProgress currentStep={currentStep} />
        <div className="mt-4">
          {currentStep === 1 && <StepDate pkg={pkg} />}
          {currentStep === 2 && <StepExtras pkg={pkg} />}
          {currentStep === 3 && <StepContact />}
          {currentStep === 4 && <StepSummary pkg={pkg} />}
        </div>
      </div>
    </div>
  )
}
```

Also add a packages API route:

```ts
// app/api/packages/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPackage } from '@/lib/booqable/products'

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const pkg = await getPackage(params.slug)
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
```

- [ ] **Step 9: Verify in browser**

```bash
pnpm dev
```
Navigate to `/paket/glass-l/boka`. Step 1 should show date picker and guest counter. Fill in dates — availability indicator should appear. Click Fortsätt → Step 2 shows add-ons, price updates as you toggle.

- [ ] **Step 10: Commit**

```bash
git add components/booking/ app/paket/ app/api/packages/
git commit -m "feat: booking flow steps 1 and 2 — date, guests, extras"
```

---

## Task 12: Booking Flow — Steps 3 & 4

**Files:**
- Create: `components/booking/StepContact.tsx`
- Create: `components/booking/ContactForm.tsx`
- Create: `components/booking/StepSummary.tsx`
- Create: `components/booking/BookingSummary.tsx`

**Interfaces:**
- Consumes: `useBookingState`, `calculatePrice`, `formatSEK`
- Produces: step 3 (contact info) and step 4 (summary + submission)

- [ ] **Step 1: Write ContactForm.tsx**

```tsx
// components/booking/ContactForm.tsx
'use client'
import { useBookingState } from '@/hooks/useBookingState'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-[var(--color-ink)]">{label}</span>
      {children}
    </label>
  )
}

const inputClass = `
  px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)]
  focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)]
  transition-colors w-full
`

export function ContactForm() {
  const { state, update } = useBookingState()

  return (
    <div className="space-y-4">
      {/* Private / Business toggle */}
      <div className="flex gap-2">
        {(['private', 'business'] as const).map(type => (
          <button
            key={type}
            type="button"
            onClick={() => update({ customerType: type })}
            className={`flex-1 py-2.5 rounded-[var(--radius-button)] border font-semibold text-sm transition-all
              ${state.customerType === type
                ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                : 'border-[var(--color-border)] text-[var(--color-ink-secondary)] hover:border-[var(--color-brand)]'
              }`}
            aria-pressed={state.customerType === type}
          >
            {type === 'private' ? 'Privatperson' : 'Företag'}
          </button>
        ))}
      </div>

      <Field label="Namn *">
        <input className={inputClass} value={state.name} onChange={e => update({ name: e.target.value })} required autoComplete="name" />
      </Field>

      <Field label="Telefon *">
        <input className={inputClass} type="tel" value={state.phone} onChange={e => update({ phone: e.target.value })} required autoComplete="tel" />
      </Field>

      <Field label="E-post *">
        <input className={inputClass} type="email" value={state.email} onChange={e => update({ email: e.target.value })} required autoComplete="email" />
      </Field>

      <Field label="Faktureringsadress *">
        <input className={inputClass} value={state.address} onChange={e => update({ address: e.target.value })} required autoComplete="street-address" />
      </Field>

      <Field label="Eventplats">
        <input className={inputClass} value={state.eventLocation} onChange={e => update({ eventLocation: e.target.value })} placeholder="Adress eller beskrivning" />
      </Field>

      {state.customerType === 'business' && (
        <>
          <Field label="Företagsnamn *">
            <input className={inputClass} value={state.companyName ?? ''} onChange={e => update({ companyName: e.target.value })} required autoComplete="organization" />
          </Field>
          <Field label="Organisationsnummer *">
            <input className={inputClass} value={state.orgNumber ?? ''} onChange={e => update({ orgNumber: e.target.value })} placeholder="556XXX-XXXX" />
          </Field>
        </>
      )}

      <Field label="Övrig information">
        <textarea className={inputClass} rows={3} value={state.notes} onChange={e => update({ notes: e.target.value })} placeholder="Allergier, önskemål, frågor…" />
      </Field>
    </div>
  )
}
```

- [ ] **Step 2: Write StepContact.tsx**

```tsx
// components/booking/StepContact.tsx
'use client'
import { ContactForm } from './ContactForm'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'

export function StepContact() {
  const { state, setStep } = useBookingState()
  const canProceed = !!state.name && !!state.phone && !!state.email && !!state.address

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Dina uppgifter</h2>
      <ContactForm />
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)}>← Tillbaka</Button>
        <Button disabled={!canProceed} onClick={() => setStep(4)} className="flex-1 sm:flex-none">
          Granska bokning →
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write BookingSummary.tsx**

```tsx
// components/booking/BookingSummary.tsx
import { formatSEK } from '@/lib/price'
import type { BookingState, PriceBreakdown } from '@/lib/types'

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-2 border-b border-[var(--color-border)] last:border-0 ${bold ? 'font-bold text-[var(--color-ink)]' : 'text-[var(--color-ink-secondary)]'}`}>
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  )
}

interface Props { state: BookingState; breakdown: PriceBreakdown; onEdit: (step: number) => void }

export function BookingSummary({ state, breakdown, onEdit }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-card)] border border-[var(--color-border)] divide-y divide-[var(--color-border)]">

        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[var(--color-ink)]">{state.packageName}</p>
              <p className="text-sm text-[var(--color-ink-secondary)]">
                {state.startDate} {state.endDate !== state.startDate ? `→ ${state.endDate}` : ''} · {state.guests} gäster
              </p>
            </div>
            <button onClick={() => onEdit(1)} className="text-xs text-[var(--color-brand)] hover:underline">Ändra</button>
          </div>
        </div>

        {state.selectedAddOns.length > 0 && (
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-sm text-[var(--color-ink)]">Tillval</p>
              <button onClick={() => onEdit(2)} className="text-xs text-[var(--color-brand)] hover:underline">Ändra</button>
            </div>
            {state.selectedAddOns.map(a => (
              <div key={a.addOnId} className="flex justify-between text-sm text-[var(--color-ink-secondary)] py-1">
                <span>{a.name} {a.quantity > 1 ? `×${a.quantity}` : ''}</span>
                <span>{formatSEK(a.priceInCents * a.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-sm text-[var(--color-ink)]">Kontaktuppgifter</p>
            <button onClick={() => onEdit(3)} className="text-xs text-[var(--color-brand)] hover:underline">Ändra</button>
          </div>
          <p className="text-sm text-[var(--color-ink-secondary)]">{state.name} · {state.phone} · {state.email}</p>
        </div>
      </div>

      <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-card)] border border-[var(--color-border)] p-4 space-y-0">
        <Row label="Paket" value={formatSEK(breakdown.baseInCents)} />
        {breakdown.addOnsInCents > 0 && <Row label="Tillval" value={formatSEK(breakdown.addOnsInCents)} />}
        {breakdown.deliveryInCents > 0 && <Row label="Leverans" value={formatSEK(breakdown.deliveryInCents)} />}
        <Row label="Moms (25%)" value={formatSEK(breakdown.vatInCents)} />
        <Row label="Totalt" value={formatSEK(breakdown.totalInCents)} bold />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write StepSummary.tsx**

```tsx
// components/booking/StepSummary.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingSummary } from './BookingSummary'
import { Button } from '@/components/ui/Button'
import { useBookingState } from '@/hooks/useBookingState'
import { calculatePrice } from '@/lib/price'
import type { Package } from '@/lib/types'

export function StepSummary({ pkg }: { pkg: Package }) {
  const { state, setStep, reset } = useBookingState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()
  const breakdown = calculatePrice(state)

  const handleSubmit = async () => {
    if (!agreed) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      if (!res.ok) throw new Error('Order failed')
      const confirmation = await res.json()
      reset()
      router.push(`/bekraftelse?orderId=${confirmation.orderId}&orderNumber=${confirmation.orderNumber}&email=${encodeURIComponent(state.email)}`)
    } catch {
      setError('Något gick fel. Försök igen eller ring oss på 08-509 245 01.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Din bokning</h2>
      <BookingSummary state={state} breakdown={breakdown} onEdit={setStep} />

      <label className="flex gap-3 items-start cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={e => setAgreed(e.target.checked)}
          className="mt-1 accent-[var(--color-brand)]"
        />
        <span className="text-sm text-[var(--color-ink-secondary)]">
          Jag godkänner{' '}
          <a href="https://glasspojkarna.se/villkor" target="_blank" rel="noopener" className="text-[var(--color-brand)] underline">
            bokningsvillkoren
          </a>
        </span>
      </label>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(3)}>← Tillbaka</Button>
        <Button onClick={handleSubmit} disabled={!agreed || loading} className="flex-1 sm:flex-none">
          {loading ? 'Skickar…' : 'Skicka bokning'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Navigate to `/paket/glass-l/boka`. Complete all 4 steps. Step 3 should show contact form. Step 4 shows receipt layout with edit links. Submitting should call `/api/orders`.

- [ ] **Step 6: Commit**

```bash
git add components/booking/StepContact.tsx components/booking/ContactForm.tsx \
  components/booking/StepSummary.tsx components/booking/BookingSummary.tsx
git commit -m "feat: booking flow steps 3 and 4 — contact info, summary, submission"
```

---

## Task 13: Confirmation & Quote Pages

**Files:**
- Create: `components/confirmation/ConfirmationScreen.tsx`
- Create: `components/quote/QuoteForm.tsx`
- Create: `app/bekraftelse/page.tsx`
- Create: `app/offert/page.tsx`

**Interfaces:**
- Consumes: URL params `orderId`, `orderNumber`, `email` on confirmation page

- [ ] **Step 1: Write ConfirmationScreen.tsx**

```tsx
// components/confirmation/ConfirmationScreen.tsx
'use client'
import { useReducedMotion, motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Props { orderNumber: string; email: string }

export function ConfirmationScreen({ orderNumber, email }: Props) {
  const reduce = useReducedMotion()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div
          className="mx-auto w-20 h-20 rounded-full bg-[var(--color-success)] flex items-center justify-center text-white text-4xl"
          initial={reduce ? { opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
          aria-hidden
        >
          ✓
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-[var(--color-ink)] mb-2">Tack för din bokning!</h1>
          <p className="text-[var(--color-ink-secondary)]">
            Vi återkommer till <strong>{email}</strong> inom 2 timmar.
          </p>
          <p className="text-sm text-[var(--color-ink-tertiary)] mt-2">Bokningsnummer: {orderNumber}</p>
        </motion.div>

        <div className="bg-[var(--color-surface-raised)] rounded-[var(--radius-card)] border border-[var(--color-border)] p-4 text-sm text-[var(--color-ink-secondary)] text-left space-y-2">
          <p className="font-semibold text-[var(--color-ink)]">Vad händer nu?</p>
          <p>1. Vi bekräftar din bokning via e-post</p>
          <p>2. Du får en faktura från oss</p>
          <p>3. Vi levererar utrustningen på avtalad tid</p>
        </div>

        <p className="text-sm text-[var(--color-ink-secondary)]">
          Frågor? Ring oss på{' '}
          <a href="tel:+46850924501" className="text-[var(--color-brand)] font-semibold">08-509 245 01</a>
        </p>

        <Button variant="secondary" asChild>
          <Link href="https://glasspojkarna.se">Tillbaka till Glasspojkarna</Link>
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write app/bekraftelse/page.tsx**

```tsx
// app/bekraftelse/page.tsx
import { ConfirmationScreen } from '@/components/confirmation/ConfirmationScreen'

export default function ConfirmationPage({ searchParams }: { searchParams: { orderNumber?: string; email?: string } }) {
  return (
    <ConfirmationScreen
      orderNumber={searchParams.orderNumber ?? '—'}
      email={searchParams.email ?? ''}
    />
  )
}
```

- [ ] **Step 3: Write QuoteForm.tsx**

```tsx
// components/quote/QuoteForm.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const inputClass = 'px-4 py-3 rounded-[var(--radius-input)] border border-[var(--color-border)] focus:border-[var(--color-brand)] focus:outline-none text-[var(--color-ink)] w-full transition-colors'

export function QuoteForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY, ...data }),
    })
    setSent(true)
  }

  if (sent) return (
    <div className="text-center py-16">
      <p className="text-2xl font-bold text-[var(--color-ink)] mb-2">Tack!</p>
      <p className="text-[var(--color-ink-secondary)]">Vi återkommer till dig inom 2 timmar.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Begär offert</h1>
      <input name="name" required className={inputClass} placeholder="Namn *" />
      <input name="phone" type="tel" required className={inputClass} placeholder="Telefon *" />
      <input name="email" type="email" required className={inputClass} placeholder="E-post *" />
      <input name="date" type="date" required className={inputClass} />
      <textarea name="message" rows={4} className={inputClass} placeholder="Berätta om ditt event — antal gäster, önskemål, frågor…" />
      <Button type="submit" size="lg" className="w-full">Skicka förfrågan</Button>
      <p className="text-xs text-[var(--color-ink-tertiary)] text-center">
        Vi svarar inom 2 timmar på vardagar.
      </p>
    </form>
  )
}
```

Note: add `NEXT_PUBLIC_WEB3FORMS_KEY` to `.env.local` with a Web3Forms access key (free tier at web3forms.com), or replace with a custom email API Route Handler.

- [ ] **Step 4: Write app/offert/page.tsx**

```tsx
// app/offert/page.tsx
import { QuoteForm } from '@/components/quote/QuoteForm'
export default function QuotePage() { return <QuoteForm /> }
```

- [ ] **Step 5: Verify in browser**

Submit a test booking in the flow — should redirect to `/bekraftelse` with order number and email in URL. Confirmation screen should animate in. Navigate to `/offert` — quote form should appear.

- [ ] **Step 6: Commit**

```bash
git add components/confirmation/ components/quote/ app/bekraftelse/ app/offert/
git commit -m "feat: confirmation screen and quote form"
```

---

## Task 14: SEO, Metadata & Performance

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/paket/[slug]/page.tsx`
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Add per-page metadata to package detail**

In `app/paket/[slug]/page.tsx`, add:

```ts
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const pkg = await getPackage(params.slug).catch(() => null)
  if (!pkg) return {}
  return {
    title: `${pkg.name} – Glasspojkarna`,
    description: pkg.description,
    openGraph: {
      title: `${pkg.name} – Glasspojkarna`,
      description: pkg.description,
      images: [{ url: pkg.imageUrl }],
    },
  }
}
```

- [ ] **Step 2: Add sitemap**

```ts
// app/sitemap.ts
import { getPackages } from '@/lib/booqable/products'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const packages = await getPackages()
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://boka.glasspojkarna.se'
  return [
    { url: base, lastModified: new Date() },
    ...packages.map(p => ({ url: `${base}/paket/${p.slug}`, lastModified: new Date() })),
  ]
}
```

- [ ] **Step 3: Add robots.txt**

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://boka.glasspojkarna.se/sitemap.xml',
  }
}
```

- [ ] **Step 4: Verify Lighthouse score**

```bash
pnpm build && pnpm start
```
Run Lighthouse in Chrome DevTools on http://localhost:3000. Target: Performance ≥ 90, Accessibility ≥ 90, SEO ≥ 90.

Fix any issues surfaced.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: sitemap, robots.txt, per-page metadata"
```

---

## Task 15: Deploy to Vercel

- [ ] **Step 1: Push repo to GitHub**

```bash
git remote add origin https://github.com/glasspojkarna/boka.glasspojkarna.se.git
git push -u origin main
```

- [ ] **Step 2: Import project on Vercel**

Go to vercel.com → New Project → import the GitHub repo.

- [ ] **Step 3: Set environment variables in Vercel**

In Vercel Project Settings → Environment Variables, add:
- `BOOQABLE_API_KEY` — from Booqable Settings → API
- `BOOQABLE_SUBDOMAIN` — your Booqable subdomain
- `NEXT_PUBLIC_SITE_URL` — `https://boka.glasspojkarna.se`
- `NEXT_PUBLIC_WEB3FORMS_KEY` — from web3forms.com

- [ ] **Step 4: Add custom domain**

In Vercel Project Settings → Domains, add `boka.glasspojkarna.se`. In your DNS provider (where glasspojkarna.se is managed), add a CNAME record: `boka` → `cname.vercel-dns.com`.

- [ ] **Step 5: Verify live site**

Open https://boka.glasspojkarna.se. Complete a full test booking end-to-end. Check that the order appears in your Booqable dashboard.

- [ ] **Step 6: Final commit**

```bash
git commit --allow-empty -m "deploy: boka.glasspojkarna.se live on Vercel"
```

---

## Task 16: Existing Site — Add CTA Button

This task is a WordPress edit on `glasspojkarna.se/partypaket`.

- [ ] **Step 1: Log into WordPress admin**

Go to `glasspojkarna.se/wp-admin` → Pages → find the Partypaket page → Edit.

- [ ] **Step 2: Add a hero block at the top of the page**

In the Gutenberg editor, add a Cover block or Group block at the very top (above existing content) with:
- Background: brand red (match existing site color)
- Heading: `Boka ditt partypaket online`
- Paragraph: `Välj paket, välj datum och boka direkt — på under 2 minuter.`
- Button block: label `Boka nu →`, URL `https://boka.glasspojkarna.se`, style: filled white

- [ ] **Step 3: Publish and verify**

Visit https://glasspojkarna.se/partypaket. The CTA block should appear prominently at the top. Clicking "Boka nu →" should navigate to boka.glasspojkarna.se.

---

## Self-Review

**Spec coverage check:**
- ✓ Landing page with hero + package grid
- ✓ Package cards with image, name, price, inclusions, guest count
- ✓ Category filter
- ✓ Package detail with inclusions, FAQ, gallery hook, sticky button
- ✓ 4-step booking flow (date, extras, contact, summary)
- ✓ Live price updates (PriceCounter, calculatePrice)
- ✓ Availability indicator (DatePicker + /api/availability)
- ✓ Confirmation page with animation
- ✓ Quote form fallback
- ✓ Booqable API integration (products, availability, orders)
- ✓ Fortnox sync (via Booqable native integration — configured in Booqable, no custom code)
- ✓ Mobile-first responsive layout
- ✓ Swedish language throughout
- ✓ SEO: metadata, sitemap, robots.txt
- ✓ WCAG: aria labels, keyboard navigation, reduced motion
- ✓ Vercel deployment
- ✓ Existing site CTA button

**Gap:** `GalleryGrid` component is referenced in the spec but not implemented above. Add it in Task 10 between InclusionList and FAQAccordion:

```tsx
// components/detail/GalleryGrid.tsx
import Image from 'next/image'

export function GalleryGrid({ images }: { images: string[] }) {
  if (!images.length) return null
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Galleri</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <div key={i} className="relative aspect-square rounded-[var(--radius-card)] overflow-hidden">
            <Image src={src} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
          </div>
        ))}
      </div>
    </section>
  )
}
```

And in `app/paket/[slug]/page.tsx`, render `<GalleryGrid images={pkg.gallery} />` after `<InclusionList>`.

**ReviewCard** is also referenced but not implemented — low priority since reviews would be hard-coded initially. Add a static `ReviewCard` in a future iteration once the business has collected bookings from this flow.

**Type consistency:** `BookingState`, `Package`, `AddOn`, `SelectedAddOn`, `PriceBreakdown`, `BookingConfirmation` are all defined in Task 3 and used consistently throughout. `formatSEK` is defined in Task 4 and imported wherever prices are displayed.
