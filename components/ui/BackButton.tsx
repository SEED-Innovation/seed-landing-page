"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BackButton = () => {
  const t = useTranslations('BusinessPage.EmployeesPage');
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';

  return (
    <div className="flex justify-start mb-8 mt-8">
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-[#7C3AED] transition-colors font-bold group cursor-pointer border-none bg-transparent"
      >
        <div className={`transition-transform duration-300 ${isRtl ? 'group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
          {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </div>
        <span className={isRtl ? 'font-saudia' : ''}>
          {t('back')}
        </span>
      </button>
    </div>
  );
};

export default BackButton;