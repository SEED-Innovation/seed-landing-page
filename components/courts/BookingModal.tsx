"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { DayPicker } from 'react-day-picker';
import { format, startOfToday } from 'date-fns';
import { X, User, Phone, Mail, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { BookingSchema, BookingData } from '@/schemas/booking';
import 'react-day-picker/dist/style.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtName: string;
  price: number;
}

const BookingModal = ({ isOpen, onClose, courtName, price }: BookingModalProps) => {
  const t = useTranslations('CourtsPage.BookingModal');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<BookingData>({
    resolver: zodResolver(BookingSchema),
  });

  const taxAmount = price * 0.15;
  const totalAmount = price + taxAmount;
  const selectedDate = watch("bookingDate");

  const onSubmit = async (data: BookingData) => {
    // data.bookingDate will be a native JS Date object
    console.log("Validated Data:", data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden max-h-[95vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex justify-between items-start sticky top-0 bg-white z-20">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{t('title')}</h2>
                <p className="text-slate-400 text-sm mt-1">{courtName}</p>
              </div>
              <button onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-8 pb-8 space-y-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700 px-1">{t('form.nameLabel')}</label>
                  <div className="relative">
                    <input {...register('fullName')} type="text" placeholder={t('form.placeholderName')} className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800" />
                    <User className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                  </div>
                </div>

                {/* Mobile & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 px-1">{t('form.phoneLabel')}</label>
                    <div className="relative">
                      <input 
                        {...register('phoneNumber')} 
                        type="tel" 
                        dir="ltr"
                        placeholder="05xxxxxxxx" 
                        className={`w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800 ${isRtl ? 'text-right placeholder:text-right' : 'text-left'}`} 
                      />
                      <Phone className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700 px-1">{t('form.emailLabel')}</label>
                    <div className="relative">
                      <input {...register('email')} type="email" placeholder="mail@example.com" className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#7C3AED] outline-none text-slate-800" />
                      <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'left-4' : 'right-4'}`} size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced City Selector */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 px-1">{t('form.cityLabel')}</label>
                <div className="relative">
                  <select {...register('city')} className="w-full bg-[#F8FAFC] border-none rounded-2xl py-4 px-5 appearance-none outline-none text-slate-600 font-medium cursor-pointer focus:ring-2 focus:ring-[#7C3AED]">
                    <option value="">{t('form.placeholderCity')}</option>
                    <option value="Jeddah">{isRtl ? 'جدة' : 'Jeddah'}</option>
                    <option value="Riyadh">{isRtl ? 'الرياض' : 'Riyadh'}</option>
                  </select>
                  <ChevronDown className={`absolute top-1/2 -translate-y-1/2 text-[#7C3AED] ${isRtl ? 'left-5' : 'right-5'}`} size={20} />
                </div>
              </div>

              {/* Performant Library Calendar */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 px-1">{t('form.dateLabel')}</label>
                <div className="flex justify-center bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm">
                  <Controller
                    control={control}
                    name="bookingDate"
                    render={({ field }) => (
                      <DayPicker
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={{ before: startOfToday() }}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        modifiersClassNames={{
                          selected: 'selected-day'
                        }}
                      />
                    )}
                  />
                </div>
                {errors.bookingDate && <p className="text-red-500 text-xs px-1">{errors.bookingDate.message}</p>}
              </div>

              {/* Price Summary */}
              <div className="bg-[#F8FAFC] rounded-[24px] p-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{t('summary.price')}</span>
                  <span className="text-slate-900 font-bold">{price} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-medium">{t('summary.tax')}</span>
                  <span className="text-slate-900 font-bold">{taxAmount.toFixed(2)} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-slate-900 font-bold text-lg">{t('summary.total')}</span>
                  <span className="text-[#7C3AED] font-bold text-xl">{totalAmount.toFixed(2)} {isRtl ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#7C3AED] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#6D28D9] transition-all active:scale-[0.98] shadow-lg shadow-purple-100 cursor-pointer disabled:opacity-50">
                {isSubmitting ? "..." : t('form.submit')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;