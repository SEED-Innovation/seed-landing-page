import { getTranslations, getLocale } from 'next-intl/server';
import BookingFlow from '@/components/BookingFlow';
import BookNowButton from '@/components/BookNowButton';

interface Court {
  id: number;
  name: string;
  sportType: string;
  hourlyFee: number;
}

interface FacilityDetailsProps {
  facilityId: number;
  facilityWebsite: string;
  facilityName: string;
  location: string;
  courts: Court[];
  lowestPricedCourt: Court;
  images?: string[];
  currency: string;
  openTime?: string;
  closeTime?: string;
  recordingFee: number;
}

export default async function FacilityDetails({
  facilityId,
  facilityWebsite,
  facilityName,
  location,
  courts,
  lowestPricedCourt,
  images,
  currency,
  openTime,
  closeTime,
  recordingFee,
}: FacilityDetailsProps) {
  const t = await getTranslations('FacilityPage');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  return (
    <div className="space-y-4">

      {/* Steps: Sport → Court → Duration → Date → Time */}
      {courts.length > 0 && (
        <BookingFlow
          courts={courts}
          currency={currency}
        />
      )}

      {/* Pay Now button */}
      {courts.length > 0 && (
        <BookNowButton
          facilityId={facilityId}
          facilityWebsite={facilityWebsite}
          facilityName={facilityName}
          location={location}
          courts={courts}
          lowestPricedCourt={lowestPricedCourt}
          recordingFee={recordingFee}
        />
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
                  loading="lazy"
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
