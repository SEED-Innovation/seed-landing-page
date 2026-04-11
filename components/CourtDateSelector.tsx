"use client";

import { useBooking } from '@/components/BookingContext';
import { useTranslations, useLocale } from 'next-intl';
import { CalendarDays, Clock } from 'lucide-react';

interface CourtDateSelectorProps {
  currency: string;
  openTime?: string;
  closeTime?: string;
}

const DURATIONS = [1, 1.5, 2, 3];

function generateTimeSlots(
  openTime: string,
  closeTime: string,
  durationHours: number
): { value: string; label: string }[] {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  const toTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const openMin = toMinutes(openTime || '06:00');
  const closeMin = toMinutes(closeTime || '23:00');
  const durationMin = Math.round(durationHours * 60);

  const slots: { value: string; label: string }[] = [];
  for (let t = openMin; t + durationMin <= closeMin; t += 30) {
    const start = toTime(t);
    const end = toTime(t + durationMin);
    slots.push({ value: start, label: `${start} – ${end}` });
  }
  return slots;
}

export default function CourtDateSelector({ currency: _currency, openTime, closeTime }: CourtDateSelectorProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const {
    selectedDate,
    selectedTime,
    selectedDuration,
    setSelectedDate,
    setSelectedTime,
    setSelectedDuration,
  } = useBooking();

  const today = new Date().toISOString().split('T')[0];
  const timeSlots = selectedDate
    ? generateTimeSlots(openTime || '06:00', closeTime || '23:00', selectedDuration)
    : [];

  return (
    <div className="bg-slate-50 rounded-[24px] p-5 space-y-5">

      {/* Duration pills */}
      <div>
        <p className={`text-xs font-semibold text-slate-500 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('chooseDuration')}
        </p>
        <div className="flex gap-2 flex-wrap">
          {DURATIONS.map((d) => {
            const label = d === 1
              ? `1 ${t('hour')}`
              : `${d} ${t('hours')}`;
            return (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 ${
                  selectedDuration === d
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-100'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date picker */}
      <div>
        <p className={`text-xs font-semibold text-slate-500 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
          {t('chooseDate')}
        </p>
        <div className="relative">
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={`w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
            dir="ltr"
          />
          <CalendarDays
            size={16}
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`}
          />
        </div>
      </div>

      {/* Time slot picker — appears after date is chosen */}
      {selectedDate && timeSlots.length > 0 && (
        <div>
          <p className={`text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5 ${isRtl ? 'justify-end' : 'justify-start'}`}>
            <Clock size={13} className="text-[#7C3AED]" />
            {t('chooseTime')}
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
            {timeSlots.map((slot) => (
              <button
                key={slot.value}
                dir="ltr"
                onClick={() => setSelectedTime(slot.value)}
                className={`rounded-2xl py-2.5 text-[11px] font-bold transition-all duration-150 border-2 ${
                  selectedTime === slot.value
                    ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-purple-100'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED]'
                }`}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
