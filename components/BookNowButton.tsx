"use client";

import { useEffect, useRef } from 'react';
import { useBooking } from '@/components/BookingContext';
import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from '@/i18n/routing';
import { writeCheckout } from '@/lib/checkout';

interface Court {
  id: number;
  name: string;
  hourlyFee: number;
  sportType?: string;
  seedRecordingFee?: number | null;
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
  const router = useRouter();

  const {
    selectedCourtId, selectedDate, selectedTime,
    selectedDuration, selectedSportType, selectedRecording,
  } = useBooking();

  const { user, openAuth } = useAuth();
  const pendingCheckout = useRef(false);

  const hasCourt = selectedCourtId !== -1;
  const hasDate  = selectedDate !== '';
  const hasTime  = selectedTime !== '';
  const isReady  = hasCourt && hasDate && hasTime;

  // If user just signed in and had a pending checkout intent, navigate automatically
  useEffect(() => {
    if (user && pendingCheckout.current && isReady) {
      pendingCheckout.current = false;
      router.push('/checkout');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isReady]);

  const goToCheckout = () => {
    const selectedCourt = courts.find(c => c.id === selectedCourtId) ?? lowestPricedCourt;
    writeCheckout({
      facilityId,
      facilityName,
      location,
      courtId:      selectedCourt.id,
      courtName:    selectedCourt.name,
      price:        selectedCourt.hourlyFee,
      recordingFee: selectedCourt.seedRecordingFee ?? 0,
      date:         selectedDate,
      time:         selectedTime,
      duration:     selectedDuration,
      recording:    selectedRecording,
      sportType:    selectedSportType,
    });
    router.push('/checkout');
  };

  const handleClick = () => {
    if (!isReady) return;
    if (!user) {
      // Write checkout data first so it's ready after sign-in
      const selectedCourt = courts.find(c => c.id === selectedCourtId) ?? lowestPricedCourt;
      writeCheckout({
        facilityId,
        facilityName,
        location,
        courtId:      selectedCourt.id,
        courtName:    selectedCourt.name,
        price:        selectedCourt.hourlyFee,
        recordingFee: selectedCourt.seedRecordingFee ?? 0,
        date:         selectedDate,
        time:         selectedTime,
        duration:     selectedDuration,
        recording:    selectedRecording,
        sportType:    selectedSportType,
      });
      pendingCheckout.current = true;
      openAuth('signin');
      return;
    }
    goToCheckout();
  };

  // Progressive hint text
  const hintText = () => {
    if (!hasCourt) return isRtl ? 'اختر الملعب أولاً' : 'Choose a court first';
    if (!hasDate)  return isRtl ? 'اختر التاريخ' : 'Choose a date';
    if (!hasTime)  return isRtl ? 'اختر الوقت المناسب' : 'Choose a time slot';
    return t('payNow');
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isReady}
      className={`w-full py-4 rounded-2xl font-bold text-sm text-center transition-all duration-200 ${
        isReady
          ? 'bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-lg shadow-purple-100 cursor-pointer'
          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
      }`}
    >
      {hintText()}
    </button>
  );
}
