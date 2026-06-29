# Glasspojkarna — boka.glasspojkarna.se Design Spec

**Date:** 2026-06-29  
**Project:** Party Package Booking Experience  
**URL:** boka.glasspojkarna.se  
**Status:** Approved — ready for implementation planning

---

## 1. Project Overview

A premium, standalone booking experience for Glasspojkarna's party packages hosted at `boka.glasspojkarna.se`. The existing site at `glasspojkarna.se/partypaket` receives a single prominent CTA button linking to the new subdomain. The new site is built with Next.js, uses Booqable as the booking/inventory backend, and syncs orders to Fortnox for invoicing.

### Primary Goal
A customer should be able to book a party package in under two minutes. The experience must feel premium, modern, and effortless — consistent with Glasspojkarna's existing brand but elevated to Apple/Airbnb execution quality.

### Pricing Model
Hybrid: standard packages show transparent pricing and book directly online. Large or custom orders route to a quote request form.

---

## 2. Information Architecture

### Site Structure

```
boka.glasspojkarna.se/
├── /                        ← Landing page (hero + package grid)
├── /paket/[slug]            ← Package detail page
│   └── /boka               ← 4-step booking flow
├── /bekraftelse             ← Booking confirmation
└── /offert                 ← Quote request form (large/custom orders)
```

### Page Roles

| Page | Purpose |
|------|---------|
| Landing | Hook, orient, convert — all packages immediately visible |
| Package Detail | Sell the package — images, inclusions, add-ons, reviews, FAQ |
| Booking Flow | Capture the order — date, extras, contact info, summary |
| Confirmation | Reassure — booking received, what happens next |
| Quote Form | Fallback for large parties and custom requests |

### Navigation

Minimal sticky top bar. Desktop: Glasspojkarna logo (links to main site) + phone number "08-509 245 01". Mobile: logo left, phone icon right. No hamburger menus. Background blurs on scroll.

---

## 3. User Journey

### Primary Journey (Standard Package, Mobile)

```
glasspojkarna.se/partypaket
        ↓  taps "Boka ditt paket →"
boka.glasspojkarna.se
        ↓  hero CTA "Se alla paket"
Package grid — scans 4 categories
        ↓  taps package card
Package detail page
        ↓  reads inclusions, gallery, FAQ
        ↓  taps sticky "Boka nu" button
STEP 1 — Date & guests
        ↓
STEP 2 — Extras (live price updates)
        ↓
STEP 3 — Contact information
        ↓
STEP 4 — Summary + confirm
        ↓
Confirmation page
        ↓
Automatic email confirmation (via Booqable)
```

### Secondary Journey (Quote Request)

User selects a large-capacity tier or edge-case configuration → system routes to `/offert` with a short form (name, phone, date, message) → staff responds within 2 hours.

### Drop-off Recovery

If a user abandons mid-booking, a persistent bottom sheet on mobile shows:  
**"Du håller på att boka [Package Name] — fortsätt →"**  
State stored in `sessionStorage`. No login required.

---

## 4. Packages

### Package Catalogue

| Category | Tier | Guests | Slug |
|----------|------|--------|------|
| Glassmaskinen | S | upp till 50 | glass-s |
| Glassmaskinen | L (Populärt) | upp till 100 | glass-l |
| Glassmaskinen | XL | upp till 150 | glass-xl |
| Popcornmaskinen | S | upp till 50 | popcorn-s |
| Popcornmaskinen | L (Populärt) | upp till 100 | popcorn-l |
| Popcornmaskinen | XL | upp till 150 | popcorn-xl |
| Slushmaskin | S | upp till 30 | slush-s |
| Slushmaskin | L (Populärt) | upp till 60 | slush-l |
| Slushmaskin | XL | upp till 120 | slush-xl |
| Sockervaddsmaskin | S | upp till 50 | sockervadds-s |
| Sockervaddsmaskin | L (Populärt) | upp till 100 | sockervadds-l |
| Sockervaddsmaskin | XL | upp till 200 | sockervadds-xl |

### Inclusions Per Category

**Glassmaskinen:** Machine (S or L), mix (3L / 7L / 10L), cups and spoons (50 / 100 / 150)  
**Popcornmaskinen:** Machine on cart, portion bags (8 / 15 / 22), cones (50 / 100 / 150)  
**Slushmaskin:** 1/2/3-container machine, mix (1L / 2L / 3L), cups (30 / 60 / 120)  
**Sockervaddsmaskin:** Machine, coloured sugar (1kg / 2kg / 4kg), cones (50 / 100 / 200)

### Add-ons (Available on All Packages)

