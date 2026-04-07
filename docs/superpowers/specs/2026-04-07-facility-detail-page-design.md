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
- The `facilityId` is the numeric `id` from the `/facilities` API response.
- The `CourtCard` "Book via Web" button becomes a `<Link href="/courts/[facilityId]">` using next-intl's `Link` from `@/i18n/routing`.
- A back button (← العودة / ← Back) on the detail page navigates to `/courts`.
- If `facilityId` does not match a known facility, call Next.js `notFound()` to render a 404.

---

## Page Layout (Option A — Side-by-side)

### Hero Section (full width)
- Facility photo as background image with a dark gradient overlay (`linear-gradient(to bottom, transparent, #1e293b)`)
- Bottom-left: facility name + city/district
- Top-right: sport category pill (e.g. "TENNIS") — purple background
- Top-left: back button (← العودة)

### Body (two-column, below hero)

**Left Column — Booking Sidebar (sticky on scroll)**
- Lowest hourly fee price (bold, purple)
- "Starting from" label if courts have varied prices
- Operating hours (open/close time)
- Phone number (click-to-call `tel:` link)
- "Book Now" / "احجز الآن" button — opens `BookingModal` with facility data pre-filled
- Google Maps link or embedded map iframe

**Right Column — Facility Details**
- "About" section: facility description paragraph
- Amenities grid: icons + labels (parking, WiFi, prayer room, changing rooms, etc.) — sourced from API `amenities` array
- Courts list: table or card list showing each court (name, type, hourly fee)
- Photo gallery: grid of additional facility images if available from API

---

## Data Fetching

- **Type:** Server Component (no `"use client"`)
- **Endpoint:** `GET ${NEXT_PUBLIC_API_URL}/facilities/${facilityId}`
- Fetch at request time (no static generation, since facility data may change)
- On non-200 response or missing data: call `notFound()`
- The `BookingModal` is the only client-side element — it is imported as a client component and triggered by a "Book Now" button click

### API Response Shape (relevant fields)
```ts
{
  id: number
  name: string              // facility name (Arabic)
  nameEn?: string           // facility name (English)
  description?: string
  location: string          // district/city
  phone?: string
  openTime?: string         // e.g. "16:00"
  closeTime?: string        // e.g. "00:00"
  images?: string[]         // array of image URLs
  amenities?: string[]      // e.g. ["parking", "wifi", "prayer_room"]
  courts: Array<{
    id: number
    name: string
    type: string            // e.g. "TENNIS"
    hourlyFee: number
  }>
}
```

---

## Component Structure

```
app/[locale]/courts/[facilityId]/
  page.tsx                  — server component, fetches facility data, renders layout

components/
  FacilityHero.tsx          — hero image with overlay, back button, category pill
  FacilityBookingSidebar.tsx — sticky sidebar: price, hours, phone, book button, map
  FacilityDetails.tsx       — about, amenities, courts list, gallery
  courts/
    BookingModal.tsx        — existing, unchanged (payment flow only)
```

---

## CourtCard Changes

- Remove `onClick={() => setIsModalOpen(true)}` from the "Book via Web" button
- Replace inner `<Link href="/courts">` with `<Link href={`/courts/${id}`}>`
- Remove `BookingModal` import and usage from `CourtCard` — the modal now lives on the detail page only
- The "Download App" button remains unchanged

---

## i18n

Add translation keys to `messages/ar.json` and `messages/en.json` under a new `FacilityPage` namespace:

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
    "currency": "SAR",
    "callFacility": "اتصل بالملعب"
  }
}
```

---

## Error Handling

- Missing facility ID → `notFound()`
- API fetch fails (network error) → `notFound()` or display a generic error state
- Missing optional fields (phone, description, images) → graceful fallback (hide the section or show placeholder)

---

## Out of Scope

- Court-level booking calendar (not in this spec)
- User authentication / login
- Reviews or ratings on the detail page
- Admin editing of facility data
