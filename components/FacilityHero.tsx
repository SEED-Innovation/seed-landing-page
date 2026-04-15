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

const SPORT_TYPE_AR: Record<string, string> = {
  TENNIS: 'تنس',
  PADEL: 'بادل',
  SQUASH: 'إسكواش',
  FOOTBALL: 'كرة قدم',
  BASKETBALL: 'كرة سلة',
  VOLLEYBALL: 'كرة طائرة',
  BADMINTON: 'ريشة طائرة',
  TABLE_TENNIS: 'تنس طاولة',
};

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
  const categoryLabel = isRtl
    ? (SPORT_TYPE_AR[category?.toUpperCase()] ?? category)
    : category;

  return (
    <div className="relative w-full h-64 md:h-80 overflow-hidden rounded-b-[40px]">
      {/* Background image */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={facilityName}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-slate-700" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e293b]" />

      {/* Back button */}
      <Link
        href="/facilities"
        className="absolute top-4 start-4 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-sm font-bold px-3 py-2 rounded-full hover:bg-black/60 transition-colors"
      >
        <BackIcon size={16} />
        {t('back')}
      </Link>

      {/* Category pill */}
      <div className="absolute top-4 end-4 bg-[#7C3AED] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
        {categoryLabel}
      </div>

      {/* Facility name + location */}
      <div className="absolute bottom-6 start-6 end-6">
        <h1 className="text-white text-2xl font-bold leading-tight">{facilityName}</h1>
        <p className="text-slate-300 text-sm mt-1">{location}</p>
      </div>
    </div>
  );
}
