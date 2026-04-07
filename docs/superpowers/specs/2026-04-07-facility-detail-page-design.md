# Facility Detail Page — Design Spec

**Date:** 2026-04-07
**Project:** seedco.sa (SEED Innovation landing page)
**Status:** Approved

---

## Overview

When a user clicks the "Book via Web" (حجز عبر الموقع) button on a facility card at `/courts`, they are navigated to a dedicated facility detail page instead of opening a modal. The booking modal is reserved exclusively for the payment flow, triggered from the detail page.

---

## Routing

- **Route:** `/[locale]/courts/[facilityId]`
  e.g. `/ar/courts/12`, `/en/courts/12`
- **File:** `app/[locale]/courts/[facilityId]/page.tsx`
- The `facilityId` is the numeric `id` from the top-level facility object in the `/facilities` API response (not a court id).
- The `CourtCard` component must receive a new `facilityId: number` prop. The "Book via Web" button is restructured from `<button onClick={...}><Link href="/courts">…</Link></button>` to simply `<Link href={`/courts/${facilityId}`}>` styled to match the existing button appearance. The locale prefix is injected automatically by next-intl's `Link` from `@/i18n/routing`.
- A back `<Link href="/courts">` on the detail page returns to `/courts`. We do not reuse `BackButton` (`components/ui/BackButton.tsx`) because that component calls `router.back()` (history back), whereas we need guaranteed navigation to `/courts`.
- If `facilityId` does not match a known facility, call Next.js `notFound()` to render a 404.

---

## Page Layout (Option A — Side-by-side)

### Hero Section (full width)
- Facility photo as background image with a dark gradient overlay (`linear-gradient(to bottom, transparent, #1e293b)`)
- Bottom-left: locale-aware facility name (`nameAr` when locale is `ar`, `name` when locale is `en`) + city/district
- Top-right: sport category pill — purple background
- Top-left: back `<Link href="/courts">` styled as a back button

### Body (two-column, below hero)

**Left Column — Booking Sidebar (sticky on scroll)**

`FacilityBookingSidebar` is a server component. In Next.js App Router, a server component may import and render a `"use client"` component — the client component boundary starts at the client component itself. `FacilityBookingSidebar` imports `BookNowButton` directly and renders it as part of its JSX.

- Lowest hourly fee price (bold, purple)
- "Starting from" label if courts have varied prices
- Operating hours (open/close time)
- Phone number (click-to-call `tel:` link)
- `<BookNowButton>` — client component holding modal state
- Map: render a Google Maps link (`https://maps.google.com/?q={location}`) as a fallback. If the API returns a dedicated map URL field, use that instead. Do not use an iframe embed for the initial implementation.

**Right Column — Facility Details**

`FacilityDetails` is a server component.

- "About" section: facility description paragraph
- Amenities grid: icons + labels — sourced from API `amenities` array. Map each string value to an emoji/icon using a lookup table:
  ```ts
  const AMENITY_ICONS: Record<string, string> = {
    parking: '🅿️',
    wifi: '📶',
    prayer_room: '🕌',
    changing_rooms: '👗',
  }
  ```
  If the API returns objects instead of strings (shape unverified), adapt by reading the relevant key from each object. Render the amenities section only if the array is present and non-empty; unknown keys display without an icon.
- Courts list: card list showing each court (name, sportType, hourlyFee)
- Photo gallery: grid of additional facility images if available from API

---

## Data Fetching

- **Type:** Server Component (no `"use client"`)
- Page params arrive as `Promise<{ facilityId: string }>` in Next.js 15+. The page must `await params` and parse `facilityId` as an integer:
  ```ts
  const { facilityId } = await params
  const id = parseInt(facilityId, 10)
  if (isNaN(id)) notFound()
  ```
- **Endpoint:** `GET ${process.env.NEXT_PUBLIC_API_URL}/facilities/${id}`
  Resolves to: `https://api.seedco.sa/api/landing_page/facilities/{id}`
- Fetch with `cache: 'no-store'` to always serve fresh data (facility prices and hours change frequently):
  ```ts
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/facilities/${id}`, { cache: 'no-store' })
  if (!res.ok) notFound()
  const facility = await res.json()
  ```
- On non-200 response or missing data: call `notFound()`

### next-intl in Server Components

All server components that need the current locale or translations must use the server-side API from `next-intl/server`:
- **Locale:** `const locale = await getLocale()` — imported from `next-intl/server`
- **Translations:** `const t = await getTranslations('FacilityPage')` — imported from `next-intl/server`

Do **not** use `useLocale()` or `useTranslations()` in server components — those are client-only hooks.

### API Response Shape (relevant fields)
```ts
{
  id: number
  nameAr: string            // facility name in Arabic — used when locale === 'ar'
  name: string              // facility name in English — used when locale === 'en'
  description?: string
  location: string          // district/city
  address?: string          // full street address (separate from location)
  city?: string
  phone?: string
  imageUrl?: string         // primary facility image URL
  openTime?: string         // e.g. "16:00"
  closeTime?: string        // e.g. "00:00"
  images?: string[]         // additional image URLs for gallery
  amenities?: string[]      // e.g. ["parking", "wifi"] — shape unverified; render defensively
  averageRating?: number
  courts: Array<{
    id: number
    name: string
    sportType: string       // e.g. "TENNIS"
    hourlyFee: number
  }>
}
```

The existing `courts/page.tsx` reads `facility.nameAr` for Arabic locale and `facility.name` for English locale. All new components must follow the same pattern:
```ts
const facilityName = locale === 'ar' ? facility.nameAr : facility.name
```

---

## Component Structure

```
app/[locale]/courts/[facilityId]/
  page.tsx                  — server component: awaits params, fetches facility, renders layout

