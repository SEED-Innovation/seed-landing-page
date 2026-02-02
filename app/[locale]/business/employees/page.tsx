"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link , useRouter} from '@/i18n/routing';
import { Users2, CalendarDays, Wallet2, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '@/components/BackButton';
import SectionBadge from '@/components/ui/SectionBadge';
import SectionTitle from '@/components/ui/SectionTitle';

const EmployeesPage = () => {
  const t = useTranslations('BusinessPage.EmployeesPage');
  const locale = useLocale();
  const router = useRouter(); 
  const isRtl = locale === 'ar';

  const benefits = [
    { 
      key: 'team', 
      icon: <Users2 />, 
      color: '#16A34A', // Green
      bg: 'rgba(22, 163, 74, 0.1)' 
    },
    { 
      key: 'priority', 
      icon: <CalendarDays />, 
      color: '#2563EB', // Blue
      bg: 'rgba(37, 99, 235, 0.1)' 
    },
    { 
      key: 'rates', 
      icon: <Wallet2 />, 
      color: '#A855F7', // Purple
      bg: 'rgba(168, 85, 247, 0.1)' 
    }
  ];

  return (
    <div className={`min-h-screen bg-[#F8FAFC] py-12 px-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-6xl mx-auto">

        <BackButton/>
        {/* Header Section */}
        <div className={`text-center mb-16 ${isRtl ? 'font-saudia' : ''}`}>
          <SectionBadge>{t('badge')}</SectionBadge>
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Benefits Grid with Glowing Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((item) => (
            <div key={item.key} className="bg-white p-8 rounded-[32px] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: item.bg,
                  boxShadow: `0 10px 20px -5px ${item.color}33`, // Subtle color-matched glow
                }}
              >
                {React.cloneElement(item.icon, { 
                  className: "w-8 h-8", 
                  style: { color: item.color } 
                })}
              </div>
              <h3 className={`text-xl font-bold text-[#0F172A] mb-3 ${isRtl ? 'font-saudia' : ''}`}>
                {t(`benefits.${item.key}.title`)}
              </h3>
              <p className={`text-slate-500 text-sm leading-relaxed ${isRtl ? 'font-saudia' : ''}`}>
                {t(`benefits.${item.key}.desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Quote Form Container */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_rgba(124,58,237,0.15)] border border-slate-50 max-w-4xl mx-auto">
          <h2 className={`text-3xl font-bold text-[#0F172A] text-center mb-10 ${isRtl ? 'font-saudia' : ''}`}>
            {t('form.title')}
          </h2>
          
          <form className={`space-y-6 ${isRtl ? 'font-saudia text-right' : 'text-left'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.companyName')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} placeholder={t('form.placeholder.company')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.employeesCount')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} placeholder={t('form.placeholder.employees')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.contactPerson')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} placeholder={t('form.placeholder.name')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.email')}</label>
                <input type="email" dir="ltr" placeholder={t('form.placeholder.email')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all text-left" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">{t('form.details')}</label>
              <textarea rows={4} dir={isRtl ? 'rtl' : 'ltr'} placeholder={t('form.placeholder.details')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"></textarea>
            </div>

            <button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black py-5 rounded-2xl shadow-lg shadow-purple-200 transition-all active:scale-[0.98]">
              {t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;