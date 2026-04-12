"use client";

import { useEffect, useState } from 'react';
import { useBooking } from '@/components/BookingContext';
import { useTranslations, useLocale } from 'next-intl';
import { CalendarDays, Clock, Loader2, AlertCircle, Video } from 'lucide-react';

interface Court {
  id: number;
  name: string;
  sportType: string;
  hourlyFee: number;
}

interface BookingFlowProps {
  courts: Court[];
  currency: string;
}

const DURATIONS = [1, 1.5, 2, 3];
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SPORT_TYPE_AR: Record<string, string> = {
  TENNIS: 'تنس', PADEL: 'بادل', SQUASH: 'إسكواش',
  FOOTBALL: 'كرة قدم', BASKETBALL: 'كرة سلة', VOLLEYBALL: 'كرة طائرة',
  BADMINTON: 'ريشة طائرة', TABLE_TENNIS: 'تنس طاولة',
};

const SPORT_ICONS: Record<string, string> = {
  TENNIS: '🎾', PADEL: '🏓', SQUASH: '🏸', FOOTBALL: '⚽',
  BASKETBALL: '🏀', VOLLEYBALL: '🏐', BADMINTON: '🏸', TABLE_TENNIS: '🏓',
};

interface ApiSlot {
  startTime: string;
  endTime: string;
  formattedTimeRange: string;
  available: boolean;
}

