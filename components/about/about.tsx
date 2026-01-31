"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { MapPin, Users, Calendar, Star, Eye, Target } from 'lucide-react';
import Counter from '../Counter';
const About = () => {
  const t = useTranslations('AboutPage.AboutSection');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const stats = [
    { key: 'courts', value: '50+', icon: <MapPin className="text-[#7C3AED]" /> },
    { key: 'players', value: '10K+', icon: <Users className="text-[#7C3AED]" /> },
    { key: 'bookings', value: '100K+', icon: <Calendar className="text-[#7C3AED]" /> },
    { key: 'rating', value: '4.9', icon: <Star className="text-[#7C3AED]" /> },
  ];

  return (
    <div className={`min-h-screen bg-white py-20 px-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20 font-saudia">
          <span className="text-[#7C3AED] font-bold text-sm tracking-widest uppercase mb-4 block">
            {t('Hero.badge')}
          </span>
           <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] mb-8 leading-tight">
          {isRtl ? (
            <>
              نعيد تعريف{" "}
              <span className="bg-gradient-to-r from-[#7F22FE] to-[#C800DE] bg-clip-text text-transparent">
                الرياضة الذكية
              </span>
            </>
          ) : (
            <>
              Redefining{" "}
              <span className="bg-gradient-to-r from-[#7F22FE] to-[#C800DE] bg-clip-text text-transparent">
                Smart Sports
              </span>
            </>
          )}
        </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            {t('Hero.description')}
          </p>
        </div>

        {/* Stats Grid with Animated Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat) => (
            <div key={stat.key} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-[#F5F3FF] rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                {stat.icon}
              </div>
              <span className="text-3xl font-black text-[#0F172A] mb-2">
                <Counter value={stat.value} />
              </span>
              <span className="text-slate-400 font-bold font-saudia">
                {t(`Stats.${stat.key}`)}
              </span>
            </div>
          ))}
        </div>

{/* Vision & Mission Section */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-saudia">
  
  {/* Card 1: Vision (Glow in Top Right) */}
  <div className="relative overflow-hidden bg-[#0F172A] rounded-[48px] p-10 md:p-16 group border border-white/5 shadow-2xl">
    {/* Radial Glow - Top Right */}
    <div 
      className="absolute -top-24 -right-24 w-96 h-96 blur-[100px] pointer-events-none rounded-full"
      style={{ backgroundColor: 'rgba(127, 34, 254, 0.2)' }} // #7F22FE at 20%
    />
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
        <Eye className="text-[#A684FF]" size={28} />
      </div>
      <h2 className="text-3xl font-black text-white mb-6">{t('VisionMission.vision.title')}</h2>
      <p className="text-slate-400 text-lg leading-relaxed">
        {t('VisionMission.vision.desc')}
      </p>
    </div>
  </div>

    {/* Card 2: Mission (Magenta Glow pinned to Bottom-Start Corner) */}
    <div className="relative overflow-hidden bg-[#0F172A] rounded-[48px] p-8 md:p-16 group border border-white/5 shadow-2xl">
    
    {/* Responsive Radial Glow - Bottom Left (LTR) / Bottom Right (RTL) */}
    <div 
        className={`absolute w-64 h-64 md:w-96 md:h-96 blur-[80px] md:blur-[120px] pointer-events-none rounded-full
        -bottom-16 md:-bottom-32 
        ${isRtl ? '-right-16 md:-right-32' : '-left-16 md:-left-32'}`}
        style={{ backgroundColor: 'rgba(200, 0, 222, 0.2)' }} // #C800DE at 20%
    />
    
    <div className="relative z-10">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-transform group-hover:scale-110">
        <Target className="text-[#C800DE]" size={28} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 md:mb-6 font-saudia">
        {t('VisionMission.mission.title')}
        </h2>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed font-saudia">
        {t('VisionMission.mission.desc')}
        </p>
    </div>
    </div>
</div>
      </div>
    </div>
  );
};

export default About;