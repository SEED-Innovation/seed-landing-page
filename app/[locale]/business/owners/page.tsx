"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Building2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

const OwnersPage = () => {
  const t = useTranslations('BusinessPage.OwnersPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className={`min-h-screen bg-[#F8FAFC] py-12 px-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Reusable Back Button */}
        <BackButton />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-3xl flex items-center justify-center mb-8 shadow-sm">
            <Building2 className="w-10 h-10 text-[#2563EB]" />
          </div>
          <h1 className={`text-4xl md:text-5xl font-black text-[#0F172A] mb-4 ${isRtl ? 'font-saudia' : ''}`}>
            {t('title')}
          </h1>
          <p className={`text-slate-500 text-lg max-w-2xl leading-relaxed ${isRtl ? 'font-saudia' : ''}`}>
            {t('description')}
          </p>
        </div>

        {/* Registration Form Container */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_rgba(37,99,235,0.15)] border border-slate-50 max-w-4xl mx-auto">
          <form className={`space-y-8 ${isRtl ? 'font-saudia text-right' : 'text-left'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              
              {/* Facility Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.facilityName')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.city')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              {/* Number of Courts */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.courtsCount')}</label>
                <input type="number" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.contactPerson')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.mobile')}</label>
                <input type="tel" dir="ltr" placeholder={t('form.placeholder.mobile')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all ltr:text-left rtl:text-right" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.email')}</label>
                <input type="email" dir="ltr" placeholder={t('form.placeholder.email')} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left" />
              </div>

            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-4">
              {t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnersPage;