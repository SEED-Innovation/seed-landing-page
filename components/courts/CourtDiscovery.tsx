"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Heart } from 'lucide-react';
import CourtCard from '../CourtCard';
import SectionTitle from '../ui/SectionTitle';

const CourtDiscovery = () => {
  const t = useTranslations('CourtsPage.Discovery');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Mimic Data
  const mimicCourts = [
    { id: 1, name: isRtl ? "ملعب البادل الأول" : "Padel Master Court", location: isRtl ? "جدة - الكورنيش" : "Jeddah - Corniche", price: 200, rating: 4.8, image: "/images/court1.png" },
    { id: 2, name: isRtl ? "سوبر بادل" : "Super Padel", location: isRtl ? "الرياض - الملقا" : "Riyadh - Al Malqa", price: 250, rating: 4.9, image: "/images/court2.png" },
    { id: 3, name: isRtl ? "ملعب التنس الملكي" : "Royal Tennis Court", location: isRtl ? "الدمام - الشاطئ" : "Dammam - Ash Shati", price: 180, rating: 4.7, image: "/images/court3.png" },
    { id: 4, name: isRtl ? "بادل سيتي" : "Padel City", location: isRtl ? "جدة - أبحر" : "Jeddah - Obhur", price: 220, rating: 4.8, image: "/images/court4.png" },
    { id: 5, name: isRtl ? "أكاديمية النخبة" : "Elite Academy", location: isRtl ? "الخبر - العزيزية" : "Khobar - Al Azizia", price: 300, rating: 5.0, image: "/images/court5.png" },
    { id: 6, name: isRtl ? "بادل زون" : "Padel Zone", location: isRtl ? "مكة - الشوقية" : "Makkah - Ash Shawqiyyah", price: 150, rating: 4.6, image: "/images/court1.png" },
    { id: 7, name: isRtl ? "ملاعب سماء" : "Sama Courts", location: isRtl ? "أبها - السودة" : "Abha - Al Soudah", price: 190, rating: 4.8, image: "/images/court2.png" },
    { id: 8, name: isRtl ? "المجمع الرياضي" : "Sports Complex", location: isRtl ? "المدينة - باقدو" : "Madinah - Bagdo", price: 210, rating: 4.7, image: "/images/court3.png" },
  ];

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