"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Building2 } from 'lucide-react';
import BackButton from '@/components/BackButton';
import SectionTitle from '@/components/ui/SectionTitle';
import BusinessForm from '@/components/BusinessForm';
import { OwnersSchema } from '@/schemas/business';

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
          <SectionTitle>{t('title')}</SectionTitle>

          <p className={`text-slate-500 text-lg max-w-2xl leading-relaxed ${isRtl ? 'font-saudia' : ''}`}>
            {t('description')}
          </p>
        </div>

        {/* Registration Form Container */}
        <BusinessForm 
          type="Owners"
          schema={OwnersSchema}
          accentColor="#2563EB"
          shadowColor="rgba(37, 99, 235, 0.15)"
          fields={[
            { name: 'facilityName', labelKey: 'facilityName' },
            { name: 'city', labelKey: 'city' },
            { name: 'courtsCount', labelKey: 'courtsCount', type: 'number' },
            { name: 'contactPerson', labelKey: 'contactPerson' },
            { name: 'mobile', labelKey: 'mobile', type: 'tel', placeholderKey: 'placeholder.mobile' },
            { name: 'email', labelKey: 'email', type: 'email', placeholderKey: 'placeholder.email' },
          ]}
        />
      </div>
    </div>
  );
};

export default OwnersPage;