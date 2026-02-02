"use client";
import { useTranslations, useLocale } from 'next-intl';
import { Zap, Award, TrendingUp } from 'lucide-react';
import SectionBadge from '../ui/SectionBadge';
import SectionTitle from '../ui/SectionTitle';
const Values = () => {
  const t = useTranslations('AboutPage.ValuesSection');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const values = [
    { 
      key: 'innovation', 
      icon: <Zap size={28} />, 
      color: '#7C3AED' 
    },
    { 
      key: 'quality', 
      icon: <Award size={28} />, 
      color: '#7C3AED' 
    },
    { 
      key: 'development', 
      icon: <TrendingUp size={28} />, 
      color: '#7C3AED' 
    }
  ];

  return (
    <section className={`py-24 px-6 bg-white ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle>{t('title')}</SectionTitle>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val) => (
            <div 
              key={val.key} 
              className="bg-white p-10 rounded-[32px] border border-slate-50 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col items-center text-center group transition-all hover:translate-y-[-8px]"
            >
              {/* Icon Container with Soft Purple Background */}
              <div className="w-20 h-20 rounded-full bg-[#F5F3FF] flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                <div className="text-[#7C3AED]">
                  {val.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-[#0F172A] mb-4 font-saudia">
                {t(`items.${val.key}.title`)}
              </h3>
              <p className="text-slate-500 leading-relaxed font-saudia max-w-[280px]">
                {t(`items.${val.key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;