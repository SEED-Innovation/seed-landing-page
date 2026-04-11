"use client";

import { useTranslations, useLocale } from 'next-intl';

interface StickyPriceBarProps {
  price: number;
  hasVariedPrices: boolean;
  facilityName: string;
}

export default function StickyPriceBar({ price, hasVariedPrices, facilityName }: StickyPriceBarProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-6 py-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className={`max-w-7xl mx-auto flex items-center justify-between gap-4`}>
        {/* Facility name + price */}
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{facilityName}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            {hasVariedPrices && (
              <span className="text-xs text-slate-400 font-medium">{t('startingFrom')}</span>
            )}
            <span className="text-2xl font-bold text-[#7C3AED]">{price}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">{t('currency')}</span>
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs text-slate-400 hidden sm:block">
          {isRtl ? 'اختر الملعب والمدة والتاريخ والوقت' : 'Court → Duration → Date → Time'}
        </p>
      </div>
    </div>
  );
}
