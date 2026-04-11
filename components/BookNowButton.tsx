"use client";

import { useState } from 'react';
import { useBooking } from '@/components/BookingContext';
import BookingModal from '@/components/courts/BookingModal';
import { useTranslations, useLocale } from 'next-intl';

interface Court {
  id: number;
  name: string;
  hourlyFee: number;
}

interface BookNowButtonProps {
  facilityId: number;
  facilityName: string;
  location: string;
  courts: Court[];
  lowestPricedCourt: Court;
}

export default function BookNowButton({
  facilityId,
  facilityName,
  location,
  courts,
  lowestPricedCourt,
}: BookNowButtonProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { selectedCourtId, selectedDate, selectedTime } = useBooking();
  const [isOpen, setIsOpen] = useState(false);

  const hasCourt = selectedCourtId !== -1;
  const hasDate = selectedDate !== '';
  const hasTime = selectedTime !== '';
  const isReady = hasCourt && hasDate && hasTime;

  // Progressive guidance
  const hintText = () => {
    if (!hasCourt) return isRtl ? 'اختر الملعب أولاً' : 'Choose a court first';
    if (!hasDate) return isRtl ? 'اختر التاريخ' : 'Choose a date';
    if (!hasTime) return isRtl ? 'اختر الوقت المناسب' : 'Choose a time slot';
    return t('payNow');
  };

  const selectedCourt = courts.find(c => c.id === selectedCourtId) ?? lowestPricedCourt;

  return (
    <>
      <button
        onClick={() => isReady && setIsOpen(true)}
        disabled={!isReady}
        className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all duration-200 ${
          isReady
            ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-lg shadow-purple-100 cursor-pointer'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {hintText()}
      </button>

      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        facilityId={facilityId}
        facilityName={facilityName}
        location={location}
        courtId={selectedCourt.id}
        courtName={selectedCourt.name}
        price={selectedCourt.hourlyFee}
      />
    </>
  );
}
