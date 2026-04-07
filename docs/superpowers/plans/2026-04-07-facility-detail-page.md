# Facility Detail Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/[locale]/courts/[facilityId]` detail page (Option A layout) so clicking "Book via Web" on a court card navigates to the facility detail page instead of opening a modal; the booking modal is kept only for the payment flow triggered from the detail page.

**Architecture:** New server-component page at `app/[locale]/courts/[facilityId]/page.tsx` fetches fresh facility data from the API and renders a hero + two-column layout (sticky booking sidebar + facility details). A small `"use client"` `BookNowButton` component holds the modal open/close state. `CourtCard` is simplified to a navigation link.

**Tech Stack:** Next.js 16 App Router, next-intl (server API: `getLocale`, `getTranslations`), Tailwind CSS v4, Lucide React, Framer Motion (existing BookingModal)

**Spec:** `docs/superpowers/specs/2026-04-07-facility-detail-page-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `messages/ar.json` | Add `FacilityPage` namespace (Arabic) |
| Modify | `messages/en.json` | Add `FacilityPage` namespace (English) |
| Modify | `components/CourtCard.tsx` | Add `facilityId` prop, replace button+modal with Link |
| Modify | `app/[locale]/courts/page.tsx` | Pass `facilityId={facility.id}` to CourtCard |
| Create | `components/BookNowButton.tsx` | "use client" wrapper: book button + BookingModal state |
| Create | `components/FacilityHero.tsx` | Hero image, back link, category pill, locale-aware name |
| Create | `components/FacilityBookingSidebar.tsx` | Sticky sidebar: price, hours, phone, map link |
| Create | `components/FacilityDetails.tsx` | About, amenities grid, courts list, photo gallery |
| Create | `app/[locale]/courts/[facilityId]/page.tsx` | Server page: fetch + layout composition |

---

## Chunk 1: i18n + CourtCard + Courts Page

### Task 1: Add FacilityPage i18n keys

**Files:**
- Modify: `messages/ar.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Add Arabic keys to `messages/ar.json`**

  Open `messages/ar.json`. Add at the **top level** (alongside `"CourtsPage"`, `"LandingPage"`, etc.):

  ```json
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
  ```

  Insert before the closing `}` of the root object. The file already has `"CourtsPage"` — add `"FacilityPage"` after it.

- [ ] **Step 2: Add English keys to `messages/en.json`**

  Open `messages/en.json`. Add the same namespace at the top level:

  ```json
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
  ```

- [ ] **Step 3: Verify JSON is valid**

  ```bash
  cd /Users/ammarbinmadi/Downloads/seed-landing-page
  node -e "JSON.parse(require('fs').readFileSync('messages/ar.json','utf8')); console.log('ar.json OK')"
  node -e "JSON.parse(require('fs').readFileSync('messages/en.json','utf8')); console.log('en.json OK')"
  ```

  Expected: `ar.json OK` and `en.json OK`

- [ ] **Step 4: Commit**

  ```bash
  git add messages/ar.json messages/en.json
  git commit -m "feat: add FacilityPage i18n namespace (ar + en)"
  ```

---

### Task 2: Simplify CourtCard — replace modal with navigation link

**Files:**
- Modify: `components/CourtCard.tsx`

The current file (`components/CourtCard.tsx`) uses a `<>` fragment to wrap the card `<div>` and `<BookingModal>` together. We will remove the modal, the fragment, and `useState`, and replace the "Book via Web" button with a `<Link>`.

