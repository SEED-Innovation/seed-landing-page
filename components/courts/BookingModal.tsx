"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from 'next-intl';
import { X, MapPin, CalendarDays, Clock, Loader2, AlertCircle, CheckCircle2, Video } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useBooking } from '@/components/BookingContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityId: number;
  courtId: number;
  courtName: string;
  facilityName: string;
  location: string;
  price: number;
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
const RECORDING_PRICE = 50; // SAR — update to actual add-on price

export default function BookingModal({
  isOpen,
  onClose,
  facilityId,
  courtId,
  courtName,
  facilityName,
  location,
  price,
}: BookingModalProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { user } = useAuth();
  const { selectedDate, selectedTime, selectedDuration, selectedSportType, selectedRecording } = useBooking();

  // Editable fields — pre-filled from auth
  const [fullName, setFullName]     = useState(user?.username ?? '');
  const [email, setEmail]           = useState(user?.email ?? '');
  const [phone, setPhone]           = useState(user?.phone ?? '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [paymentLink, setPaymentLink]   = useState<PaymentLinkResponse | null>(null);

  // Sync if user changes after mount
  useEffect(() => {
    if (user) {
      setFullName(u => u || user.username);
      setEmail(u => u || user.email);
      setPhone(u => u || user.phone);
    }
  }, [user]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      setPaymentLink(null);
    }
  }, [isOpen]);

  // ── Sport type label ─────────────────────────────────────────────────────
  const SPORT_TYPE_AR: Record<string, string> = {
    TENNIS: 'تنس', PADEL: 'بادل', SQUASH: 'إسكواش',
    FOOTBALL: 'كرة قدم', BASKETBALL: 'كرة سلة',
  };
  const SPORT_ICONS: Record<string, string> = {
    TENNIS: '🎾', PADEL: '🏓', SQUASH: '🏸', FOOTBALL: '⚽', BASKETBALL: '🏀',
  };
  const sportKey = selectedSportType?.toUpperCase() ?? '';
  const sportLabel = isRtl
    ? (SPORT_TYPE_AR[sportKey] ?? selectedSportType)
    : (selectedSportType ? selectedSportType.charAt(0) + selectedSportType.slice(1).toLowerCase() : '');
  const sportIcon = SPORT_ICONS[sportKey] ?? '🏅';

  // ── Format display values ─────────────────────────────────────────────────
  const displayDate = selectedDate
    ? new Date(selectedDate + 'T00:00:00').toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-GB', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      })
    : '—';

  const displayTime = selectedTime
    ? selectedTime.includes('T')
      ? selectedTime.split('T')[1].slice(0, 5)
      : selectedTime.slice(0, 5)
    : '—';

  // Calculate endTime ISO from startTime + duration
  const getEndTime = (): string => {
    if (!selectedTime) return '';
    const base = selectedTime.includes('T') ? selectedTime : `${selectedDate}T${selectedTime}`;
    const dt = new Date(base);
    dt.setMinutes(dt.getMinutes() + selectedDuration * 60);
    return dt.toISOString().slice(0, 19);
  };

  const total = price + (selectedRecording ? RECORDING_PRICE : 0);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) {
      setSubmitError(isRtl ? 'يرجى إدخال الاسم الكامل' : 'Please enter your full name');
      return;
    }
    if (!user?.phone && !phone.trim()) {
      setSubmitError(isRtl ? 'يرجى إدخال رقم الجوال' : 'Please enter your mobile number');
      return;
    }
    if (!user?.email && !email.trim()) {
      setSubmitError(isRtl ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter your email address');
      return;
    }

    const rawPhone = (user?.phone || phone).trim();
    const normalizedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+966${rawPhone.replace(/^0/, '')}`;

    setIsSubmitting(true);
    try {
      const savedTokens = typeof window !== 'undefined' ? localStorage.getItem('seed-tokens') : null;
      const tokens = savedTokens ? JSON.parse(savedTokens) : null;
      const idToken: string = tokens?.idToken ?? '';

      const res = await fetch(`https://api.seedco.sa/api/admin/payment-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          facilityId,
          courtId,
          bookingDate: selectedDate,
          startTime: selectedTime,
          endTime: getEndTime(),
          recordingAddon: selectedRecording,
          phoneNumber: normalizedPhone,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message ?? result?.errors?.[0] ?? 'Failed to create payment link');
      }
      setPaymentLink(result as PaymentLinkResponse);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError?: boolean) =>
    `w-full bg-slate-50 border-2 rounded-2xl py-3.5 px-5 outline-none transition-all text-sm font-medium ${
      hasError
        ? 'border-red-400 bg-red-50/50'
        : 'border-transparent focus:border-[#7C3AED]/30 focus:bg-white'
    } ${isRtl ? 'text-right' : 'text-left'}`;

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
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Header */}
            <div className={`p-6 flex justify-between items-center border-b border-slate-100 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h2 className="text-xl font-bold text-slate-900">{facilityName}</h2>
                <div className={`flex items-center gap-1.5 text-[#7C3AED] mt-0.5 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <MapPin size={13} />
                  <span className="text-xs font-bold">{location}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-hide">

              {/* ── SUCCESS STATE ─────────────────────────────────────────── */}
              {paymentLink ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-5 py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {isRtl ? 'تم إنشاء رابط الدفع' : 'Payment Link Created!'}
                    </h3>
                    <p className="text-slate-500 mt-1 text-sm">
                      {isRtl ? 'شارك الرابط مع العميل عبر واتساب أو رسالة نصية' : 'Share the link below via WhatsApp or SMS'}
                    </p>
                  </div>

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

                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => navigator.clipboard.writeText(paymentLink.whatsAppTemplate.paymentLink)}
                      className="flex-1 border-2 border-[#7C3AED] text-[#7C3AED] py-3.5 rounded-3xl font-bold text-sm hover:bg-purple-50 transition-all"
                    >
                      {isRtl ? 'نسخ الرابط' : 'Copy Link'}
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 bg-[#7C3AED] text-white py-3.5 rounded-3xl font-bold text-sm hover:bg-[#6D28D9] transition-all"
                    >
                      {isRtl ? 'إغلاق' : 'Done'}
                    </button>
                  </div>
                </motion.div>

              ) : (
                /* ── FORM STATE ───────────────────────────────────────────── */
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Booking summary */}
                  <div className={`bg-[#F8F5FF] rounded-2xl p-4 space-y-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide mb-3">
                      {isRtl ? 'تفاصيل الحجز' : 'Booking Summary'}
                    </p>
                    {sportLabel && (
                      <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-base leading-none">{sportIcon}</span>
                        <span>{sportLabel}</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <CalendarDays size={14} className="text-[#7C3AED] shrink-0" />
                      <span>{courtName} · {displayDate}</span>
                    </div>
                    <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Clock size={14} className="text-[#7C3AED] shrink-0" />
                      <span>{displayTime} · {selectedDuration}h</span>
                    </div>

                    {/* Recording — only shown if user opted in */}
                    {selectedRecording && (
                      <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 pt-2 border-t border-[#E9E0FF] ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <Video size={14} className="text-[#7C3AED] shrink-0" />
                        <span>{isRtl ? 'SEED تسجيل مفعّل' : 'SEED Recording included'}</span>
                      </div>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {isRtl ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className={inputClass()}
                      placeholder={isRtl ? 'اسمك الكامل' : 'Your full name'}
                    />
                  </div>

                  {/* Phone + Email side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                        {isRtl ? 'الجوال' : 'Mobile'}{!user?.phone && <span className="text-red-500 ms-0.5">*</span>}
                      </label>
                      {user?.phone ? (
                        <div className={`w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-500 select-none truncate ${isRtl ? 'text-right' : 'text-left'}`}>
                          {user.phone}
                        </div>
                      ) : (
                        <input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="05xxxxxxxx"
                          required
                          className={inputClass()}
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                        {isRtl ? 'البريد' : 'Email'}{!user?.email && <span className="text-red-500 ms-0.5">*</span>}
                      </label>
                      {user?.email ? (
                        <div className={`w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-500 select-none truncate ${isRtl ? 'text-right' : 'text-left'}`}>
                          {user.email}
                        </div>
                      ) : (
                        <input
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          required
                          className={inputClass()}
                        />
                      )}
                    </div>
                  </div>

                  {/* Price summary */}
                  <div className="bg-slate-50 rounded-[24px] p-5 space-y-2">
                    <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-slate-400">{isRtl ? 'سعر الملعب' : 'Court Price'}</span>
                      <span>{price} SAR</span>
                    </div>
                    {selectedRecording && (
                      <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="text-slate-400">{isRtl ? 'SEED تسجيل' : 'SEED Recording'}</span>
                        <span>{RECORDING_PRICE} SAR</span>
                      </div>
                    )}
                    <div className={`flex justify-between items-center pt-2 border-t border-slate-200 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="font-bold text-slate-800">{isRtl ? 'الإجمالي' : 'Total'}</span>
                      <span className="text-xl font-bold text-[#7C3AED]">{total} SAR</span>
                    </div>
                  </div>

                  {/* Error */}
                  <AnimatePresence>
                    {submitError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold ${isRtl ? 'flex-row-reverse' : ''}`}
                      >
                        <AlertCircle size={16} /> {submitError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Apple Pay button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-4 rounded-3xl font-bold text-base hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin mx-auto" size={20} />
                    ) : (
                      <>
                        {/* Apple logo */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <span className="text-base font-semibold tracking-wide">Pay</span>
                      </>
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
}
