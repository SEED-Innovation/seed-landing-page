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
