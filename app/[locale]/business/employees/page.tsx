"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link , useRouter} from '@/i18n/routing';
import { Users2, CalendarDays, Wallet2, ChevronLeft, ChevronRight } from 'lucide-react';
import BackButton from '@/components/ui/BackButton';
import SectionBadge from '@/components/ui/SectionBadge';
import SectionTitle from '@/components/ui/SectionTitle';
import BusinessForm from '@/components/BusinessForm';
import { EmployeesSchema } from '@/schemas/business';
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
            <div key={item.key} className=" p-8 rounded-[32px] border border-slate-100 text-center shadow-sm hover:shadow-md transition-all duration-300 group">
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
        <BusinessForm 
          type="Employees"
          schema={EmployeesSchema}
          accentColor="#7C3AED"
          shadowColor="rgba(124,58,237,0.15)"
          fields={[
            { name: 'companyName', labelKey: 'companyName', placeholderKey: 'placeholder.company' },
            { name: 'employeesCount', labelKey: 'employeesCount', placeholderKey: 'placeholder.employees' },
            { name: 'contactPerson', labelKey: 'contactPerson', placeholderKey: 'placeholder.name' },
            { name: 'email', labelKey: 'email', placeholderKey: 'placeholder.email', type: 'email' },
            { name: 'details', labelKey: 'details', placeholderKey: 'placeholder.details', type: 'textarea', fullWidth: true },
          ]}
          showTitle={true}
        />
      </div>
    </div>
  );
};

export default EmployeesPage;