"use client";

import React, { useState, useEffect, Fragment } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
// Headless UI provides the logic for the professional floating menu
import { Listbox, Transition } from '@headlessui/react';
import { DatePicker } from "@heroui/date-picker";
import { today, getLocalTimeZone, now, CalendarDate } from "@internationalized/date";
import { X, User, Phone, Mail, ChevronDown, Clock, CalendarDays, MapPin, Check } from 'lucide-react';
import { BookingSchema, type BookingData } from '@/schemas/booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtName: string;
  price: number;
}

// City options matching your design reference
const cities = [
  { label: "الرياض", value: "Riyadh" },
  { label: "جدة", value: "Jeddah" },
  { label: "الدمام", value: "Dammam" },
  { label: "العلا", value: "AlUla" },
];

const allTimeSlots = [
  { label: "08:00 - 10:00", value: "08-10", startHour: 8 },
  { label: "10:00 - 12:00", value: "10-12", startHour: 10 },
  { label: "12:00 - 14:00", value: "12-14", startHour: 12 },
  { label: "14:00 - 16:00", value: "14-16", startHour: 14 },
  { label: "16:00 - 18:00", value: "16-18", startHour: 16 },
  { label: "18:00 - 20:00", value: "18-20", startHour: 18 },
  { label: "20:00 - 22:00", value: "20-22", startHour: 20 },
];