| Add-on | Type |
|--------|------|
| Extra portioner | Quantity stepper |
| Extra koner / koppar | Quantity stepper |
| Extra mix | Quantity stepper |
| Godis | Toggle |
| Leverans Stockholm | Toggle (fixed 1 500 kr) |
| Upphämtning Sollentuna | Toggle (free) |
| Personal | Toggle |
| Städning | Toggle |

**Combo discount:** 10% off entire order when 2+ machines are booked simultaneously. Applied via Booqable coupon or discount rule — verify exact mechanism during Booqable setup phase.

---

## 5. Booking Flow Detail

### Step 1 — Datum & Gäster
- Custom calendar with Booqable availability overlay (unavailable dates greyed out, line-through)
- Return date field (appears if rental > 1 day)
- Guest counter (+/− stepper, validates against package capacity, warns if over)
- Availability indicator: green "Tillgänglig" / amber "Begränsad" / red "Ej tillgänglig"

### Step 2 — Tillval (Extras)
- Toggle cards for each add-on, quantity steppers where applicable
- PriceCounter updates instantly on every change (client-side calculation)
- Delivery vs. pickup toggle is prominent and mutually exclusive

### Step 3 — Dina uppgifter (Contact Info)
- Private / Business toggle (animates in VAT number field for Business)
- Fields: Name, Phone, Email, Address, Event location, Additional info
- Inline validation — errors appear on blur, not on submit
- No progress lost if user navigates back

### Step 4 — Sammanfattning (Summary)
- Receipt-style breakdown: package, date, each extra, delivery, moms (25%), total
- "Ändra" (edit) links back to relevant step without resetting later steps
- Primary action: "Skicka bokning" — submits to Booqable API
- Legal: checkbox for terms acceptance, link to full terms

### Confirmation
- Animated checkmark (SVG stroke + spring bounce)
- "Tack! Vi återkommer inom 2 timmar."
- Booking reference number
- Staff phone number for urgent questions
- Link back to main site

---

## 6. Component System

| Component | Description |
|-----------|-------------|
| `HeroSection` | Full-viewport hero, lifestyle photo background, headline, subheadline, CTA |
| `PackageCard` | Image, category badge, name, description, guest count, price, two CTAs |
| `PackageGrid` | 1 col mobile / 2 col tablet / 4 col desktop |
| `CategoryFilter` | Horizontal scroll pill-tabs — All / Glass / Popcorn / Slush / Sockervadds |
| `PackageHero` | Detail page full-width hero with floating summary card |
| `InclusionList` | Icon + label list of inclusions |
| `AddOnSelector` | Toggle cards with quantity steppers, live price update |
| `PriceCounter` | Sticky animated total — slot-machine digit animation on change |
| `BookingProgress` | 4-step minimal dot/number indicator |
| `DatePicker` | Custom calendar + Booqable availability, sheet on mobile / inline on desktop |
| `GuestCounter` | Large +/− stepper with capacity validation |
| `ContactForm` | Private/Business toggle, floating labels, inline validation |
| `BookingSummary` | Receipt layout with edit links |
| `ConfirmationScreen` | Celebration moment — checkmark animation, next steps |
| `QuoteForm` | Minimal fallback for large/custom orders |
| `StickyBookButton` | Mobile-only fixed bottom button, shows live price, slides up after hero |
| `GalleryGrid` | Masonry photo grid on detail page |
| `ReviewCard` | Star rating, quote, name |
| `FAQAccordion` | Smooth expand/collapse, one open at a time |
| `NavBar` | Logo + phone, sticky, backdrop blur on scroll |

---

## 7. Visual Design System

### Color Palette

| Token | Role | Value |
|-------|------|-------|
| `--color-brand` | Primary red — CTAs, badges, accents | Matched from existing site |
| `--color-brand-light` | Tinted backgrounds, hover states | Brand red at 8% opacity |
| `--color-cream` | Warm off-white — cards, hero overlays | `#FDFAF6` |
| `--color-ink` | Primary text | `#0F0D0C` |
| `--color-ink-secondary` | Supporting text | `#6B6560` |
| `--color-ink-tertiary` | Placeholder, disabled | `#B8B3AE` |
| `--color-surface` | Page background | `#FFFFFF` |
| `--color-surface-raised` | Cards, modals | `#FDFAF6` |
| `--color-border` | Subtle dividers | `#EBEBEA` |
| `--color-success` | Availability, confirmation | `#1A9E6B` |
| `--color-warning` | Limited availability | `#D97706` |

### Typography

Base typeface: match existing Glasspojkarna site. Fallback: Inter.

