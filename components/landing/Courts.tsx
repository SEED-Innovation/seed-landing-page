"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import SectionBadge from '../ui/SectionBadge';
const Courts = () => {
  const t = useTranslations('LandingPage.Courts');

  const courts = [
    {
      key: 'training',
      locationKey: 'jeddah',
      sessionText: t('sessions.daily'),
      image: '/acadimy.jpg' 
    },
    {
      key: 'padel',
      locationKey: 'jeddah',
      sessionText: t('sessions.courtsCount', { count: 8 }),
      image: '/court.png'
    },
    {
      key: 'tennis',
      locationKey: 'riyadh',
      sessionText: t('sessions.courtsCount', { count: 12 }),
      image: '/tinnes.png'
    }
  ];

  return (
    <section className="relative py-20 px-6 bg-white overflow-hidden">
      
      {/* --- Corner Glowing Circles --- */}
      
      {/* Top Right Glow (Soft Lavender/Purple) */}
      <div 
        className="absolute -top-[10%] -left-[5%] w-[400px] h-[400px] pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle, #6D28D914 70%, rgba(255,255,255,0) 80%)',
          filter: 'blur(80px)' 
        }}
      />

      {/* Bottom Left Glow (Soft Blue/Indigo) */}
      <div 
        className="absolute -bottom-[10%] -right-[5%] w-[500px] h-[500px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, #6D28D914 70%, rgba(255,255,255,0) 70%)',
          filter: 'blur(70px)' 
        }}
      />

      {/* Existing Top Center Background Glow */}
      <div 
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(50% 50% at 50% 0%, #F3E8FF 0%, rgba(255, 255, 255) 100%)',
          filter: 'blur(100px)' 
        }}
      />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto">
          <SectionBadge>{t('badge')}</SectionBadge>

        
        <div className="flex flex-row justify-between  md:items-end mb-12 gap-4 " >
          <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] ">
            {t('title')}
          </h2>
          
          <button className="group/btn flex items-center gap-2 text-gray-400 hover:text-purple-600 transition-colors font-medium text-sm md:text-base whitespace-nowrap cursor-pointer">
            {t('viewAll')}
            <ArrowRight className="w-4 h-4 rtl:rotate-180 transition-transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courts.map((court) => (
            <div 
              key={court.key}
              className="group relative h-[450px] rounded-[32px] overflow-hidden bg-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-3 hover:scale-[1.02] transition-all duration-500 ease-out cursor-pointer"
            >
              {/* Image Layer */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={court.image} 
                  alt={t(`items.${court.key}.name`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* Text Content Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-8 z-20 flex flex-col items-start text-white ltr:text-left rtl:text-right">
                <div className="flex items-center gap-4 text-xs font-light mb-2 opacity-80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {t(`locations.${court.locationKey}`)}
                  </span>
                  <span className="w-1 h-1 bg-white rounded-full" />
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {court.sessionText}
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  {t(`items.${court.key}.name`)}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courts;