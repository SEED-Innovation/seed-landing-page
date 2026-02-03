"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Heart } from 'lucide-react';
import CourtCard from '../CourtCard';
import SectionTitle from '../ui/SectionTitle';

const CourtDiscovery = () => {
  const t = useTranslations('CourtsPage.Discovery');


  

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className={`flex justify-between items-center mb-10 `}>
          <SectionTitle className="!text-2xl md:!text-3xl">
            {t('title')}
          </SectionTitle>
          <button className="text-slate-300 hover:text-red-500 transition-colors">
            <Heart size={28} />
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {mimicCourts.map((court) => (
            <CourtCard 
              key={court.id}
              name={court.name}
              location={court.location}
              price={court.price}
              image={court.image}
              rating={court.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourtDiscovery;