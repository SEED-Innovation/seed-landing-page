"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { 
  Move, Lightbulb,Target, Zap, Crosshair, 
  AlertCircle, MapPin, ClipboardList, Award,
  LineChart, Cpu ,Wind , Activity, Dumbbell, 
  MessageSquare , GitCompare , ArrowUpRight , 
  CircleCheckBig
} from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const AISection = () => {
  const t = useTranslations('TechnologyPage.AISection');

  const cards = [
    {
      key: 'movement',
      icon: <Move className="w-6 h-6 text-white" />,
      points: [
        { key: 'distance', icon: <Activity className="w-4 h-4" /> },
        { key: 'speed', icon: <Wind className="w-4 h-4" /> },
        { key: 'position', icon: <MapPin className="w-4 h-4" /> },
      ]
    },

    {
      key: 'recommendations',
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      points: [
        { key: 'drills', icon: <Dumbbell className="w-4 h-4" /> },
        { key: 'tips', icon: <MessageSquare className="w-4 h-4" /> },
        { key: 'plan', icon: <ClipboardList className="w-4 h-4" /> },
      ]
    },
    {
      key: 'progress',
      icon: <LineChart className="w-6 h-6 text-white" />,
      points: [
        { key: 'comparison', icon: <GitCompare className="w-4 h-4" /> },
        { key: 'rate', icon: <ArrowUpRight className="w-4 h-4" /> },
        { key: 'achievements', icon: <Award className="w-4 h-4" /> },
      ]
    },
    {
      key: 'shot',
      icon: <Target className="w-6 h-6 text-white" />,
      points: [
        { key: 'serve', icon: <Zap className="w-4 h-4" /> },
        { key: 'accuracy', icon: <CircleCheckBig className="w-4 h-4" /> },
        { key: 'error', icon: <AlertCircle className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    <section className="relative py-24 px-6 ">
      <div className="relative z-10 max-w-7xl w-full mx-auto rounded-[40px] md:rounded-[60px] p-4 md:p-8" style={{
          background: 'linear-gradient(135deg, rgba(127, 34, 254, 0.05) 0%, rgba(200, 0, 222, 0.05) 100%)',
        }}>
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE9FE]  border-purple-100 text-[#7C3AED] text-sm font-bold mb-6">
            <Cpu className="w-4 h-4" />
            {t('badge')}
          </div>
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-[#62748E] text-lg max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* AI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div 
              key={card.key}
              className="bg-[#1E293B] rounded-[32px] p-8 md:p-6  flex flex-col h-full hover:translate-y-[-8px] transition-all duration-500 group border border-slate-700/50"
            >
            <div className=' min-h-[48px] md:h-[220px]'>
                {/* Icon with Gradient Glow */}
                <div className="w-14 h-14 bg-gradient-to-br from-[#8E51FF] to-[#C800DE] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                    {card.icon}
                </div>

                <h3 className="text-2xl font-bold text-white mb-4 ltr:text-left rtl:text-right">
                    {t(`cards.${card.key}.title`)}
                </h3>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed ltr:text-left rtl:text-right">
                    {t(`cards.${card.key}.desc`)}
                </p>
            </div>

              {/* Analytical Points List */}
              <div className="mt-0 space-y-5 pt-4 border-t border-slate-700/50">
                {card.points.map((point) => (
                  <div key={point.key} className="flex items-center gap-4 group/point">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#A855F7] transition-colors group-hover:bg-[#A855F7] group-hover:text-white border border-slate-700">
                      {point.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {t(`cards.${card.key}.points.${point.key}`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AISection;