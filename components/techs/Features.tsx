"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Camera, Cpu, Target, Activity, 
  Calendar, Smartphone, Trophy, TrendingUp 
} from 'lucide-react';
import FeatureCard from '../FeatureCard';
import SectionBadge from '../ui/SectionBadge';
import SectionTitle from '../ui/SectionTitle';
const Features = () => {
  const t = useTranslations('TechnologyPage.Features');

  const featureList = [
    { key: 'cameras4k', icon: <Camera className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'aiAnalysis', icon: <Cpu className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'shotTracking', icon: <Target className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'performance', icon: <Activity className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'booking', icon: <Calendar className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'smartApp', icon: <Smartphone className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'challenges', icon: <Trophy className="w-6 h-6 text-[#7C3AED]" /> },
    { key: 'progress', icon: <TrendingUp className="w-6 h-6 text-[#7C3AED]" /> },
  ];

  return (
    <section className="py-20 px-6  overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="text-center mb-16">
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-[#62748E] text-lg max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((feature) => (
            <FeatureCard
              key={feature.key}
              icon={feature.icon}
              title={t(`items.${feature.key}.title`)}
              description={t(`items.${feature.key}.desc`)}
              width="w-full"
              height="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;