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
              if (!key) return null;
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