- [ ] **Step 1: Replace the entire contents of `components/CourtCard.tsx` with the following**

  ```tsx
  "use client";

  import { useTranslations, useLocale } from 'next-intl';
  import { Star, MapPin, CircleDot } from 'lucide-react';
  import { Link } from '@/i18n/routing';

  interface CourtCardProps {
    id: number;
    facilityId: number;
    name: string;
    location: string;
    price: number;
    startingFrom?: boolean;
    image: string;
    rating: number;
    category: string;
    facilityName: string;
  }

  const CourtCard = ({ id, facilityId, name, location, price, startingFrom, image, rating, category, facilityName }: CourtCardProps) => {
    const t = useTranslations('CourtsPage.Discovery');
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
      <div className="rounded-[32px] p-4 shadow-sm border border-slate-50 hover:shadow-md transition-all group">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] mb-4">
          <img src={image} alt={name} className="h-100 object-cover group-hover:scale-105 transition-transform duration-500" />

          {/* Rating & Sport Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-white text-xs font-bold">
              <span className='mt-[2px]'>{rating}</span>
              <Star size={12} className="fill-yellow-400 stroke-yellow-400" />
            </div>
            <div className="px-3 py-1 rounded-full flex items-center gap-1.5 text-[#7C3AED] text-xs font-md bg-[#F3E8FF]">
              <CircleDot size={16} />
              <span className='mt-[2px]'>{category}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-lg text-[#7C3AED] me-3">{name}</h3>
            <div className="flex flex-col items-end">
              {startingFrom && (
                <span className="text-[10px] text-slate-400 font-medium">{t('startingFrom')}</span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="font-saudia font-bold text-[#7C3AED] text-xl">{price}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{t('currency')}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-400 mb-6">
            <MapPin size={14} />
            <span className="text-xs font-saudia font-medium">{location}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 font-bold">
            <button className="bg-[#1E293B] text-white py-3 rounded-2xl text-xs font-saudia font-medium hover:bg-[#0F172A] transition-colors hover:cursor-pointer">
              {t('actions.app')}
            </button>
            <Link
              href={`/courts/${facilityId}`}
              className="bg-[#7C3AED] text-white py-3 rounded-2xl text-xs font-medium hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-100 hover:cursor-pointer text-center"
            >
              {t('actions.web')}
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default CourtCard;
  ```

  Key changes vs the original:
  - Removed `useState`, `BookingModal` imports
  - Added `facilityId: number` to props
  - Replaced `<button onClick...><Link>...</Link></button>` with `<Link href="/courts/${facilityId}">` (kept all original classes + added `text-center`)
  - Removed the `<>` fragment and `<BookingModal>` block — return is now a single `<div>`
  - `id` prop is kept in the interface for future use (no longer used internally)

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  cd /Users/ammarbinmadi/Downloads/seed-landing-page
  npx tsc --noEmit 2>&1 | head -30
  ```

  Expected: no errors related to `CourtCard.tsx`

- [ ] **Step 3: Commit**

  ```bash
  git add components/CourtCard.tsx
  git commit -m "feat: CourtCard navigates to facility detail page instead of opening modal"
  ```

---

### Task 3: Update courts/page.tsx to pass facilityId

**Files:**
- Modify: `app/[locale]/courts/page.tsx`

The `CourtCard` call currently lacks `facilityId`. Add it.

- [ ] **Step 1: Open `app/[locale]/courts/page.tsx` and add `facilityId` prop**

  Find the `<CourtCard` block (around line 67). It currently looks like:
  ```tsx
            <CourtCard
              key={facility.id}
              id={facility.courts[0]?.id || facility.id} // We pass the first court ID for the booking logic
              name={isRtl ? facility.nameAr : facility.name}
              facilityName={isRtl ? facility.nameAr : facility.name}
              location={facility.location}
              price={...}
              startingFrom={...}
              image={facility.imageUrl || '/images/court3.png'}
              rating={facility.averageRating || 4.8}
              category={facility.courts[0]?.sportType || "TENNIS"}
            />
  ```

  Add `facilityId={facility.id}` after `key={facility.id}`, and update the stale comment on `id` to reflect it is no longer used for booking:
  ```tsx
            <CourtCard
              key={facility.id}
              id={facility.courts[0]?.id || facility.id}
              facilityId={facility.id}
              name={isRtl ? facility.nameAr : facility.name}
              facilityName={isRtl ? facility.nameAr : facility.name}
              location={facility.location}
              price={(() => {
                const prices = facility.courts
                  .map((c: any) => c.hourlyFee)
                  .filter((p: number) => p > 0);
                return prices.length > 0 ? Math.min(...prices) : 0;
              })()}
              startingFrom={(() => {
                const prices = facility.courts
                  .map((c: any) => c.hourlyFee)
                  .filter((p: number) => p > 0);
                return new Set(prices).size > 1;
              })()}
              image={facility.imageUrl || '/images/court3.png'}
              rating={facility.averageRating || 4.8}
              category={facility.courts[0]?.sportType || "TENNIS"}
            />
  ```

  Also remove the comment `// We pass the first court ID for the booking logic` on the `id` prop line — that comment is now stale since booking no longer happens in `CourtCard`.

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

  Expected: no errors

