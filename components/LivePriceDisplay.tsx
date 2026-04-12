"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useBooking } from '@/components/BookingContext';

interface Court {
  id: number;
  hourlyFee: number;
}

interface LivePriceDisplayProps {
  lowestPrice: number;
  hasVariedPrices: boolean;
  courts: Court[];
  recordingFee: number;
}

export default function LivePriceDisplay({
  lowestPrice,
  hasVariedPrices,
  courts,
  recordingFee,
}: LivePriceDisplayProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { selectedCourtId, selectedDuration, selectedRecording } = useBooking();

  const selectedCourt = courts.find(c => c.id === selectedCourtId);
  const hasSelection = !!selectedCourt;
  const livePrice = hasSelection
    ? selectedCourt!.hourlyFee * selectedDuration + (selectedRecording ? recordingFee : 0)
    : null;

  const showStartingFrom = !hasSelection && hasVariedPrices;
  const displayPrice = livePrice ?? lowestPrice;

  return (
    <div className={isRtl ? 'text-right' : 'text-left'}>
      {showStartingFrom && (
        <p className="text-xs text-slate-400 font-medium mb-0.5">{t('startingFrom')}</p>
      )}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-[#7C3AED]">{displayPrice}</span>
        <span className="text-sm font-bold text-slate-400 uppercase">{t('currency')}</span>
      </div>
      {hasSelection && (
        <p className="text-xs text-slate-400 mt-0.5">
          {selectedCourt!.hourlyFee} × {selectedDuration}h
          {selectedRecording ? ` + ${recordingFee}` : ''}
        </p>
      )}
    </div>
  );
}