const BookingModal = ({ isOpen, onClose, courtName, price }: BookingModalProps) => {
  const t = useTranslations('CourtsPage.BookingModal');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [disabledSlots, setDisabledSlots] = useState<string[]>([]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const { register, handleSubmit, control, watch, setValue, formState: { errors, isSubmitting } } = useForm<BookingData>({
    resolver: zodResolver(BookingSchema),
    mode: "onTouched", 
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      city: "",
      timeSlot: "",
      bookingDate: undefined as unknown as CalendarDate
    }
  });

  const selectedDate = watch("bookingDate");
  const selectedTime = watch("timeSlot");

  // Disable past time slots if today is selected
  useEffect(() => {
    if (selectedDate) {
      const bookedFromAPI: string[] = []; 
      const nowTime = now(getLocalTimeZone());
      const isToday = selectedDate.compare(today(getLocalTimeZone())) === 0;
      
      const expiredSlots: string[] = [];
      if (isToday) {
        allTimeSlots.forEach(slot => {
          if (nowTime.hour >= slot.startHour) {
            expiredSlots.push(slot.value);
          }
        });
      }
      setDisabledSlots([...bookedFromAPI, ...expiredSlots]);
      setValue("timeSlot", ""); 
    }
  }, [selectedDate, setValue]);

  const vatAmount = price * 0.15;
  const totalAmount = price + vatAmount;

  const onSubmit: SubmitHandler<BookingData> = async (data) => {
    console.log("Final Payload:", { ...data, date: data.bookingDate.toString() });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-100 bg-white sticky top-0 z-30">
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{t('title')}</h2>
                <div className={`flex items-center gap-2 text-[#7C3AED] mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <MapPin size={14} />
                   <span className="text-sm font-bold">{courtName}</span>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 px-1 block ltr:text-left rtl:text-right">{t('form.nameLabel')}</label>
                  <div className="relative group">
                    <input 
                      {...register('fullName')} 
                      type="text" 
                      placeholder={t('form.placeholderName')} 
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${errors.fullName ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'} ltr:text-left rtl:text-right`} 
                    />
                    <User className={`absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7C3AED] transition-colors ${isRtl ? 'left-5' : 'right-5'}`} size={18} />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs font-bold px-2">{errors.fullName.message}</p>}
                </div>

                {/* Contact Info Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 px-1 block ltr:text-left rtl:text-right">{t('form.phoneLabel')}</label>
                    <input 
                      {...register('phoneNumber')} 
                      type="tel" 
                      dir="ltr" 
                      placeholder="05xxxxxxxx" 
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${errors.phoneNumber ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'} ${isRtl ? 'text-right' : ''}`} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 px-1 block ltr:text-left rtl:text-right">{t('form.emailLabel')}</label>
                    <input 
                      {...register('email')} 
                      type="email" 
                      placeholder="mail@example.com" 
                      className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'} ltr:text-left rtl:text-right`} 
                    />
                  </div>
                </div>

                {/* City & Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Custom City Selector (Headless UI) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 px-1 block ltr:text-left rtl:text-right">{t('form.cityLabel')}</label>
                    <Controller
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <Listbox value={field.value} onChange={field.onChange}>
                          <div className="relative">
                            <Listbox.Button className={`relative w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 flex items-center justify-between font-bold text-slate-700 transition-all ${errors.city ? 'border-red-400' : 'border-transparent focus:border-[#7C3AED]/20'}`}>
                              <span className={`block truncate ${!field.value && "text-slate-400"}`}>
                                {field.value ? cities.find(c => c.value === field.value)?.label : t('form.placeholderCity')}
                              </span>
                              <ChevronDown size={20} className="text-[#7C3AED]" />
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                              <Listbox.Options className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl bg-white p-1 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                                {cities.map((city) => (
                                  <Listbox.Option
                                    key={city.value}
                                    className={({ active, selected }) =>
                                      `relative cursor-pointer select-none rounded-xl py-3 px-4 transition-colors ${
                                        active || selected ? 'bg-[#7C3AED]/10 text-[#7C3AED]' : 'text-slate-700'
                                      }`
                                    }
                                    value={city.value}
                                  >
                                    {({ selected }) => (
                                      <div className={`flex items-center justify-between `}>
                                        <span className={`block truncate font-bold ${selected ? 'text-[#7C3AED]' : 'font-normal'}`}>
                                          {city.label}
                                        </span>
                                        {selected && <Check size={16} />}
                                      </div>
                                    )}
                                  </Listbox.Option>
                                ))}
                              </Listbox.Options>
                            </Transition>
                          </div>
                        </Listbox>
                      )}
                    />
                    {errors.city && <p className="text-red-500 text-xs font-bold px-2">{errors.city.message}</p>}
                  </div>

                  {/* Date Picker (HeroUI) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 px-1 block ltr:text-left rtl:text-right">{t('form.dateLabel')}</label>
                    <Controller
                      control={control}
                      name="bookingDate"
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          minValue={today(getLocalTimeZone())}
                          variant="flat"
                          classNames={{
                            inputWrapper: `bg-slate-50 border-2 rounded-2xl h-[58px] hover:bg-slate-100 transition-all cursor-pointer ${errors.bookingDate ? 'border-red-400' : 'border-transparent'}`,
                            input: "text-slate-800 font-bold",
                            selectorIcon: "text-[#7C3AED]",
                          }}
                          calendarProps={{
                            classNames: {
                              base: "bg-white border border-slate-100 shadow-2xl rounded-3xl",
                              cellButton: [
                                "rounded-full transition-all cursor-default",
                                "data-[selected=true]:bg-[#7C3AED] data-[selected=true]:text-white data-[selected=true]:font-bold data-[selected=true]:shadow-lg data-[selected=true]:shadow-purple-200",
                                "data-[unavailable=true]:text-slate-200 data-[unavailable=true]:cursor-not-allowed",
                                "data-[disabled=true]:text-slate-200 data-[disabled=true]:cursor-not-allowed",
                                "enabled:cursor-pointer hover:bg-[#7C3AED]/10",
                              ]
                            }
                          }}
                        />
                      )}
                    />
                    {errors.bookingDate && <p className="text-red-500 text-xs font-bold px-2">{errors.bookingDate.message}</p>}
                  </div>
                </div>

                {/* Time Selection Grid */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <label className={`text-sm font-bold text-slate-700 px-1 flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Clock size={16} className="text-[#7C3AED]" /> {isRtl ? "الأوقات المتاحة" : "Available Times"}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {allTimeSlots.map((slot) => {
                          const isBlocked = disabledSlots.includes(slot.value);
                          const active = selectedTime === slot.value;
                          return (
                            <button
                              type="button"
                              key={slot.value}
                              disabled={isBlocked}
                              onClick={() => setValue("timeSlot", slot.value)}
                              className={`rounded-2xl py-4 font-bold transition-all text-sm border-2 ${isBlocked ? "bg-slate-50 text-slate-200 border-slate-50 cursor-not-allowed line-through" : active ? "bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg shadow-purple-200" : "bg-white text-slate-600 border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-md cursor-pointer"}`}
                            >
                              {slot.label}
                            </button>
                          );
                        })}
                      </div>
                      {errors.timeSlot && <p className="text-red-500 text-xs font-bold px-2">{errors.timeSlot.message}</p>}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Payment Summary */}
                <div className="bg-slate-50 rounded-[32px] p-6 space-y-6">
                  <div className="space-y-3">
                    <h3 className={`text-[10px] font-bold uppercase tracking-widest text-slate-500 ltr:text-left rtl:text-right`}>{isRtl ? "تفاصيل الحجز" : "Booking Summary"}</h3>
                    <div className={`flex flex-wrap gap-4 text-sm font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                       <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100">
                          <CalendarDays size={16} className="text-[#7C3AED]" />
                          <span>{selectedDate ? selectedDate.toString() : "---"}</span>
                       </div>
                       <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100">
                          <Clock size={16} className="text-[#7C3AED]" />
                          <span>{selectedTime ? allTimeSlots.find(s => s.value === selectedTime)?.label : "---"}</span>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-200">
                    <div className={`flex justify-between items-center text-sm opacity-60 font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span>{isRtl ? "سعر الملعب" : "Court Price"}</span>
                      <span>{price} SAR</span>
                    </div>
                    <div className={`flex justify-between items-center text-sm opacity-60 font-bold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span>{isRtl ? "الضريبة (15%)" : "VAT (15%)"}</span>
                      <span>{vatAmount.toFixed(2)} SAR</span>
                    </div>
                    <div className={`flex justify-between items-center pt-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-lg font-bold">{isRtl ? "الإجمالي" : "Total Amount"}</span>
                      <span className="text-2xl font-bold text-[#7C3AED]">{totalAmount.toFixed(2)} SAR</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  disabled={isSubmitting} 
                  type="submit" 
                  className="w-full bg-[#7C3AED] text-white py-5 rounded-3xl font-bold text-xl hover:bg-[#6D28D9] hover:shadow-2xl hover:shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-40 cursor-pointer"
                >
                  {isSubmitting ? "..." : t('form.submit')}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;