- [ ] **Step 3: Commit**

  ```bash
  git add app/[locale]/courts/page.tsx
  git commit -m "feat: pass facilityId to CourtCard"
  ```

---

## Chunk 2: New Components

### Task 4: Create BookNowButton (client component)

**Files:**
- Create: `components/BookNowButton.tsx`

This is a `"use client"` component that holds the `isOpen` state and renders the "Book Now" button + `BookingModal`. It receives all data from the server component parent.

- [ ] **Step 1: Create `components/BookNowButton.tsx`**

  ```tsx
  "use client";

  import { useState } from 'react';
  import BookingModal from '@/components/courts/BookingModal';
  import { useTranslations } from 'next-intl';

  interface BookNowButtonProps {
    facilityId: number;
    facilityName: string;
    location: string;
    lowestPricedCourt: {
      id: number;
      name: string;
      hourlyFee: number;
    };
  }

  export default function BookNowButton({
    facilityId,
    facilityName,
    location,
    lowestPricedCourt,
  }: BookNowButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('FacilityPage');

    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-100 hover:cursor-pointer"
        >
          {t('bookNow')}
        </button>

        <BookingModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          facilityId={facilityId}
          facilityName={facilityName}
          location={location}
          courtId={lowestPricedCourt.id}
          courtName={lowestPricedCourt.name}
          price={lowestPricedCourt.hourlyFee}
        />
      </>
    );
  }
  ```

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add components/BookNowButton.tsx
  git commit -m "feat: add BookNowButton client component"
  ```

---

### Task 5: Create FacilityHero (server component)

**Files:**
- Create: `components/FacilityHero.tsx`

Hero section: background image, gradient overlay, back link, category pill, facility name + location.

- [ ] **Step 1: Create `components/FacilityHero.tsx`**

  ```tsx
  import { getTranslations, getLocale } from 'next-intl/server';
  import { Link } from '@/i18n/routing';
  import { ChevronLeft, ChevronRight } from 'lucide-react';

  interface FacilityHeroProps {
    imageUrl?: string;
    nameAr: string;
    name: string;
    location: string;
    category: string;
  }

  export default async function FacilityHero({
    imageUrl,
    nameAr,
    name,
    location,
    category,
  }: FacilityHeroProps) {
    const t = await getTranslations('FacilityPage');
    const locale = await getLocale();
    const isRtl = locale === 'ar';
    const facilityName = isRtl ? nameAr : name;
    const BackIcon = isRtl ? ChevronRight : ChevronLeft;

    return (
      <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-b-[40px]">
        {/* Background image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={facilityName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-700" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e293b]" />

        {/* Back button */}
        <Link
          href="/courts"
          className="absolute top-4 start-4 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-3 py-2 rounded-full hover:bg-black/60 transition-colors"
        >
          <BackIcon size={16} />
          {t('back')}
        </Link>

        {/* Category pill */}
        <div className="absolute top-4 end-4 bg-[#7C3AED] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
          {category}
        </div>

        {/* Facility name + location */}
        <div className="absolute bottom-6 start-6 end-6">
          <h1 className="text-white text-2xl font-bold leading-tight">{facilityName}</h1>
          <p className="text-slate-300 text-sm mt-1">{location}</p>
        </div>
      </div>
    );
  }
  ```

  **Note on `start` / `end`:** Tailwind's `start-*` / `end-*` utilities are logical properties that automatically flip for RTL. If the project's Tailwind config does not support them (Tailwind v3+), fall back to `left-*` / `right-*` and handle RTL with a conditional class.

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add components/FacilityHero.tsx
  git commit -m "feat: add FacilityHero server component"
  ```

