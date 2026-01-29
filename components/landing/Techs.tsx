"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Activity, Target, Cpu, Camera } from 'lucide-react';
import FeatureCard from '../FeatureCard'; // Import the new card

const Techs = () => {
  const t = useTranslations('LandingPage.Techs');

  const techs = [
    {
      key: 'liveStats',
      icon: <Activity className="w-6 h-6 text-[#7C3AED]" />,
    },
    {
      key: 'shotTracking',
      icon: <Target className="w-6 h-6 text-[#7C3AED]" />,
    },
    {
      key: 'aiAnalysis',
      icon: <Cpu className="w-6 h-6 text-[#7C3AED]" />,
    },
    {
      key: 'cameras4k',
      icon: <Camera className="w-6 h-6 text-[#7C3AED]" />,
    },
  ];

  return (
    <section 
      className="py-20 px-6 md:py-28"
      style={{
        backgroundImage: 'radial-gradient(80% 40% at 50% 30%, rgba(243, 232, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)',
        backgroundColor: '#FFFFFF'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
            <span className="text-[#7C3AED] font-bold text-lg md:text-2xl tracking-widest uppercase">
                {t('badge')}
            </span>
            <h2 className="text-4xl md:text-6xl font-black mt-2 md:mt-4 text-[#0F172A] leading-tight"> 
                {t('title')}
            </h2>
            <p className="mt-4 text-[#62748E] max-w-2xl mx-auto text-lg leading-relaxed px-2">
              {t.rich('description', { 
                highlight: (chunks) => <span className="text-slate-900 font-bold bg-[#D9F99D] px-1">{chunks}</span> 
              })}
            </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {techs.map((tech) => (
            <FeatureCard
              key={tech.key}
              icon={tech.icon}
              title={t(`items.${tech.key}.title`)}
              description={t(`items.${tech.key}.desc`)}
              width="w-full"
              height="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Techs;