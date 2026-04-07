"use client";

import { useState } from 'react';
import BookingModal from '@/components/courts/BookingModal';
import { useTranslations } from 'next-intl';

interface BookNowButtonProps {
  facilityId: number;
  facilityName: string;
  location: string;
  lowestPricedCourt: {
    id: number;
    name: string;
    hourlyFee: number;
  };
}

export default function BookNowButton({
  facilityId,
  facilityName,
  location,
  lowestPricedCourt,
}: BookNowButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('FacilityPage');

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#7C3AED] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-100 hover:cursor-pointer"
      >
        {t('bookNow')}
      </button>

      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        facilityId={facilityId}
        facilityName={facilityName}
        location={location}
        courtId={lowestPricedCourt.id}
        courtName={lowestPricedCourt.name}
        price={lowestPricedCourt.hourlyFee}
      />
    </>
  );
}