| Role | Mobile | Desktop | Weight |
|------|--------|---------|--------|
| Hero headline | 40px | 72px | 700 |
| Section headline | 28px | 44px | 700 |
| Card title | 20px | 24px | 600 |
| Body | 16px | 18px | 400 |
| Label / badge | 12px | 13px | 600, uppercase |
| Price | 24px | 32px | 700, tabular nums |

### Spacing System

Base unit: 8px. All spacing is a multiple: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`

Card padding: 24px. Section vertical rhythm: 96px desktop, 64px mobile.

### Border Radius

| Element | Radius |
|---------|--------|
| Package cards | 20px |
| Buttons | 12px |
| Input fields | 12px |
| Badges / pills | 999px |
| Modal / bottom sheet | 24px top corners |
| Images in cards | 16px |

### Shadows

Warm-tinted, never cold grey.

| Level | Value |
|-------|-------|
| Card resting | `0 2px 12px rgba(15,13,12,0.06)` |
| Card hover | `0 8px 32px rgba(15,13,12,0.12)` |
| Sticky bar | `0 -4px 24px rgba(15,13,12,0.08)` |
| Modal | `0 24px 64px rgba(15,13,12,0.18)` |

---

## 8. Interaction & Animation Guidelines

### Motion Tokens

| Token | Duration | Easing |
|-------|----------|--------|
| `--duration-fast` | 120ms | ease-out |
| `--duration-base` | 220ms | ease-in-out |
| `--duration-slow` | 380ms | cubic-bezier(0.16,1,0.3,1) |
| `--duration-celebration` | 600ms | spring |

All animations respect `prefers-reduced-motion` — instant fallback.

### Key Interactions

**Package card hover (desktop):** lifts `translateY(-4px)`, shadow deepens, "Boka nu" slides up from bottom edge. `--duration-base`.

**Category filter:** active pill slides brand-color indicator underneath (spring). Content cross-fades. `--duration-base`.

**Add-on toggle:** border flashes brand color, checkmark animates in, PriceCounter rolls. `--duration-fast`.

**PriceCounter update:** digits tick like a slot machine — single digit at a time.

**Date picker:** slides in from below on mobile (sheet), inline on desktop. Unavailable dates fade + line-through. Selected date pulses brand color.

**Booking step transition:** current step slides left, next slides in from right. Progress dots animate. `--duration-slow`.

**StickyBookButton:** hidden on load, slides up after hero scroll. Pulses on price change.

**Confirmation:** SVG circle draws itself, checkmark bounces in (spring), headline fades below. `--duration-celebration`.

**Form field focus:** label floats up, border transitions to brand color. No reflow.

**Error state:** field shakes horizontally (3 oscillations, 8px), border red, message fades in. `--duration-fast`.

---

## 9. Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| Deployment | Vercel |
| Booking backend | Booqable REST API |
| Accounting | Fortnox (via Booqable native integration) |
| Email | Booqable automated transactional emails |
| Analytics | Vercel Analytics + Google Analytics 4 |

### Data Flow

```
User selects package + date
        ↓
Frontend → Booqable API (check availability)
        ↓
User configures extras → price calculated client-side
        ↓
User submits → Frontend → POST /orders to Booqable API
        ↓
Booqable creates order + sends confirmation email
        ↓
Booqable → Fortnox sync → invoice created
        ↓
Staff reviews in Booqable dashboard
```

### Booqable Pre-requisites (Before Frontend Build)

1. Create all 12 packages as Booqable products with correct pricing
2. Create all add-on products
3. Configure rental periods (daily)
4. Configure delivery zones (Stockholm fixed 1 500 kr, Sollentuna free pickup)
5. Configure Fortnox integration in Booqable settings
6. Configure confirmation email templates
7. Generate API key for frontend use

### Existing Site Change

One modification to `glasspojkarna.se/partypaket`: add a prominent hero section at the top with a large "Boka ditt paket →" button linking to `boka.glasspojkarna.se`. Existing page content remains below.

---

## 10. Non-functional Requirements

- **Mobile-first:** all components designed for mobile, enhanced for desktop
- **Performance:** Lighthouse score ≥ 90 on mobile. Images served via Next.js Image with lazy loading and WebP
- **Accessibility:** WCAG 2.1 AA. Keyboard navigable booking flow. Sufficient color contrast
- **SEO:** server-rendered pages, Swedish meta titles and descriptions, structured data for products
- **Language:** Swedish throughout
- **Security:** Booqable API key stored in environment variables, never exposed to client

---

## 11. Out of Scope

- Online payment / Stripe integration (staff invoices via Fortnox after booking)
- User accounts / login
- Booking management / cancellation self-service
- Multi-language support
- Staff-facing admin UI (Booqable dashboard handles this)