components/
  FacilityHero.tsx          — server component: hero image, locale-aware name, back link, category pill
  FacilityBookingSidebar.tsx — server component: price, hours, phone, map link; imports and renders BookNowButton
  BookNowButton.tsx         — "use client": holds isOpen state, renders "Book Now" button + BookingModal
  FacilityDetails.tsx       — server component: about, amenities, courts list, gallery
  courts/
    BookingModal.tsx        — existing, unchanged (payment flow only)
```

### `FacilityBookingSidebar` Props Interface

```ts
interface FacilityBookingSidebarProps {
  facilityId: number
  facilityName: string       // locale-aware name (already resolved by the page server component)
  location: string
  lowestPricedCourt: {
    id: number
    name: string
    hourlyFee: number
  }
  openTime?: string
  closeTime?: string
  phone?: string
  mapQuery: string           // e.g. facility.location or facility.address, used to build Google Maps URL
}
```

`FacilityBookingSidebar` passes `facilityId`, `facilityName`, `location`, and `lowestPricedCourt` down to `BookNowButton`.

The lowest-priced court is computed on the page level:
```ts
const sortedCourts = [...facility.courts].sort((a, b) => a.hourlyFee - b.hourlyFee)
const lowestPricedCourt = sortedCourts[0]
```

### `BookNowButton` Props Interface

```ts
interface BookNowButtonProps {
  facilityId: number         // → BookingModal facilityId
  facilityName: string       // → BookingModal facilityName
  location: string           // → BookingModal location
  lowestPricedCourt: {
    id: number               // → BookingModal courtId
    name: string             // → BookingModal courtName
    hourlyFee: number        // → BookingModal price
  }
}
```

`BookNowButton` passes these through to `BookingModal` as:
```tsx
<BookingModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  facilityId={facilityId}
  facilityName={facilityName}
  location={location}
  courtId={lowestPricedCourt.id}
  courtName={lowestPricedCourt.name}   // lowestPricedCourt.name → courtName
  price={lowestPricedCourt.hourlyFee}
/>
```

---

## CourtCard Changes

All existing `CourtCardProps` are preserved (`id`, `name`, `location`, `price`, `startingFrom`, `image`, `rating`, `category`, `facilityName`). The `id` prop is kept for future use but no longer passed to `BookingModal`. The following changes are made:

- Add `facilityId: number` to the `CourtCardProps` interface
- Remove `BookingModal` import and all its usage entirely from `CourtCard`
- Remove `useState` for `isModalOpen` (no longer needed)
- Replace the `<button onClick={...}><Link href="/courts">…</Link></button>` structure with a plain `<Link href={`/courts/${facilityId}`}>` styled to match the existing button appearance (same `className` as the old button)

The caller (`app/[locale]/courts/page.tsx`) must:
- Add `facilityId={facility.id}` to each `CourtCard`
- Keep the existing `id={facility.courts[0]?.id || facility.id}` prop unchanged (retained for potential future use, no longer used for booking in this component)

---

## i18n

Add translation keys to `messages/ar.json` under a new `FacilityPage` namespace:

```json
{
  "FacilityPage": {
    "back": "العودة",
    "bookNow": "احجز الآن",
    "about": "عن الملعب",
    "amenities": "المرافق والخدمات",
    "courts": "الملاعب",
    "gallery": "الصور",
    "hours": "ساعات العمل",
    "startingFrom": "يبدأ من",
    "currency": "ر.س",
    "callFacility": "اتصل بالملعب"
  }
}
```

Add matching keys to `messages/en.json`:

```json
{
  "FacilityPage": {
    "back": "Back",
    "bookNow": "Book Now",
    "about": "About",
    "amenities": "Facilities & Amenities",
    "courts": "Courts",
    "gallery": "Gallery",
    "hours": "Opening Hours",
    "startingFrom": "Starting from",
    "currency": "SAR",
    "callFacility": "Call Facility"
  }
}
```

---

## Error Handling

- Invalid or missing `facilityId` in route params → `notFound()`
- API fetch fails or returns non-200 → `notFound()`
- Missing optional fields (`phone`, `description`, `images`, `amenities`, `nameEn`) → graceful fallback: hide the section or show a placeholder; never crash

---

## Out of Scope

- Court-level booking calendar (not in this spec)
- User authentication / login
- Reviews or ratings on the detail page
- Admin editing of facility data
