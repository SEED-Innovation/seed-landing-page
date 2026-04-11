"use client";

import { createContext, useContext, useState } from 'react';

interface BookingContextType {
  selectedSportType: string;
  selectedCourtId: number;
  selectedDuration: number;
  selectedDate: string;
  selectedTime: string;
  setSelectedSportType: (sport: string) => void;
  setSelectedCourtId: (id: number) => void;
  setSelectedDuration: (hours: number) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({
  children,
}: {
  children: React.ReactNode;
  initialCourtId: number;
  hasMultipleCourts: boolean;
}) {
  const [selectedSportType, setSelectedSportTypeRaw] = useState('');
  const [selectedCourtId, setSelectedCourtIdRaw] = useState(-1);
  const [selectedDuration, setSelectedDurationRaw] = useState(1);
  const [selectedDate, setSelectedDateRaw] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTimeRaw] = useState('');

  // Cascading resets — each step clears all downstream steps
  const setSelectedSportType = (sport: string) => {
    setSelectedSportTypeRaw(sport);
    setSelectedCourtIdRaw(-1);
    setSelectedTimeRaw(''); // reset time; keep duration + date
  };

  const setSelectedCourtId = (id: number) => {
    setSelectedCourtIdRaw(id);
    setSelectedTimeRaw(''); // reset time only; keep duration + date
  };

  const setSelectedDuration = (hours: number) => {
    setSelectedDurationRaw(hours);
    setSelectedTimeRaw(''); // reset time only; keep date + court
  };

  const setSelectedDate = (date: string) => {
    setSelectedDateRaw(date);
    setSelectedTimeRaw(''); // reset time only
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
        setSelectedSportType,
        setSelectedCourtId,
        setSelectedDuration,
        setSelectedDate,
        setSelectedTime,
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
