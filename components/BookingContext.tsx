"use client";

import { createContext, useContext, useState } from 'react';
import { readCheckout } from '@/lib/checkout';

interface BookingContextType {
  selectedSportType: string;
  selectedCourtId: number;
  selectedDuration: number;
  selectedDate: string;
  selectedTime: string;
  selectedRecording: boolean;
  setSelectedSportType: (sport: string) => void;
  setSelectedCourtId: (id: number) => void;
  setSelectedDuration: (hours: number) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setSelectedRecording: (value: boolean) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
  facilityId,
}: {
  children: React.ReactNode;
  facilityId: number;
  initialCourtId: number;
  hasMultipleCourts: boolean;
}) {
  // Lazily restore from sessionStorage if the stored payload matches this facility
  const restore = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = readCheckout();
      if (saved && saved.facilityId === facilityId) return saved;
    } catch { /* ignore */ }
    return null;
  };

  const saved = restore();

  const [selectedSportType, setSelectedSportTypeRaw]   = useState(saved?.sportType ?? 'TENNIS');
  const [selectedCourtId,   setSelectedCourtIdRaw]     = useState(saved?.courtId ?? -1);
  const [selectedDuration,  setSelectedDurationRaw]    = useState(
    saved?.duration ?? (saved?.durationMinutes ? saved.durationMinutes / 60 : 1)
  );
  const [selectedDate,      setSelectedDateRaw]        = useState(
    saved?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [selectedTime,      setSelectedTimeRaw]        = useState(saved?.time ?? '');
  const [selectedRecording, setSelectedRecording]      = useState(saved?.recording ?? true);

  // Cascading resets — each step clears all downstream steps
  const setSelectedSportType = (sport: string) => {
    setSelectedSportTypeRaw(sport);
    setSelectedCourtIdRaw(-1);
    setSelectedTimeRaw('');
  };

  const setSelectedCourtId = (id: number) => {
    setSelectedCourtIdRaw(id);
    setSelectedTimeRaw('');
  };

  const setSelectedDuration = (hours: number) => {
    setSelectedDurationRaw(hours);
    setSelectedTimeRaw('');
  };

  const setSelectedDate = (date: string) => {
    setSelectedDateRaw(date);
    setSelectedTimeRaw('');
  };

  const setSelectedTime = (time: string) => {
    setSelectedTimeRaw(time);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedSportType,
        selectedCourtId,
        selectedDuration,
        selectedDate,
        selectedTime,
        selectedRecording,
        setSelectedSportType,
        setSelectedCourtId,
        setSelectedDuration,
        setSelectedDate,
        setSelectedTime,
        setSelectedRecording,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}