// ── Step heading helper ─────────────────────────────────────────────────────
function StepLabel({ icon, text, isRtl }: { icon: React.ReactNode; text: string; isRtl: boolean }) {
  return (
    <p className={`text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
      {!isRtl && icon}
      {text}
      {isRtl && icon}
    </p>
  );
}

// ── Divider ─────────────────────────────────────────────────────────────────
function StepDivider() {
  return <hr className="border-slate-200" />;
}

export default function BookingFlow({ courts, currency }: BookingFlowProps) {
  const t = useTranslations('FacilityPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const {
    selectedSportType, selectedCourtId, selectedDuration, selectedDate, selectedTime, selectedRecording,
    setSelectedSportType, setSelectedCourtId, setSelectedDuration, setSelectedDate, setSelectedTime, setSelectedRecording,
  } = useBooking();

  const [apiSlots, setApiSlots] = useState<ApiSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState(false);

  // Unique sport types
  const sportTypes = [...new Set(courts.map(c => c.sportType?.toUpperCase()).filter(Boolean))];
  const hasMultipleSports = sportTypes.length > 1;

  // Courts filtered by chosen sport type
  const filteredCourts = hasMultipleSports && selectedSportType
    ? courts.filter(c => c.sportType?.toUpperCase() === selectedSportType)
    : courts;

  // Step visibility — all steps always shown
  const showCourtStep = !hasMultipleSports || selectedSportType !== '';
  const showDurationStep = showCourtStep;
  const showDateStep = showCourtStep;
  const showTimeStep = showCourtStep;

  const today = new Date().toISOString().split('T')[0];

  // Auto-select court on mount: most expensive; tie-break alphabetically by name
  useEffect(() => {
    if (selectedCourtId !== -1 || courts.length === 0) return;
    const sorted = [...courts].sort((a, b) =>
      b.hourlyFee !== a.hourlyFee
        ? b.hourlyFee - a.hourlyFee
        : a.name.localeCompare(b.name)
    );
    setSelectedCourtId(sorted[0].id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courts]);

  // Fetch time slots from API whenever court + duration + date change
  useEffect(() => {
    if (selectedCourtId === -1 || !selectedDate) {
      setApiSlots([]);
      setSlotsError(false);
      return;
    }
    let cancelled = false;
    setIsLoadingSlots(true);
    setSlotsError(false);
    setApiSlots([]);

    fetch(`${BASE_URL}/courts/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courtId: selectedCourtId,
        date: selectedDate,
        durationMinutes: Math.round(selectedDuration * 60),
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const slots: ApiSlot[] = data.availableSlots ?? [];
        setApiSlots(slots);
        setIsLoadingSlots(false);
      })
      .catch(() => {
        if (!cancelled) { setSlotsError(true); setIsLoadingSlots(false); }
      });

    return () => { cancelled = true; };
  }, [selectedCourtId, selectedDate, selectedDuration]);

  // Time slots to display — deduplicated by startTime to avoid React key conflicts
  const displaySlots = Array.from(
    new Map(apiSlots.map(s => [s.startTime, { value: s.startTime, label: s.formattedTimeRange, available: s.available }])).values()
  );

  return (
    <div className="bg-slate-50 rounded-[24px] p-5 space-y-5">

      {/* ── Step 1: Sport Type (only if multiple sports) ── */}
      {hasMultipleSports && (
        <>
          <div>
            <StepLabel icon={<span>🏟️</span>} text={t('chooseSport')} isRtl={isRtl} />
            <div className="flex gap-2 flex-wrap">
              {sportTypes.map(sport => {
                const label = isRtl ? (SPORT_TYPE_AR[sport] ?? sport) : sport;
                const icon = SPORT_ICONS[sport] ?? '🏅';
                return (
                  <button
                    key={sport}
                    onClick={() => setSelectedSportType(sport)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 ${
                      selectedSportType === sport
                        ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-100'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <StepDivider />
        </>
      )}

      {/* ── Step 2: Court Selection ── */}
      {showCourtStep && (
        <>
          <div>
            <StepLabel icon={<span>🏟️</span>} text={t('chooseCourt')} isRtl={isRtl} />
            <div className="grid grid-cols-2 gap-2">
              {filteredCourts.map(court => {
                const isSelected = selectedCourtId === court.id;
                const sportLabel = isRtl
                  ? (SPORT_TYPE_AR[court.sportType?.toUpperCase() ?? ''] ?? court.sportType)
                  : court.sportType;
                return (
                  <button
                    key={court.id}
                    onClick={() => setSelectedCourtId(court.id)}
                    className={`rounded-2xl px-3 py-3 text-left transition-all border-2 ${isRtl ? 'text-right' : 'text-left'} ${
                      isSelected
                        ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-md shadow-purple-100'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-[#7C3AED]/40'
                    }`}
                  >
                    <p className={`font-bold text-xs leading-tight ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                      {court.name}
                    </p>
                    {!hasMultipleSports && sportLabel && (
                      <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        {sportLabel}
                      </p>
                    )}
                    <p className={`text-sm font-bold mt-1.5 ${isSelected ? 'text-white' : 'text-[#7C3AED]'}`}>
                      {court.hourlyFee} {currency}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
          <StepDivider />
        </>
      )}

      {/* ── Step 3: Duration ── */}
      {showDurationStep && (
        <>
          <div>
            <StepLabel icon={<Clock size={13} className="text-[#7C3AED]" />} text={t('chooseDuration')} isRtl={isRtl} />
            <div className="flex gap-2 flex-wrap">
              {DURATIONS.map(d => {
                const label = d === 1 ? `1 ${t('hour')}` : `${d} ${t('hours')}`;
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
          <StepDivider />
        </>
      )}

      {/* ── Step 4: Date ── */}
      {showDateStep && (
        <>
          <div>
            <StepLabel icon={<CalendarDays size={13} className="text-[#7C3AED]" />} text={t('chooseDate')} isRtl={isRtl} />
            <div className="relative">
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                dir="ltr"
                className={`w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors ${isRtl ? 'text-right' : 'text-left'}`}
              />
              <CalendarDays
                size={16}
                className={`absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`}
              />
            </div>
          </div>
          <StepDivider />
        </>
      )}

      {/* ── Step 5: Time Slot ── */}
      {showTimeStep && (
        <div>
          <StepLabel icon={<Clock size={13} className="text-[#7C3AED]" />} text={t('chooseTime')} isRtl={isRtl} />

          {selectedCourtId === -1 ? (
            <p className="text-xs text-slate-400 font-medium py-2">
              {isRtl ? 'اختر ملعبًا لعرض المواعيد المتاحة' : 'Select a court to see available times'}
            </p>
          ) : isLoadingSlots ? (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-[#7C3AED]" size={22} />
            </div>
          ) : slotsError ? (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-2xl text-xs font-bold">
              <AlertCircle size={16} />
              {isRtl ? 'خطأ في تحميل المواعيد' : 'Could not load time slots'}
            </div>
          ) : displaySlots.length === 0 ? (
            <div className="flex flex-col gap-1 p-4 bg-amber-50 text-amber-700 rounded-2xl text-xs">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle size={16} />
                {isRtl ? 'عذراً، هذا اليوم محجوز بالكامل' : 'Sorry, we are fully booked today.'}
              </div>
              <p className={`text-amber-600 ${isRtl ? 'text-right pr-6' : 'pl-6'}`}>
                {isRtl ? 'يمكنك اختيار تاريخ آخر لحجزك' : 'You may choose another date for your booking.'}
              </p>
            </div>
          ) : (
            <>
              <p className={`text-[10px] text-slate-400 mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                {isRtl ? '* الأوقات المعروضة هي وقت بداية الحجز' : '* Times shown are the start time of the booking'}
              </p>
              <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                {displaySlots.map(slot => {
                  const startTime = slot.value.includes('T')
                    ? slot.value.split('T')[1].slice(0, 5)
                    : slot.value.slice(0, 5);
                  return (
                    <button
                      key={slot.value}
                      dir="ltr"
                      onClick={() => slot.available && setSelectedTime(slot.value)}
                      disabled={!slot.available}
                      className={`rounded-2xl py-2.5 text-[11px] font-bold transition-all duration-150 border-2 ${
                        !slot.available
                          ? 'bg-white border-slate-100 text-slate-300 cursor-not-allowed line-through'
                          : selectedTime === slot.value
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-md shadow-purple-100'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-[#7C3AED]/40 hover:text-[#7C3AED] cursor-pointer'
                      }`}
                    >
                      {startTime}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Step 6: Recording Add-on ── */}
      {showTimeStep && (
        <>
          <StepDivider />
          <button
            type="button"
            onClick={() => setSelectedRecording(!selectedRecording)}
            className="w-full rounded-2xl p-4 transition-all duration-200 text-left bg-[#6D28D9]"
          >
            <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
              {/* Left: icon + text */}
              <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20">
                  <Video size={18} className="text-[#ECDCFF]" />
                </div>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <p className="text-sm font-bold leading-tight text-white">
                    {isRtl ? 'SEED تسجيل' : 'SEED Recording'}
                  </p>
                  <p className="text-xs mt-0.5 text-[#D08CFF]">
                    {isRtl ? 'أضف تسجيل لجلستك' : 'Add a recording to your session'}
                  </p>
                </div>
              </div>

              {/* Toggle + emoji */}
              <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span className="text-lg leading-none">
                  {selectedRecording ? '😊' : '😔'}
                </span>
                <div className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200
                  ${selectedRecording ? 'bg-[#ECDCFF]' : 'bg-white/30'}`}>
                  <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-200 bg-white
                    ${selectedRecording
                      ? (isRtl ? 'right-1' : 'left-6')
                      : (isRtl ? 'right-6' : 'left-1')
                    }`}
                  />
                </div>
              </div>
            </div>
          </button>
        </>
      )}
    </div>
  );
}
