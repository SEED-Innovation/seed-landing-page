import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import FacilityHero from '@/components/FacilityHero';
import FacilityBookingSidebar from '@/components/FacilityBookingSidebar';
import FacilityDetails from '@/components/FacilityDetails';
import StickyPriceBar from '@/components/StickyPriceBar';
import { BookingProvider } from '@/components/BookingContext';

interface PageProps {
  params: Promise<{ facilityId: string }>;
}

export default async function FacilityDetailPage({ params }: PageProps) {
  const { facilityId } = await params;
  const id = parseInt(facilityId, 10);
  if (isNaN(id)) notFound();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) notFound();

  const res = await fetch(`${apiUrl}/facilities/${id}`, { cache: 'no-store' });
  if (!res.ok) notFound();

  const data = await res.json();
  const facility = data.data ?? data;
  if (!facility?.id) notFound();

  const courts: Array<{ id: number; name: string; sportType: string; hourlyFee: number }> =
    facility.courts ?? [];

  const facilityRecordingFee: number = facility.seedRecordingFee ?? 0;

  const sorted = courts.length > 0
    ? [...courts].sort((a, b) => a.hourlyFee - b.hourlyFee)
    : [];
  const lowestPricedCourt = sorted[0] ?? null;
  const hasVariedPrices = new Set(courts.map((c) => c.hourlyFee)).size > 1;
  const hasMultipleCourts = courts.length > 1;

  const locale = await getLocale();
  const isAr = locale === 'ar';
  const facilityName = isAr ? (facility.nameAr ?? facility.name) : facility.name;
  const location = isAr
    ? (facility.locationAr ?? facility.location ?? facility.city ?? '')
    : (facility.location ?? facility.city ?? '');
  const description = isAr
    ? (facility.descriptionAr ?? facility.description)
    : facility.description;
  const currency = isAr ? 'ر.س' : 'SAR';

  return (
    <main className="bg-[#FBFCFE] min-h-screen font-saudia pb-24">
      <FacilityHero
        imageUrl={facility.imageUrl}
        nameAr={facility.nameAr ?? facility.name}
        name={facility.name}
        location={location}
        category={lowestPricedCourt?.sportType ?? ''}
      />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <BookingProvider
          facilityId={facility.id}
          initialCourtId={-1}
          hasMultipleCourts={hasMultipleCourts}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Left: Sidebar — About, Amenities, Courts, Price, Hours, Map */}
            {lowestPricedCourt && (
              <div className="lg:col-span-1">
                <FacilityBookingSidebar
                  facilityName={facilityName}
                  location={location}
                  description={description}
                  amenities={facility.amenities}
                  courts={courts}
                  lowestPricedCourt={lowestPricedCourt}
                  hasVariedPrices={hasVariedPrices}
                  openTime={facility.openTime}
                  closeTime={facility.closeTime}
                  mapQuery={facility.address ?? facility.location ?? facility.city ?? facilityName}
                  recordingFee={facilityRecordingFee}
                />
              </div>
            )}

            {/* Right: Selectors, Pay Now, Gallery */}
            <div className={lowestPricedCourt ? 'lg:col-span-2' : 'lg:col-span-3'}>
              <FacilityDetails
                facilityId={facility.id}
                facilityWebsite={facility.facilityWebsite ?? ''}
                facilityName={facilityName}
                location={location}
                courts={courts}
                lowestPricedCourt={lowestPricedCourt ?? { id: 0, name: '', sportType: '', hourlyFee: 0 }}
                images={facility.images}
                currency={currency}
                openTime={facility.openTime}
                closeTime={facility.closeTime}
                recordingFee={facilityRecordingFee}
              />
            </div>
          </div>

          {/* Sticky price bar — inside BookingProvider so it can read context */}
          {lowestPricedCourt && (
            <StickyPriceBar
              lowestPrice={lowestPricedCourt.hourlyFee}
              hasVariedPrices={hasVariedPrices}
              facilityName={facilityName}
              courts={courts}
              recordingFee={facilityRecordingFee}
              currency={currency}
            />
          )}
        </BookingProvider>
      </div>
    </main>
  );
}
