"use client";

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { DatePicker } from "@heroui/date-picker";
import { today, getLocalTimeZone, CalendarDate } from "@internationalized/date";
import { X, MapPin, Clock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BookingSchema, type BookingData } from '@/schemas/booking';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: number; // ← added (required for payment API)
  courtId: number;
  courtName: string;
  price: number;
}

interface ApiSlot {
  startTime: string;
  endTime: string;
  formattedTimeRange: string;
  price: number;
  available: boolean;
}

interface PaymentLinkResponse {
  id: string;
  whatsAppTemplate: {
    paymentLink: string;
    formattedMessage: string;
  };
  totalAmount: number;
  expiresAt: string;
}

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const BookingModal = ({
  isOpen,
  onClose,
  facilityId,
  courtId,
  courtName,
  price,
}: BookingModalProps) => {
  const t = useTranslations('CourtsPage.BookingModal');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [availableSlots, setAvailableSlots] = useState<ApiSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<PaymentLinkResponse | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ─── BUG FIX: use a single, consistent maxValue ───────────────────────────
  // Previously `maxBookingDate` (3 months) was declared but never passed to the
  // DatePicker — the picker used `add({ months: 6 })` inline instead. Any
  // mismatch between a declared constraint and the actual picker prop can cause
  // HeroUI's month-navigation arrows to appear disabled. We now centralise the
  // limit in one const and pass it consistently to both `maxValue` and any
  // calendar-level props.
  const minDate = today(getLocalTimeZone());
  const maxDate = today(getLocalTimeZone()).add({ months: 3 });
  // ─────────────────────────────────────────────────────────────────────────

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingData>({
    resolver: zodResolver(BookingSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      email: '',
      timeSlot: '',
      bookingDate: undefined as unknown as CalendarDate,
    },
  });

  const selectedDate = watch('bookingDate');
  const selectedTime = watch('timeSlot');

  // ── Find the full slot object that matches the selected start time ─────────
  const selectedSlot = availableSlots.find((s) => s.startTime === selectedTime);

  // ── Fetch availability whenever the date changes ──────────────────────────
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailability = async () => {
      setIsLoadingSlots(true);
      setSlotsError(null);
      setAvailableSlots([]);
      setValue('timeSlot', ''); // reset stale selection

      const formattedDate = [
        selectedDate.year,
        String(selectedDate.month).padStart(2, '0'),
        String(selectedDate.day).padStart(2, '0'),
      ].join('-');

      try {
        const res = await fetch(`${BASE_URL}/courts/availability`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courtId, date: formattedDate, durationMinutes: 60 }),
        });

        const result = await res.json();

        if (res.ok && result.availableSlots?.length > 0) {
          setAvailableSlots(result.availableSlots);
        } else {
          setSlotsError(isRtl ? 'لا توجد أوقات متاحة' : 'No slots available for this date');
        }
      } catch {
        setSlotsError(isRtl ? 'خطأ في الشبكة' : 'Network error — please try again');
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, courtId, isRtl, setValue]);

  // ── Submit: create payment link ───────────────────────────────────────────
  const onSubmit: SubmitHandler<BookingData> = async (data) => {
    setSubmitError(null);

    if (!selectedSlot) {
      setSubmitError(isRtl ? 'يرجى اختيار وقت' : 'Please select a time slot');
      return;
    }

    const formattedDate = [
      data.bookingDate.year,
      String(data.bookingDate.month).padStart(2, '0'),
      String(data.bookingDate.day).padStart(2, '0'),
    ].join('-');

    // Normalise phone: ensure it starts with +966
    const rawPhone = data.phoneNumber.trim();
    const phoneNumber = rawPhone.startsWith('+')
      ? rawPhone
      : `+966${rawPhone.replace(/^0/, '')}`;

    try {
      const res = await fetch(`${BASE_URL}/api/admin/payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({
          facilityId,
          courtId,
          bookingDate: formattedDate,
          startTime: selectedSlot.startTime,   // e.g. "08:00"
          endTime: selectedSlot.endTime,         // e.g. "09:00"
          recordingAddon: false,
          phoneNumber,
        }),
      });

      const result = await res.json();
      console.log(result)
      if (!res.ok) {
        const msg = result?.message ?? result?.errors?.[0] ?? 'Failed to create payment link';
        throw new Error(msg);
      }

      setPaymentLink(result as PaymentLinkResponse);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  // ── Inline error helper ───────────────────────────────────────────────────
  const FormError = ({ name }: { name: keyof BookingData }) => (
    <AnimatePresence>
      {errors[name] && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="text-red-500 text-xs font-bold mt-1 block px-1"
        >
          {errors[name]?.message as string}
        </motion.span>
      )}
    </AnimatePresence>
  );

  // ── Tax-inclusive total ───────────────────────────────────────────────────
  const totalWithTax = (price * 1.15).toFixed(2);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
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
            {/* ── Header ── */}
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-slate-100">
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight">{t('title')}</h2>
                <div className={`flex items-center gap-2 text-[#7C3AED] mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <MapPin size={14} />
                  <span className="text-sm font-bold">{courtName}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scrollbar-hide">

              {/* ── SUCCESS STATE ── */}
              {paymentLink ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-6 py-8 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {isRtl ? 'تم إنشاء رابط الدفع' : 'Payment Link Created!'}
                    </h3>
                    <p className="text-slate-500 mt-2 text-sm">
                      {isRtl
                        ? 'شارك الرابط أدناه مع العميل عبر واتساب أو رسالة نصية'
                        : 'Share the link below with the customer via WhatsApp or SMS'}
                    </p>
                  </div>

                  {/* Link box */}
                  <div className="w-full bg-slate-50 rounded-3xl p-5 space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {isRtl ? 'رابط الدفع' : 'Payment Link'}
                    </p>
                    <a
                      href={paymentLink.whatsAppTemplate.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[#7C3AED] font-bold text-sm break-all hover:underline"
                    >
                      {paymentLink.whatsAppTemplate.paymentLink}
                    </a>
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                      <span className="text-slate-500">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="font-bold">{paymentLink.totalAmount.toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">{isRtl ? 'ينتهي في' : 'Expires'}</span>
                      <span className="font-bold text-amber-600">
                        {new Date(paymentLink.expiresAt).toLocaleString(locale)}
                      </span>
                    </div>
                  </div>

                  {/* Copy + Close */}
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => navigator.clipboard.writeText(paymentLink.whatsAppTemplate.paymentLink)}
                      className="flex-1 border-2 border-[#7C3AED] text-[#7C3AED] py-4 rounded-3xl font-bold hover:bg-purple-50 transition-all"
                    >
                      {isRtl ? 'نسخ الرابط' : 'Copy Link'}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-[#7C3AED] text-white py-4 rounded-3xl font-bold hover:bg-[#6D28D9] transition-all"
                    >
                      {isRtl ? 'إغلاق' : 'Done'}
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* ── FORM STATE ── */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 col-span-full">
                      <label className="text-sm font-bold text-slate-700 block ltr:text-left rtl:text-right">
                        {t('form.nameLabel')}
                      </label>
                      <input
                        {...register('fullName')}
                        className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${
                          errors.fullName
                            ? 'border-red-400 bg-red-50/50'
                            : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'
                        }`}
                      />
                      <FormError name="fullName" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 block ltr:text-left rtl:text-right">
                        {t('form.phoneLabel')}
                      </label>
                      <input
                        {...register('phoneNumber')}
                        placeholder="05xxxxxxxx"
                        className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${
                          errors.phoneNumber
                            ? 'border-red-400 bg-red-50/50'
                            : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'
                        }`}
                      />
                      <FormError name="phoneNumber" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 block ltr:text-left rtl:text-right">
                        {t('form.emailLabel')}
                      </label>
                      <input
                        {...register('email')}
                        className={`w-full bg-slate-50 border-2 rounded-2xl py-4 px-5 outline-none transition-all ${
                          errors.email
                            ? 'border-red-400 bg-red-50/50'
                            : 'border-transparent focus:border-[#7C3AED]/20 focus:bg-white'
                        }`}
                      />
                      <FormError name="email" />
                    </div>
                  </div>

                  {/* ── DatePicker — CALENDAR BUG FIX ───────────────────────
                      Root cause: `maxBookingDate` (3 months) was defined but
                      never used — the inline `add({ months: 6 })` was passed
                      instead. HeroUI disables the "next month" arrow when the
                      last day of the current month exceeds maxValue, so a
                      stale/wrong maxValue caused the arrow to appear stuck.
                      Fix: use the single `maxDate` const defined above.
                  ──────────────────────────────────────────────────────── */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 block">
                      {t('form.dateLabel')}
                    </label>
                    <Controller
                      control={control}
                      name="bookingDate"
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ?? null}
                          onChange={field.onChange}
                          minValue={minDate}
                          maxValue={maxDate}      
                          isInvalid={!!errors.bookingDate}
                          errorMessage={errors.bookingDate?.message as string}
                          variant="flat"
                          classNames={{
                            inputWrapper:
                              'bg-slate-50 border-2 border-transparent rounded-2xl h-[58px] hover:bg-slate-100 data-[invalid=true]:bg-red-50 data-[invalid=true]:border-red-400',
                            input: 'text-slate-800 font-bold',
                            selectorIcon: 'text-[#7C3AED]',
                          }}
                          calendarProps={{
                            classNames: {
                              base: 'bg-white border border-slate-100 shadow-2xl rounded-3xl p-4',
                              cellButton: [
                                'rounded-xl transition-all w-10 h-10 font-semibold',
                                'hover:bg-[#7C3AED] hover:text-white cursor-pointer',
                                'data-[selected=true]:bg-[#7C3AED] data-[selected=true]:text-white data-[selected=true]:shadow-lg',
                                'data-[disabled=true]:text-slate-300 data-[disabled=true]:bg-slate-50 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:hover:bg-slate-50 data-[disabled=true]:hover:text-slate-300',
                              ],
                              gridHeader: 'text-slate-400 font-bold mb-2',
                              headerWrapper: 'mb-4',
                            },
                          }}
                        />
                      )}
                    />
                  </div>

                  {/* Time slots */}
                  <AnimatePresence mode="wait">
                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <label
                          className={`text-sm font-bold text-slate-700 flex items-center gap-2 ${
                            isRtl ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <Clock size={16} className="text-[#7C3AED]" />
                          {isRtl ? 'الأوقات المتاحة' : 'Available Times'}
                        </label>

                        {isLoadingSlots ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-[#7C3AED]" />
                          </div>
                        ) : slotsError ? (
                          <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-2xl text-sm font-bold">
                            <AlertCircle size={18} /> {slotsError}
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                              {availableSlots.map((slot, index) => (
                                <button
                                  type="button"
                                  key={index}
                                  disabled={!slot.available}
                                  onClick={() =>
                                    setValue('timeSlot', slot.startTime, { shouldValidate: true })
                                  }
                                  className={`rounded-2xl py-4 font-bold transition-all text-xs sm:text-sm border-2
                                    ${
                                      !slot.available
                                        ? 'bg-slate-50 text-slate-300 border-slate-50 cursor-not-allowed'
                                        : selectedTime === slot.startTime
                                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-lg shadow-purple-200'
                                        : 'bg-white text-slate-600 border-slate-100 hover:border-[#7C3AED]/20 hover:bg-slate-50 cursor-pointer'
                                    }`}
                                >
                                  {slot.formattedTimeRange}
                                </button>
                              ))}
                            </div>
                            <FormError name="timeSlot" />
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Price summary */}
                  <div className="bg-slate-50 rounded-[32px] p-6 space-y-3">
                    <div
                      className={`flex justify-between items-center text-sm font-bold ${
                        isRtl ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="opacity-60">{isRtl ? 'سعر الملعب' : 'Court Price'}</span>
                      <span>{price} SAR</span>
                    </div>
                    <div
                      className={`flex justify-between items-center text-sm font-bold ${
                        isRtl ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="opacity-60">{isRtl ? 'ضريبة القيمة المضافة (15%)' : 'VAT (15%)'}</span>
                      <span>{(price * 0.15).toFixed(2)} SAR</span>
                    </div>
                    <div
                      className={`flex justify-between items-center pt-2 border-t border-slate-200 ${
                        isRtl ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <span className="text-lg font-bold">{isRtl ? 'الإجمالي' : 'Total Amount'}</span>
                      <span className="text-2xl font-bold text-[#7C3AED]">{totalWithTax} SAR</span>
                    </div>
                  </div>

                  {/* Submit error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold"
                      >
                        <AlertCircle size={18} /> {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-[#7C3AED] text-white py-5 rounded-3xl font-bold text-xl hover:bg-[#6D28D9] hover:shadow-xl hover:shadow-purple-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mx-auto" />
                    ) : (
                      t('form.submit')
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;