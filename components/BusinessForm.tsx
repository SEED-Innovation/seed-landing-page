"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations, useLocale } from 'next-intl';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import DOMPurify from 'dompurify';

interface FieldConfig {
  name: string;
  labelKey: string;
  placeholderKey?: string;
  type?: string;
  fullWidth?: boolean;
}

interface BusinessFormProps {
  type: 'Employees' | 'Partners' | 'Owners';
  schema: any;
  accentColor: string;
  shadowColor: string;
  fields: FieldConfig[];
  showTitle?: boolean;
}

// Court type select options — bilingual, maps to API enum values
const COURT_TYPE_OPTIONS = [
  { value: 'tennis', en: 'Tennis', ar: 'تنس'    },
  { value: 'padel',  en: 'Padel',  ar: 'بادل'   },
  { value: 'both',   en: 'Both',   ar: 'كلاهما' },
];

const clean = (val?: string): string =>
  val ? DOMPurify.sanitize(val.trim()) : '';

const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\s|-/g, '');
  if (digits.startsWith('05') && digits.length === 10) {
    return `+966${digits.slice(1)}`;
  }
  return digits;
};

const BusinessForm = ({
  type,
  schema,
  accentColor,
  shadowColor,
  fields,
  showTitle = false,
}: BusinessFormProps) => {
  const t = useTranslations(`BusinessPage.${type}Page.form`);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [status, setStatus]             = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,                                          // ← added
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  // ─── Payload builder ────────────────────────────────────────────────────────
  const buildPayload = (data: any): { endpoint: string; payload: object } => {
    if (type === 'Owners') {
      return {
        endpoint: '/organizer/apply',
        payload: {
          name:     clean(data.contactPerson),  // 2-100 chars
          facility: clean(data.facilityName),   // 2-200 chars
          courts:   Number(data.courtsCount),   // min 1, integer
          type:     data.courtType,             // 'tennis' | 'padel' | 'both'
          email:    data.email,
          phone:    normalizePhone(data.mobile),
          message:  clean(data.message),        // required, max 2000 chars
        },
      };
    }

    if (type === 'Partners') {
      return {
        endpoint: '/contact',
        payload: {
          name:    clean(data.contactPerson),   // 2-100 chars
          email:   data.email,
          subject: `Partner Inquiry: ${clean(data.entityName)}`.slice(0, 200),
          message: [
            `Entity Name: ${clean(data.entityName)}`,
            `Partner Type: ${clean(data.partnerType)}`,
            `Mobile: ${clean(data.mobile)}`,
            `Details: ${clean(data.details)}`,
          ].join('\n'),
        },
      };
    }

    // Employees
    return {
      endpoint: '/contact',
      payload: {
        name:    clean(data.contactPerson),     // 2-100 chars
        email:   data.email,
        subject: `Employee Benefit Inquiry: ${clean(data.companyName)}`.slice(0, 200),
        message: [
          `Company Name: ${clean(data.companyName)}`,
          `Employee Count: ${data.employeesCount}`,
          `Mobile: ${clean(data.mobile)}`,
          `Details: ${clean(data.details)}`,
        ].join('\n'),
      },
    };
  };

  // ─── Submit handler ──────────────────────────────────────────────────────────
  const onSubmit = async (data: any) => {
    setStatus('idle');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const { endpoint, payload } = buildPayload(data);
    try {
       await axios.post(`${baseUrl}${endpoint}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept':       'application/json',
        },
      });
      setStatus('success');
      reset();                                
    } catch (error: any) {
      setStatus('error');
      const apiErrors = error.response?.data?.errors;
      setErrorMessage(
        apiErrors
          ? apiErrors.join(' | ')
          : error.response?.data?.message || 'Submission Failed',
      );
    }
  };
  // ─── Shared input class builder ──────────────────────────────────────────────
  const inputClass = (fieldName: string) =>
    `w-full p-4 rounded-xl bg-slate-50 border outline-none transition-all focus:ring-2 ${
      errors[fieldName] ? 'border-red-400 ring-red-100' : 'border-slate-100'
    }`;

  // ─── Field renderer ──────────────────────────────────────────────────────────
  const renderField = (field: FieldConfig) => {
    const sharedProps = {
      ...register(field.name),
      className: inputClass(field.name),
      style: { '--tw-ring-color': accentColor } as React.CSSProperties,
    };

    if (field.type === 'select') {
      return (
        <div className="relative">
          <select
            {...sharedProps}
            defaultValue=""
            className={`${inputClass(field.name)} appearance-none pr-10`}
          >
            <option value="" disabled>
              {isRtl ? 'اختر نوع الملاعب' : 'Select court type'}
            </option>
            {COURT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {isRtl ? opt.ar : opt.en}
              </option>
            ))}
          </select>
          <ChevronDown
            size={18}
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400"
            style={{ [isRtl ? 'left' : 'right']: '1rem' }}
          />
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          {...register(field.name)}
          rows={4}
          dir={isRtl ? 'rtl' : 'ltr'}
          placeholder={field.placeholderKey ? t(field.placeholderKey) : ''}
          className={`${inputClass(field.name)} resize-none`}
          style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
        />
      );
    }

    // Default: text / email / tel / number
    return (
      <input
        {...register(field.name)}
        type={field.type || 'text'}
        dir={
          field.name === 'email' || field.name === 'mobile'
            ? 'ltr'
            : isRtl
            ? 'rtl'
            : 'ltr'
        }
        placeholder={field.placeholderKey ? t(field.placeholderKey) : ''}
        className={inputClass(field.name)}
        style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
      />
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative bg-white rounded-[40px] p-8 md:p-12 border border-slate-50 max-w-4xl mx-auto transition-all"
      style={{ boxShadow: `0 30px 60px ${shadowColor}` }}
    >
      {showTitle && (
        <h2
          className={`text-3xl font-bold text-[#0F172A] text-center mb-10 ${
            isRtl ? 'font-saudia' : ''
          }`}
        >
          {t('title')}
        </h2>
      )}

      {/* ── Inline status banners (success / error) ── */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-3 text-green-700 text-sm font-bold mb-6"
          >
            <CheckCircle2 size={20} className="shrink-0" />
            {isRtl
              ? 'تم الإرسال بنجاح! سنتواصل معك قريباً.'
              : "Sent successfully! We'll get back to you soon."}
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold mb-6"
          >
            <AlertCircle size={20} className="shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Form (always visible) ── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}
      >
        {/* Fields grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`space-y-2 ${field.fullWidth ? 'md:col-span-2' : ''}`}
            >
              <label className="text-sm font-bold text-slate-700 block">
                {t(field.labelKey)}
              </label>

              {renderField(field)}

              {errors[field.name] && (
                <span className="text-red-500 text-xs font-bold">
                  {errors[field.name]?.message as string}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-white font-bold py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
          style={{ backgroundColor: accentColor }}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            t('submit')
          )}
        </button>
      </form>
    </div>
  );
};

export default BusinessForm;