---

### Task 6: Create FacilityBookingSidebar (server component)

**Files:**
- Create: `components/FacilityBookingSidebar.tsx`

Sticky sidebar: price, starting-from label, hours, phone (tel: link), BookNowButton, Google Maps link.

- [ ] **Step 1: Create `components/FacilityBookingSidebar.tsx`**

  ```tsx
  import { getTranslations, getLocale } from 'next-intl/server';
  import { Clock, Phone, MapPin } from 'lucide-react';
  import BookNowButton from '@/components/BookNowButton';

  interface FacilityBookingSidebarProps {
    facilityId: number;
    facilityName: string;
    location: string;
    lowestPricedCourt: {
      id: number;
      name: string;
      hourlyFee: number;
    };
    hasVariedPrices: boolean;
    openTime?: string;
    closeTime?: string;
    phone?: string;
    mapQuery: string;
  }

  export default async function FacilityBookingSidebar({
    facilityId,
    facilityName,
    location,
    lowestPricedCourt,
    hasVariedPrices,
    openTime,
    closeTime,
    phone,
    mapQuery,
  }: FacilityBookingSidebarProps) {
    const t = await getTranslations('FacilityPage');
    const locale = await getLocale();
    const isRtl = locale === 'ar';

    return (
      <div className="sticky top-6 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-5">
        {/* Price */}
        <div className={isRtl ? 'text-right' : 'text-left'}>
          {hasVariedPrices && (
            <p className="text-xs text-slate-400 font-medium mb-0.5">{t('startingFrom')}</p>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#7C3AED]">{lowestPricedCourt.hourlyFee}</span>
            <span className="text-sm font-bold text-slate-400 uppercase">{t('currency')}</span>
          </div>
        </div>

        {/* Hours */}
        {(openTime || closeTime) && (
          <div className={`flex items-center gap-3 text-sm text-slate-600 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Clock size={16} className="text-[#7C3AED] shrink-0" />
            <span className="font-medium">
              {t('hours')}: {openTime ?? '–'} – {closeTime ?? '–'}
            </span>
          </div>
        )}

        {/* Phone */}
        {phone && (
          <a
            href={`tel:${phone}`}
            className={`flex items-center gap-3 text-sm text-slate-600 hover:text-[#7C3AED] transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Phone size={16} className="text-[#7C3AED] shrink-0" />
            <span className="font-medium">{t('callFacility')}: {phone}</span>
          </a>
        )}

        {/* Map link */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 text-sm text-slate-600 hover:text-[#7C3AED] transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <MapPin size={16} className="text-[#7C3AED] shrink-0" />
          <span className="font-medium">{location}</span>
        </a>

        {/* Book Now button (client component) */}
        <BookNowButton
          facilityId={facilityId}
          facilityName={facilityName}
          location={location}
          lowestPricedCourt={lowestPricedCourt}
        />
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add components/FacilityBookingSidebar.tsx
  git commit -m "feat: add FacilityBookingSidebar server component"
  ```

---

### Task 7: Create FacilityDetails (server component)

**Files:**
- Create: `components/FacilityDetails.tsx`

Right column: about description, amenities grid, courts list, photo gallery.

- [ ] **Step 1: Create `components/FacilityDetails.tsx`**

  ```tsx
  import { getTranslations, getLocale } from 'next-intl/server';

  const AMENITY_ICONS: Record<string, string> = {
    parking: '🅿️',
    wifi: '📶',
    prayer_room: '🕌',
    changing_rooms: '👗',
    showers: '🚿',
    cafe: '☕',
    shop: '🛍️',
    lockers: '🔒',
  };

  interface Court {
    id: number;
    name: string;
    sportType: string;
    hourlyFee: number;
  }

  interface FacilityDetailsProps {
    description?: string;
    amenities?: (string | Record<string, unknown>)[];
    courts: Court[];
    images?: string[];
  }

  /** Extract a usable string key from an amenity — handles both string[] and object[] from API */
  function getAmenityKey(amenity: string | Record<string, unknown>): string {
    if (typeof amenity === 'string') return amenity;
    const obj = amenity as Record<string, unknown>;
    return String(obj.key ?? obj.name ?? obj.type ?? obj.id ?? '');
  }

  export default async function FacilityDetails({
    description,
    amenities,
    courts,
    images,
  }: FacilityDetailsProps) {
    const t = await getTranslations('FacilityPage');
    const locale = await getLocale();
    const isRtl = locale === 'ar';

    return (
      <div className="space-y-8">
        {/* About */}
        {description && (
          <section>
            <h2 className={`text-lg font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('about')}
            </h2>
            <p className={`text-slate-600 text-sm leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
              {description}
            </p>
          </section>
        )}

        {/* Amenities */}
        {amenities && amenities.length > 0 && (
          <section>
            <h2 className={`text-lg font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('amenities')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map((amenity, i) => {
                const key = getAmenityKey(amenity);
                if (!key) return null; // skip unparseable entries
                const icon = AMENITY_ICONS[key] ?? '✓';
                return (
                  <div
                    key={`${key}-${i}`}
                    className="bg-[#F3E8FF] rounded-2xl px-4 py-3 flex items-center gap-2 text-sm font-medium text-[#7C3AED]"
                  >
                    <span>{icon}</span>
                    <span>{key.replace(/_/g, ' ')}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Courts list */}
        {courts.length > 0 && (
          <section>
            <h2 className={`text-lg font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('courts')}
            </h2>
            <div className="space-y-2">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className={`bg-slate-50 rounded-2xl px-5 py-4 flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <div className={isRtl ? 'text-right' : 'text-left'}>
                    <p className="font-bold text-slate-800 text-sm">{court.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{court.sportType}</p>
                  </div>
                  <div className={`flex items-baseline gap-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-lg font-bold text-[#7C3AED]">{court.hourlyFee}</span>
                    <span className="text-xs text-slate-400 font-bold uppercase">{t('currency')}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gallery */}
        {images && images.length > 0 && (
          <section>
            <h2 className={`text-lg font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
              {t('gallery')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl">
                  <img
                    src={src}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add components/FacilityDetails.tsx
  git commit -m "feat: add FacilityDetails server component"
  ```

---

## Chunk 3: Page + Final Wiring

### Task 8: Create the facility detail page

**Files:**
- Create: `app/[locale]/courts/[facilityId]/page.tsx`

Server component. Awaits params, fetches facility, computes lowest-priced court, renders hero + two-column body.

- [ ] **Step 1: Create the directory**

  ```bash
  mkdir -p "/Users/ammarbinmadi/Downloads/seed-landing-page/app/[locale]/courts/[facilityId]"
  ```

- [ ] **Step 2: Create `app/[locale]/courts/[facilityId]/page.tsx`**

  ```tsx
  import { notFound } from 'next/navigation';
  import { getLocale } from 'next-intl/server';
  import FacilityHero from '@/components/FacilityHero';
  import FacilityBookingSidebar from '@/components/FacilityBookingSidebar';
  import FacilityDetails from '@/components/FacilityDetails';

  interface PageProps {
    params: Promise<{ facilityId: string }>;
  }

  export default async function FacilityDetailPage({ params }: PageProps) {
    // 1. Parse route param
    const { facilityId } = await params;
    const id = parseInt(facilityId, 10);
    if (isNaN(id)) notFound();

    // 2. Fetch facility data (fresh, no cache)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/facilities/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) notFound();

    const data = await res.json();
    // API may wrap in { data: ... }
    const facility = data.data ?? data;
    if (!facility?.id) notFound();

    // 3. Compute lowest-priced court (graceful — a facility may have 0 courts configured)
    const courts: Array<{ id: number; name: string; sportType: string; hourlyFee: number }> =
      facility.courts ?? [];

    const sorted = courts.length > 0
      ? [...courts].sort((a, b) => a.hourlyFee - b.hourlyFee)
      : [];
    const lowestPricedCourt = sorted[0] ?? null;
    const hasVariedPrices = new Set(courts.map((c) => c.hourlyFee)).size > 1;

    // 4. Locale-aware facility name
    const locale = await getLocale();
    const facilityName = locale === 'ar' ? (facility.nameAr ?? facility.name) : facility.name;

    return (
      <main className="bg-[#FBFCFE] min-h-screen font-saudia">
        {/* Hero */}
        <FacilityHero
          imageUrl={facility.imageUrl}
          nameAr={facility.nameAr ?? facility.name}
          name={facility.name}
          location={facility.location ?? facility.city ?? ''}
          category={lowestPricedCourt?.sportType ?? ''}
        />

        {/* Two-column body */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left: Booking Sidebar — only shown when courts exist */}
            {lowestPricedCourt && (
              <div className="lg:col-span-1">
                <FacilityBookingSidebar
                  facilityId={facility.id}
                  facilityName={facilityName}
                  location={facility.location ?? facility.city ?? ''}
                  lowestPricedCourt={lowestPricedCourt}
                  hasVariedPrices={hasVariedPrices}
                  openTime={facility.openTime}
                  closeTime={facility.closeTime}
                  phone={facility.phone}
                  mapQuery={facility.address ?? facility.location ?? facility.city ?? facilityName}
                />
              </div>
            )}

            {/* Right: Facility Details — full width if no courts, otherwise 2/3 */}
            <div className={lowestPricedCourt ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <FacilityDetails
                description={facility.description}
                amenities={facility.amenities}
                courts={courts}
                images={facility.images}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }
  ```

- [ ] **Step 3: Verify no TypeScript errors**

  ```bash
  npx tsc --noEmit 2>&1 | head -30
  ```

  Expected: no errors

- [ ] **Step 4: Start dev server and manually test**

  ```bash
  cd /Users/ammarbinmadi/Downloads/seed-landing-page
  npm run dev
  ```

  Then open: `http://localhost:3000/ar/courts` — click any facility card's "عبر الموقع" button.

  Verify:
  - Navigates to `/ar/courts/{id}` (not opens a modal)
  - Hero image (or dark fallback) + facility name visible
  - Sidebar shows price, hours, phone, map link, "احجز الآن" button
  - Details shows about text, courts list
  - "احجز الآن" opens BookingModal correctly
  - "العودة" navigates back to `/ar/courts`

  Also test English: `http://localhost:3000/en/courts` → click "Book via Web" → verify `/en/courts/{id}` loads in English.

- [ ] **Step 5: Stop dev server and commit**

  ```bash
  git add "app/[locale]/courts/[facilityId]/page.tsx"
  git commit -m "feat: add facility detail page at /courts/[facilityId]"
  ```

---

### Task 9: Final commit — push to remote

- [ ] **Step 1: Verify all changes are committed**

  ```bash
  git status
  ```

  Expected: `nothing to commit, working tree clean`

- [ ] **Step 2: Push**

  ```bash
  git push origin master
  ```

  Expected: pushed successfully

---

## Quick Reference

| URL pattern | What renders |
|-------------|--------------|
| `/ar/courts` | Facility list (CourtCard grid) |
| `/ar/courts/12` | Facility detail page (this feature) |
| `/en/courts/12` | Same page in English |

**API call the detail page makes:**
```
GET https://api.seedco.sa/api/landing_page/facilities/12
```

**BookingModal is now only triggered from:** `BookNowButton` inside `FacilityBookingSidebar`
