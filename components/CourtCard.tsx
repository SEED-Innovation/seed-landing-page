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
    <div className="rounded-[32px] shadow-sm border border-slate-50 hover:shadow-md transition-all group">
      <Link href={`/courts/${facilityId}`} className="block p-4 cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] mb-4">
          <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

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
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin size={14} />
            <span className="text-xs font-saudia font-medium">{location}</span>
          </div>
        </div>
      </Link>

      {/* Action Buttons — outside the link to avoid nested interactive elements */}
      <div className="grid grid-cols-2 gap-2 font-bold px-4 pb-4">
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
  );
};

export default CourtCard;