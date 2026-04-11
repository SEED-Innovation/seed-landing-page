"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, MapPin, CalendarDays, Clock, Loader2, AlertCircle, CheckCircle2, Video } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from '@/i18n/routing';
import { readCheckout, clearCheckout, type CheckoutPayload } from '@/lib/checkout';

const RECORDING_PRICE = 50; // SAR — update to actual add-on price

const SPORT_TYPE_AR: Record<string, string> = {
  TENNIS: 'تنس', PADEL: 'بادل', SQUASH: 'إسكواش',
  FOOTBALL: 'كرة قدم', BASKETBALL: 'كرة سلة', VOLLEYBALL: 'كرة طائرة',
  BADMINTON: 'ريشة طائرة', TABLE_TENNIS: 'تنس طاولة',
};
const SPORT_ICONS: Record<string, string> = {
  TENNIS: '🎾', PADEL: '🏓', SQUASH: '🏸', FOOTBALL: '⚽',
  BASKETBALL: '🏀', VOLLEYBALL: '🏐', BADMINTON: '🏸', TABLE_TENNIS: '🏓',
};

interface PaymentLinkResponse {
  id: string;
  whatsAppTemplate: { paymentLink: string; formattedMessage: string };
  totalAmount: number;
  expiresAt: string;
}

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const { user } = useAuth();

  const [booking, setBooking] = useState<CheckoutPayload | null>(null);
  const [loaded, setLoaded] = useState(false);

  const [fullName, setFullName] = useState(user?.username ?? '');
  const [email, setEmail]       = useState(user?.email ?? '');
  const [phone, setPhone]       = useState(user?.phone ?? '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [paymentLink, setPaymentLink]   = useState<PaymentLinkResponse | null>(null);

  // Read booking from sessionStorage on mount
  useEffect(() => {
    const data = readCheckout();
    if (!data) {
      // No booking — go back
      router.back();
      return;
    }
    setBooking(data);
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync auth fields if user loads after mount
  useEffect(() => {
    if (user) {
      setFullName(v => v || user.username);
      setEmail(v => v || user.email);
      setPhone(v => v || user.phone);
    }
  }, [user]);

  if (!loaded || !booking) return null;

  // ── Derived display values ────────────────────────────────────────────────
  const sportKey   = booking.sportType?.toUpperCase() ?? '';
  const sportLabel = isRtl
    ? (SPORT_TYPE_AR[sportKey] ?? booking.sportType)
    : (booking.sportType ? booking.sportType.charAt(0) + booking.sportType.slice(1).toLowerCase() : '');
  const sportIcon  = SPORT_ICONS[sportKey] ?? '🏅';

  const displayDate = booking.date
    ? new Date(booking.date + 'T00:00:00').toLocaleDateString(
        locale === 'ar' ? 'ar-SA' : 'en-GB',
        { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
      )
    : '—';

  const displayTime = booking.time
    ? (booking.time.includes('T') ? booking.time.split('T')[1].slice(0, 5) : booking.time.slice(0, 5))
    : '—';

  const getEndTime = (): string => {
    if (!booking.time) return '';
    const base = booking.time.includes('T')
      ? booking.time
      : `${booking.date}T${booking.time}`;
    const dt = new Date(base);
    dt.setMinutes(dt.getMinutes() + booking.duration * 60);
    return dt.toISOString().slice(0, 19);
  };

  const total = booking.price + (booking.recording ? RECORDING_PRICE : 0);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim()) { setSubmitError(t('errors.nameRequired')); return; }
    if (!user?.phone && !phone.trim()) { setSubmitError(t('errors.phoneRequired')); return; }
    if (!user?.email && !email.trim()) { setSubmitError(t('errors.emailRequired')); return; }

    const rawPhone = (user?.phone || phone).trim();
    const normalizedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+966${rawPhone.replace(/^0/, '')}`;

    setIsSubmitting(true);
    try {
      const savedTokens = typeof window !== 'undefined' ? localStorage.getItem('seed-tokens') : null;
      const tokens = savedTokens ? JSON.parse(savedTokens) : null;
      const idToken: string = tokens?.idToken ?? '';

      const res = await fetch('https://api.seedco.sa/api/admin/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          facilityId:     booking.facilityId,
          courtId:        booking.courtId,
          bookingDate:    booking.date,
          startTime:      booking.time,
          endTime:        getEndTime(),
          recordingAddon: booking.recording,
          phoneNumber:    normalizedPhone,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.message ?? result?.errors?.[0] ?? 'Failed to create payment link');
      }
      clearCheckout();
      setPaymentLink(result as PaymentLinkResponse);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 outline-none transition-all text-sm font-medium focus:border-[#7C3AED]/30 focus:bg-white ${isRtl ? 'text-right' : 'text-left'}`;
  const lockedClass = `w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-500 select-none truncate ${isRtl ? 'text-right' : 'text-left'}`;

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* ── Back button ── */}
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#7C3AED] transition-colors mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}
        >
          <BackIcon size={16} />
          {t('back')}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-[40px] shadow-xl shadow-purple-100/40 overflow-hidden"
        >
          {/* ── Header ── */}
          <div className={`px-7 pt-7 pb-5 border-b border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <div className={`flex items-center gap-1.5 text-[#7C3AED] mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin size={13} />
              <span className="text-xs font-bold">{booking.facilityName} · {booking.location}</span>
            </div>
          </div>

          <div className="px-7 py-6 space-y-5">

            {/* ── SUCCESS STATE ── */}
            {paymentLink ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-5 py-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{t('paymentLinkCreated')}</h3>
                  <p className="text-slate-500 mt-1 text-sm">{t('shareLink')}</p>
                </div>

                <div className="w-full bg-slate-50 rounded-3xl p-5 space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('paymentLink')}</p>
                  <a
                    href={paymentLink.whatsAppTemplate.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[#7C3AED] font-bold text-sm break-all hover:underline"
                  >
                    {paymentLink.whatsAppTemplate.paymentLink}
                  </a>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-500">{t('total')}</span>
                    <span className="font-bold">{paymentLink.totalAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{t('expires')}</span>
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
                    {t('copyLink')}
                  </button>
                  <button
                    onClick={() => router.back()}
                    className="flex-1 bg-[#7C3AED] text-white py-3.5 rounded-3xl font-bold text-sm hover:bg-[#6D28D9] transition-all"
                  >
                    {t('done')}
                  </button>
                </div>
              </motion.div>

            ) : (
              /* ── FORM STATE ── */
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Booking summary card */}
                <div className={`bg-[#F8F5FF] rounded-2xl p-4 space-y-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide mb-3">
                    {t('bookingSummary')}
                  </p>
                  {sportLabel && (
                    <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-base leading-none">{sportIcon}</span>
                      <span>{sportLabel}</span>
                    </div>
                  )}
                  <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <CalendarDays size={14} className="text-[#7C3AED] shrink-0" />
                    <span>{booking.courtName} · {displayDate}</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <Clock size={14} className="text-[#7C3AED] shrink-0" />
                    <span>{displayTime} · {booking.duration}h</span>
                  </div>
                  {booking.recording && (
                    <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 pt-2 border-t border-[#E9E0FF] ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <Video size={14} className="text-[#7C3AED] shrink-0" />
                      <span>{isRtl ? 'SEED تسجيل مفعّل' : 'SEED Recording included'}</span>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t('fullName')}
                  </label>
                  <input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder={t('fullNamePlaceholder')}
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('mobile')}{!user?.phone && <span className="text-red-500 ms-0.5">*</span>}
                    </label>
                    {user?.phone ? (
                      <div className={lockedClass}>{user.phone}</div>
                    ) : (
                      <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('email')}{!user?.email && <span className="text-red-500 ms-0.5">*</span>}
                    </label>
                    {user?.email ? (
                      <div className={lockedClass}>{user.email}</div>
                    ) : (
                      <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className={inputClass}
                      />
                    )}
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-slate-50 rounded-[24px] p-5 space-y-2">
                  <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-400">{t('courtPrice')}</span>
                    <span>{booking.price} SAR</span>
                  </div>
                  {booking.recording && (
                    <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-slate-400">{t('recording')}</span>
                      <span>{RECORDING_PRICE} SAR</span>
                    </div>
                  )}
                  <div className={`flex justify-between items-center pt-2 border-t border-slate-200 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-slate-800">{t('total')}</span>
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
    </div>
  );
}
