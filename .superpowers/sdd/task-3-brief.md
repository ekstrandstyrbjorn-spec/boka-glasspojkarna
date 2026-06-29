# Task 3: TypeScript Types

## Context
You are implementing Task 3 of boka.glasspojkarna.se — a premium Next.js booking site for Glasspojkarna's party packages. Tasks 1 and 2 are complete (project setup + design system).

## Your job
Create `lib/types.ts` with all shared TypeScript types used throughout the application. No tests needed for this task — just create the file and verify it compiles.

## File to create: `lib/types.ts`

```ts
export type PackageCategory = 'glass' | 'popcorn' | 'slush' | 'sockervadds'
export type PackageTier = 'S' | 'L' | 'XL'
export type CustomerType = 'private' | 'business'

export interface Inclusion {
  label: string
  quantity?: string
}

export interface AddOn {
  id: string
  name: string
  description?: string
  priceInCents: number
  type: 'toggle' | 'quantity'
  maxQuantity?: number
}

export interface Package {
  id: string
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

## Steps
1. Create the `lib/` directory if it doesn't exist
2. Write `lib/types.ts` with exactly the content above
3. Verify TypeScript compiles: `pnpm tsc --noEmit`
4. Fix any compilation errors
5. Commit: `git add lib/types.ts && git commit -m "feat: shared TypeScript types"`

## Report
Write your full report to: `C:/claude code/.superpowers/sdd/task-3-report.md`

Then reply with:
- Status: DONE / BLOCKED / NEEDS_CONTEXT
- Commits: (short SHA)
- Tests: "tsc --noEmit passed" or describe errors
- Concerns: (any, or "none")
