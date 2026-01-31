"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Handshake } from 'lucide-react';
import BackButton from '@/components/BackButton';

const PartnersPage = () => {
  const t = useTranslations('BusinessPage.PartnersPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div className={`min-h-screen bg-[#F8FAFC] py-12 px-6 ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Reusable Back Button */}
        <BackButton />

        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-12 font-saudia">
          <div className="w-20 h-20 bg-[#F0FDF4] rounded-3xl flex items-center justify-center mb-8 shadow-sm">
            <Handshake className="w-10 h-10 text-[#16A34A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-4 leading-tight">
            {t('title')}
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Partnership Form Container */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_30px_60px_rgba(22,163,74,0.15)] border border-slate-50 max-w-4xl mx-auto font-saudia">
          <form className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Entity Name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.entityName')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>

              {/* Partnership Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.partnerType')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>

              {/* Contact Person */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.contactPerson')}</label>
                <input type="text" dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all" />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 block">{t('form.mobile')}</label>
                <input type="tel" dir="ltr" placeholder="05xxxxxxxx" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all ltr:text-left rtl:text-right" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">{t('form.email')}</label>
              <input type="email" dir="ltr" placeholder="name@company.com" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all text-left" />
            </div>

            {/* Proposal Details */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">{t('form.details')}</label>
              <textarea rows={5} dir={isRtl ? 'rtl' : 'ltr'} className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white font-black py-5 rounded-2xl shadow-lg shadow-green-100 transition-all active:scale-[0.98] mt-4">
              {t('form.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnersPage;