"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useBooking } from '@/components/BookingContext';

interface Court {
  id: number;
  hourlyFee: number;
}

interface StickyPriceBarProps {
  lowestPrice: number;
  hasVariedPrices: boolean;
  facilityName: string;
  courts: Court[];
  recordingFee: number;
  currency: string;
}

export default function StickyPriceBar({
  lowestPrice,
  hasVariedPrices,
  facilityName,
  courts,
  recordingFee,
  currency,
}: StickyPriceBarProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { selectedCourtId, selectedDuration, selectedRecording } = useBooking();

  const selectedCourt = courts.find(c => c.id === selectedCourtId);

  // If user has selected a court, compute their live price
  const hasSelection = !!selectedCourt;
  const livePrice = hasSelection
    ? selectedCourt!.hourlyFee * selectedDuration + (selectedRecording ? recordingFee : 0)
    : null;

  const showStartingFrom = !hasSelection && hasVariedPrices;
  const displayPrice = livePrice ?? lowestPrice;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-slate-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-6 py-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Facility name + price */}
        <div className={isRtl ? 'text-right' : 'text-left'}>
          <p className="text-xs text-slate-400 font-medium truncate max-w-[200px]">{facilityName}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            {showStartingFrom && (
              <span className="text-xs text-slate-400 font-medium">{t('startingFrom')}</span>
            )}
            <span className="text-2xl font-bold text-[#7C3AED]">{displayPrice}</span>
            <span className="text-xs font-bold text-slate-400 uppercase">{currency}</span>
          </div>
        </div>

        {/* Hint — shows breakdown when selection made */}
        <p className="text-xs text-slate-400 hidden sm:block text-end">
          {hasSelection
            ? isRtl
              ? `${selectedCourt!.hourlyFee} × ${selectedDuration}h${selectedRecording ? ` + ${recordingFee} تسجيل` : ''}`
              : `${selectedCourt!.hourlyFee} × ${selectedDuration}h${selectedRecording ? ` + ${recordingFee} recording` : ''}`
            : isRtl ? 'اختر الملعب والمدة والتاريخ والوقت' : 'Court → Duration → Date → Time'
          }
        </p>
      </div>
    </div>
  );
}
