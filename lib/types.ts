export type PackageCategory = 'glass' | 'popcorn' | 'slush' | 'sockervadds'
export type PackageTier = 'S' | 'L' | 'XL' | 'Deluxe'
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
  firstName: string
  lastName: string
  phone: string
  email: string
  address: string
  postalCode: string
  city: string
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
