"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Handshake, Building2, Users2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocale } from 'next-intl';

const BusinessPage = () => {
  const t = useTranslations('BusinessPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const businessCards = [
    {
      key: 'employees',
      path: '/business/employees',
      icon: <Users2 className="w-6 h-6 text-[#A855F7]" />,
      iconBg: 'bg-[#F3E8FF]',
      linkColor: 'text-[#A855F7]'
    },
    {
      key: 'owner',
      path: '/business/owners',
      icon: <Building2 className="w-6 h-6 text-[#2563EB]" />,
      iconBg: 'bg-[#EFF6FF]',
      linkColor: 'text-[#2563EB]'
    },
    {
      key: 'partner',
      path: '/business/partners',
      icon: <Handshake className="w-6 h-6 text-[#16A34A]" />,
      iconBg: 'bg-[#F0FDF4]',
      linkColor: 'text-[#16A34A]'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 font-saudia">
          <span className="text-[#7C3AED] font-bold text-sm tracking-[0.2em] uppercase block mb-4">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#0F172A] mb-6 leading-tight">
            {t('title')}
          </h1>
          <p className="text-[#62748E] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Business Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessCards.map((card) => (
            <Link 
              key={card.key}
              href={card.path}
              className="bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] 
                         border border-slate-50 flex flex-col items-center text-center 
                         cursor-pointer transition-all duration-500 ease-out
                         hover:shadow-[0_30px_60px_rgba(124,58,237,0.12)] hover:-translate-y-3 group"
            >
              {/* Icon Container with Animation */}
              <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-8 
                               transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6`}>
                {card.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-bold text-[#0F172A] mb-4">
                {t(`cards.${card.key}.title`)}
              </h3>
              <p className="text-[#62748E] text-base leading-relaxed mb-10 min-h-[48px]">
                {t(`cards.${card.key}.desc`)}
              </p>

              {/* Action Label with Sliding Arrow */}
              <div className={`mt-auto flex items-center gap-2 font-bold text-lg ${card.linkColor} 
                                 transition-all duration-300 group-hover:brightness-90`}>
                <span className="uppercase tracking-wide">{t(`cards.${card.key}.link`)}</span>
                
                <div className={`transition-transform duration-300 
                                ${isRtl ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`}>
                  {isRtl ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BusinessPage;