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
