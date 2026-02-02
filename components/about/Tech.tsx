"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Camera, Cpu, Clock } from 'lucide-react';
import SectionBadge from '../ui/SectionBadge';
import SectionTitle from '../ui/SectionTitle';
const Tech = () => {
  const t = useTranslations('AboutPage.TechSection');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const techItems = [
    { 
      key: 'cameras', 
      icon: <Camera size={32} />, 
      id: '4K' 
    },
    { 
      key: 'ai', 
      icon: <Cpu size={32} />, 
      id: 'AI' 
    },
    { 
      key: 'booking', 
      icon: <Clock size={32} />, 
      id: '24/7' 
    }
  ];

  // Reordering for RTL if necessary to match the visual flow of your screenshots
  const items = isRtl ? [...techItems].reverse() : techItems;

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto bg-[#0F172A] rounded-[48px] p-8 py-12 md:p-20 text-center relative overflow-hidden">
        
        {/* Header */}
        <div className="relative z-10 mb-16 ">
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle className='text-white'>{t('title')}</SectionTitle>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {items.map((item) => (
            <div key={item.key} className="bg-[#1E293B]/40 border border-white/5 p-10  rounded-[32px] flex flex-col items-center group hover:bg-[#1E293B]/60 transition-all">
              
              {/* Glowing Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7F22FE] to-[#C800DE] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(127,34,254,0.5)] transition-transform group-hover:scale-110">
                <div className="text-white">
                  {item.icon}
                </div>
              </div>

              <h3 className="text-3xl font-black text-white mb-3 font-saudia">
                {t(`items.${item.key}.title`)}
              </h3>
              <p className="text-slate-400 font-bold font-saudia text-md uppercase tracking-wide">
                {t(`items.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#7C3AED]/5 blur-[120px] pointer-events-none" />
      </div>
    </section>
  );
};

export default Tech;