"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';

interface BusinessFormProps {
  type: 'Employees' | 'Partners' | 'Owners';
  schema: any;
  accentColor: string;
  shadowColor: string;
  fields: { name: string; labelKey: string; placeholderKey?: string; type?: string; fullWidth?: boolean }[];
  showTitle?: boolean;
}

const BusinessForm = ({ type, schema, accentColor, shadowColor, fields,showTitle = false }: BusinessFormProps) => {
  const t = useTranslations(`BusinessPage.${type}Page.form`);
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: any) => {
    try {
      // Logic to send to your API
      await axios.post('/api/business/inquiry', { ...data, formType: type });
      alert("Sent Successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div 
      className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-50 max-w-4xl mx-auto transition-all"
      style={{ boxShadow: `0 30px 60px ${shadowColor}` }}
    >
        {showTitle && (
        <h2 className={`text-3xl font-bold text-[#0F172A] text-center mb-10 ${isRtl ? 'font-saudia' : ''}`}>
        {t('title')}
        </h2>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
                <div key={field.name} className={`space-y-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}>
                <label className="text-sm font-bold text-slate-700 block">{t(field.labelKey)}</label>
                {field.type === 'textarea' ? (
                    <textarea
                    {...register(field.name)}
                    rows={4}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none transition-all resize-none focus:ring-2"
                    style={{ '--tw-ring-color': accentColor } as any}
                    />
                ) : (
                    <input
                    {...register(field.name)}
                    type={field.type || 'text'}
                    dir={field.name === 'email' ? 'ltr' : (isRtl ? 'rtl' : 'ltr')}
                    placeholder={field.placeholderKey ? t(field.placeholderKey) : ''}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 outline-none transition-all focus:ring-2"
                    style={{ '--tw-ring-color': accentColor } as any}
                    />
                )}
                {errors[field.name] && <span className="text-red-500 text-xs">{errors[field.name]?.message as string}</span>}
                </div>
            ))}
            </div>

            <button 
            disabled={isSubmitting}
            type="submit" 
            className="w-full text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 hover:cursor-pointer"
            style={{ backgroundColor: accentColor }}
            >
            {isSubmitting ? "..." : t('submit')}
            </button>
        </form>
    </div>
  );
};

export default BusinessForm;