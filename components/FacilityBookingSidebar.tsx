import { getTranslations, getLocale } from 'next-intl/server';
import { Clock, MapPin } from 'lucide-react';
import LivePriceDisplay from '@/components/LivePriceDisplay';

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

function getAmenityKey(amenity: string | Record<string, unknown>): string {
  if (typeof amenity === 'string') return amenity;
  const obj = amenity as Record<string, unknown>;
  return String(obj.key ?? obj.name ?? obj.type ?? obj.id ?? '');
}

interface Court {
  id: number;
  name: string;
  sportType?: string;
  hourlyFee: number;
}

interface FacilityBookingSidebarProps {
  facilityName: string;
  location: string;
  description?: string;
  amenities?: (string | Record<string, unknown>)[];
  courts: Court[];
  lowestPricedCourt: Court;
  hasVariedPrices: boolean;
  openTime?: string;
  closeTime?: string;
  mapQuery: string;
  recordingFee: number;
}

export default async function FacilityBookingSidebar({
  location,
  description,
  amenities,
  courts,
  lowestPricedCourt,
  hasVariedPrices,
  openTime,
  closeTime,
  mapQuery,
  recordingFee,
}: FacilityBookingSidebarProps) {
  const t = await getTranslations('FacilityPage');
  const locale = await getLocale();
  const isRtl = locale === 'ar';

  const hasAmenities = amenities && amenities.length > 0;

  return (
    <div className="sticky top-6 bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-5">

      {/* About */}
      {description && (
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <h2 className="text-base font-bold text-[#1e293b] mb-2">{t('about')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-4">{description}</p>
        </div>
      )}

      {description && <hr className="border-slate-100" />}

      {/* Location — between About and Amenities */}
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(mapQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 text-sm text-slate-600 hover:text-[#7C3AED] transition-colors"
      >
        <MapPin size={16} className="text-[#7C3AED] shrink-0" />
        <span className="font-medium">{location}</span>
      </a>

      <hr className="border-slate-100" />

      {/* Facilities & Amenities */}
      {hasAmenities && (
        <div>
          <h2 className={`text-base font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            {t('amenities')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {amenities!.map((amenity, i) => {
              const key = getAmenityKey(amenity);
              if (!key) return null;
              const icon = AMENITY_ICONS[key] ?? '✓';
              return (
                <div
                  key={`${key}-${i}`}
                  className="bg-[#F3E8FF] rounded-2xl px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-[#7C3AED]"
                >
                  <span>{icon}</span>
                  <span>{key.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasAmenities && <hr className="border-slate-100" />}

      {/* Courts list — swapped in place of Pay Now */}
      {courts.length > 0 && (
        <div>
          <h2 className={`text-base font-bold text-[#1e293b] mb-3 ${isRtl ? 'text-right' : 'text-left'}`}>
            {t('courts')}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {courts.map((court) => (
              <div
                key={court.id}
                className="bg-slate-50 rounded-2xl px-3 py-4 min-h-[72px] flex items-center justify-between gap-2"
              >
                {/* Name + sport type — start side */}
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="font-bold text-slate-800 text-xs leading-tight">{court.name}</p>
                  {court.sportType && (
                    <p className="text-[10px] text-slate-400 mt-0.5">{court.sportType}</p>
                  )}
                </div>
                {/* Price — end side */}
                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span className="text-base font-bold text-[#7C3AED]">{court.hourlyFee}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{t('currency')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-slate-100" />

      {/* Live price — updates reactively from BookingContext */}
      <LivePriceDisplay
        lowestPrice={lowestPricedCourt.hourlyFee}
        hasVariedPrices={hasVariedPrices}
        courts={courts}
        recordingFee={recordingFee}
      />

      {/* Hours */}
      {(openTime || closeTime) && (
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <Clock size={16} className="text-[#7C3AED] shrink-0" />
          <span className="font-medium">
            {t('hours')}: {openTime ?? '–'} – {closeTime ?? '–'}
          </span>
        </div>
      )}

    </div>
  );
}
