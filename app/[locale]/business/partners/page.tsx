"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Handshake } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import SectionTitle from '@/components/ui/SectionTitle';
import BusinessForm from '@/components/BusinessForm';
import { PartnersSchema } from '@/schemas/business';

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
          <SectionTitle>{t('title')}</SectionTitle>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Partnership Form Container */}
        <BusinessForm 
          type="Partners"
          schema={PartnersSchema}
          accentColor="#16A34A"
          shadowColor="rgba(22, 163, 74, 0.15)"
          fields={[
            { name: 'entityName', labelKey: 'entityName' },
            { name: 'partnerType', labelKey: 'partnerType' },
            { name: 'contactPerson', labelKey: 'contactPerson' },
            { name: 'mobile', labelKey: 'mobile', type: 'tel' },
            { name: 'email', labelKey: 'email', type: 'email', fullWidth: true },
            { name: 'details', labelKey: 'details', type: 'textarea', fullWidth: true },
          ]}
        />
      </div>
    </div>
  );
};

export default PartnersPage;