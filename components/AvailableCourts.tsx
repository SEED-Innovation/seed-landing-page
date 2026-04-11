"use client";

import { useEffect, useState } from 'react';
import { useBooking } from '@/components/BookingContext';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface Court {
  id: number;
  name: string;
  sportType?: string;
  hourlyFee: number;
}

interface AvailableCourtsProps {
  courts: Court[];
  currency: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

export default function AvailableCourts({ courts, currency }: AvailableCourtsProps) {
  const { selectedDate, selectedTime, selectedDuration, selectedCourtId, setSelectedCourtId } = useBooking();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('FacilityPage');

  const [courtAvailability, setCourtAvailability] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isVisible = selectedDate !== '' && selectedTime !== '';

  useEffect(() => {
    if (!isVisible) {
      setCourtAvailability({});
      return;
    }

    let cancelled = false;

    const checkAvailability = async () => {
      setIsLoading(true);
      const durationMinutes = Math.round(selectedDuration * 60);

      const results = await Promise.allSettled(
        courts.map(async (court) => {
          const res = await fetch(`${BASE_URL}/courts/availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courtId: court.id, date: selectedDate, durationMinutes }),
          });
          const data = await res.json();
          const slots: { startTime: string; available: boolean }[] = data.availableSlots ?? [];
          const match = slots.find((s) => s.startTime === selectedTime);
          return { courtId: court.id, available: match?.available ?? false };
        })
      );

      if (cancelled) return;

      const availability: Record<number, boolean> = {};
      for (const result of results) {
        if (result.status === 'fulfilled') {
          availability[result.value.courtId] = result.value.available;
        }
      }
      setCourtAvailability(availability);
      setIsLoading(false);
    };

    checkAvailability();
    return () => { cancelled = true; };
  }, [selectedDate, selectedTime, selectedDuration, courts]);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-50 rounded-[24px] p-5 space-y-3">
      <p className={`text-xs font-semibold text-slate-500 flex items-center gap-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
        <CheckCircle2 size={13} className="text-[#7C3AED]" />
        {t('chooseCourt')}
      </p>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-[#7C3AED]" size={24} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {courts.map((court) => {
            const isAvailable = courtAvailability[court.id] ?? false;
            const isSelected = selectedCourtId === court.id;
            const sportLabel = isRtl
              ? (SPORT_TYPE_AR[court.sportType?.toUpperCase() ?? ''] ?? court.sportType)
              : court.sportType;

            return (
              <button
                key={court.id}
                onClick={() => isAvailable && setSelectedCourtId(court.id)}
                disabled={!isAvailable}
                className={`rounded-2xl p-4 transition-all border-2 ${isRtl ? 'text-right' : 'text-left'} ${
                  !isAvailable
                    ? 'bg-white border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-lg shadow-purple-100 cursor-pointer'
                    : 'bg-white border-slate-200 hover:border-[#7C3AED]/40 cursor-pointer'
                }`}
              >
                <p className={`font-bold text-xs leading-tight ${isSelected ? 'text-white' : isAvailable ? 'text-slate-800' : 'text-slate-500'}`}>
                  {court.name}
                </p>
                {sportLabel && (
                  <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                    {sportLabel}
                  </p>
                )}
                <p className={`text-sm font-bold mt-2 ${isSelected ? 'text-white' : isAvailable ? 'text-[#7C3AED]' : 'text-slate-400'}`}>
                  {court.hourlyFee} {currency}
                </p>
                {!isAvailable && (
                  <p className="text-[10px] text-red-400 mt-1 font-medium">
                    {isRtl ? 'محجوز' : 'Booked'}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
