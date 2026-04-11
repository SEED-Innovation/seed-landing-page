"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft, ArrowRight, MapPin, CalendarDays, Clock,
  Loader2, AlertCircle, CheckCircle2, Video, CreditCard, Lock,
} from 'lucide-react';
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

type PaymentMethod = 'apple' | 'card';

// ── Card number helpers ────────────────────────────────────────────────────
function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function detectCardNetwork(raw: string): 'visa' | 'mastercard' | 'amex' | null {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  return null;
}

// ── Card network SVG logos ─────────────────────────────────────────────────
function CardNetworkLogo({ network }: { network: 'visa' | 'mastercard' | 'amex' | null }) {
  if (!network) return null;
  if (network === 'visa') return (
    <svg viewBox="0 0 50 16" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.5 0.5L17.6 15.5H21.3L24.2 0.5H20.5Z" fill="#1A1F71"/>
      <path d="M34.9 0.8C34.1 0.5 32.8 0.2 31.2 0.2C27.5 0.2 24.9 2.1 24.9 4.8C24.8 6.8 26.7 7.9 28.1 8.6C29.6 9.3 30.1 9.7 30.1 10.3C30.1 11.2 29 11.6 28 11.6C26.6 11.6 25.8 11.4 24.6 10.9L24.1 10.7L23.5 14.1C24.5 14.5 26.2 14.9 28 14.9C32 14.9 34.5 13 34.5 10.1C34.5 8.5 33.5 7.3 31.3 6.3C29.9 5.6 29.1 5.2 29.1 4.5C29.1 3.9 29.8 3.3 31.3 3.3C32.5 3.3 33.4 3.5 34.1 3.8L34.4 3.9L34.9 0.8Z" fill="#1A1F71"/>
      <path d="M39.8 0.5H37C36.2 0.5 35.5 0.7 35.2 1.5L29.8 15.5H33.8L34.6 13.3H39.4L39.9 15.5H43.4L39.8 0.5ZM35.7 10.4C36 9.6 37.3 5.9 37.3 5.9C37.3 5.9 37.6 5.1 37.8 4.6L38.1 5.8C38.1 5.8 38.9 9.4 39.1 10.4H35.7Z" fill="#1A1F71"/>
      <path d="M14.2 0.5L10.5 10.6L10.1 8.7C9.4 6.4 7.2 3.9 4.8 2.7L8.2 15.5H12.2L18.2 0.5H14.2Z" fill="#1A1F71"/>
      <path d="M7.1 0.5H1L0.9 0.8C5.6 2 8.8 4.8 10.1 8.7L8.8 1.6C8.6 0.8 7.9 0.5 7.1 0.5Z" fill="#F9A533"/>
    </svg>
  );
  if (network === 'mastercard') return (
    <svg viewBox="0 0 38 24" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="24" rx="4" fill="white"/>
      <circle cx="15" cy="12" r="7" fill="#EB001B"/>
      <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
      <path d="M19 6.8C20.5 7.9 21.5 9.3 21.5 12C21.5 14.7 20.5 16.1 19 17.2C17.5 16.1 16.5 14.7 16.5 12C16.5 9.3 17.5 7.9 19 6.8Z" fill="#FF5F00"/>
    </svg>
  );
  // amex
  return (
    <svg viewBox="0 0 48 16" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0h48v16H0z" fill="#2E77BC"/>
      <path d="M9.3 11.8H7.5L6.1 8.5 4.7 11.8H2.9L5.2 6.6H7L9.3 11.8ZM13.6 11.8H11.7V6.6H13.6V11.8ZM20.2 11.8H18.6L16.2 8.5V11.8H14.4V6.6H16L18.4 9.8V6.6H20.2V11.8ZM26.8 8.1H24V9H26.6V10.3H24V11.2H26.8V11.8H22.2V6.6H26.8V8.1ZM35.8 11.8H33.9L33 10.2 32.1 11.8H30.2L31.9 9.2 30.2 6.6H32.1L33 8.2 33.9 6.6H35.8L34.1 9.2 35.8 11.8Z" fill="white"/>
    </svg>
  );
}

export default function CheckoutPage() {
  const t = useTranslations('CheckoutPage');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const router = useRouter();
  const { user } = useAuth();

  const [booking, setBooking]   = useState<CheckoutPayload | null>(null);
  const [loaded, setLoaded]     = useState(false);

  // Contact fields
  const [fullName, setFullName] = useState(user?.username ?? '');
  const [email, setEmail]       = useState(user?.email ?? '');
  const [phone, setPhone]       = useState(user?.phone ?? '');

  // Payment method
  const [method, setMethod]     = useState<PaymentMethod>('apple');

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName]     = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvv, setCvv]               = useState('');
  const [saveCard, setSaveCard]     = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [paymentLink, setPaymentLink]   = useState<PaymentLinkResponse | null>(null);

  // Read booking from sessionStorage on mount
  useEffect(() => {
    const data = readCheckout();
    if (!data) { router.back(); return; }
    setBooking(data);
    setLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync auth fields
  useEffect(() => {
    if (user) {
      setFullName(v => v || user.username);
      setEmail(v => v || user.email);
      setPhone(v => v || user.phone);
    }
  }, [user]);

  if (!loaded || !booking) return null;

  // ── Derived values ────────────────────────────────────────────────────────
  const sportKey   = booking.sportType?.toUpperCase() ?? '';
  const sportLabel = isRtl
    ? (SPORT_TYPE_AR[sportKey] ?? booking.sportType)
    : (booking.sportType ? booking.sportType.charAt(0) + booking.sportType.slice(1).toLowerCase() : '');
  const sportIcon  = SPORT_ICONS[sportKey] ?? '🏅';

  const displayDate = booking.date
    ? new Date(booking.date + 'T00:00:00').toLocaleDateString(
        locale === 'ar' ? 'ar-SA' : 'en-GB',
        { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' },
      )
    : '—';

  const displayTime = booking.time
    ? (booking.time.includes('T') ? booking.time.split('T')[1].slice(0, 5) : booking.time.slice(0, 5))
    : '—';

  const getEndTime = (): string => {
    if (!booking.time) return '';
    const base = booking.time.includes('T') ? booking.time : `${booking.date}T${booking.time}`;
    const dt = new Date(base);
    dt.setMinutes(dt.getMinutes() + booking.duration * 60);
    return dt.toISOString().slice(0, 19);
  };

  const courtTotal = booking.price * booking.duration;
  const total      = courtTotal + (booking.recording ? RECORDING_PRICE : 0);
  const cardNet    = detectCardNetwork(cardNumber);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Common validation
    if (!fullName.trim()) { setSubmitError(t('errors.nameRequired')); return; }
    if (!user?.phone && !phone.trim()) { setSubmitError(t('errors.phoneRequired')); return; }
    if (!user?.email && !email.trim()) { setSubmitError(t('errors.emailRequired')); return; }

    // Card-specific validation
    if (method === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 13) { setSubmitError(t('errors.cardNumberRequired')); return; }
      if (!cardName.trim()) { setSubmitError(t('errors.cardNameRequired')); return; }
      if (expiry.length < 5) { setSubmitError(t('errors.cardExpiryRequired')); return; }
      if (cvv.length < 3) { setSubmitError(t('errors.cardCvvRequired')); return; }
    }

    const rawPhone = (user?.phone || phone).trim();
    const normalizedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+966${rawPhone.replace(/^0/, '')}`;

    setIsSubmitting(true);
    try {
      const savedTokens = typeof window !== 'undefined' ? localStorage.getItem('seed-tokens') : null;
      const tokens      = savedTokens ? JSON.parse(savedTokens) : null;
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
          paymentMethod:  method,
          ...(method === 'card' && {
            saveCard,
            // Card data would be tokenised by your payment processor — sending raw here for demo
          }),
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message ?? result?.errors?.[0] ?? 'Failed to create payment link');
      clearCheckout();
      setPaymentLink(result as PaymentLinkResponse);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass  = `w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 outline-none transition-all text-sm font-medium focus:border-[#7C3AED]/30 focus:bg-white`;
  const lockedClass = `w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-500 select-none truncate`;
  const BackIcon    = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back */}
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
          {/* Header */}
          <div className={`px-7 pt-7 pb-5 border-b border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <div className={`flex items-center gap-1.5 text-[#7C3AED] mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin size={13} />
              <span className="text-xs font-bold">{booking.facilityName} · {booking.location}</span>
            </div>
          </div>

          <div className="px-7 py-6 space-y-5">

            {/* ── SUCCESS ── */}
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
                  <div className={`flex justify-between text-sm pt-2 border-t border-slate-200 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-500">{t('total')}</span>
                    <span className="font-bold">{paymentLink.totalAmount.toFixed(2)} SAR</span>
                  </div>
                  <div className={`flex justify-between text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
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
              /* ── FORM ── */
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Booking summary */}
                <div className={`bg-[#F8F5FF] rounded-2xl p-4 space-y-2.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <p className="text-xs font-bold text-[#7C3AED] uppercase tracking-wide mb-3">{t('bookingSummary')}</p>
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
                    className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`}
                    placeholder={t('fullNamePlaceholder')}
                  />
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('mobile')}{!user?.phone && <span className="text-red-500 ms-0.5">*</span>}
                    </label>
                    {user?.phone
                      ? <div className={`${lockedClass} ${isRtl ? 'text-right' : 'text-left'}`}>{user.phone}</div>
                      : <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="05xxxxxxxx" required className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`} />
                    }
                  </div>
                  <div className="space-y-1">
                    <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                      {t('email')}{!user?.email && <span className="text-red-500 ms-0.5">*</span>}
                    </label>
                    {user?.email
                      ? <div className={`${lockedClass} ${isRtl ? 'text-right' : 'text-left'}`}>{user.email}</div>
                      : <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" required className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`} />
                    }
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="bg-slate-50 rounded-[24px] p-5 space-y-2">
                  <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-400">
                      {t('courtPrice')}
                      <span className="font-normal text-slate-300 ms-1">
                        {booking.price} × {booking.duration}h
                      </span>
                    </span>
                    <span>{courtTotal} SAR</span>
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

                {/* ── Payment method selector ── */}
                <div>
                  <p className={`text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t('payWith')}
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-2xl p-1">
                    {/* Apple Pay tab */}
                    <button
                      type="button"
                      onClick={() => setMethod('apple')}
                      className={`relative py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        method === 'apple' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      {t('methodApplePay')}
                    </button>

                    {/* Card tab */}
                    <button
                      type="button"
                      onClick={() => setMethod('card')}
                      className={`py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                        method === 'card' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <CreditCard size={15} className="shrink-0" />
                      {t('methodCard')}
                    </button>
                  </div>
                </div>

                {/* ── Card form (animated) ── */}
                <AnimatePresence>
                  {method === 'card' && (
                    <motion.div
                      key="card-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-3 pt-1">

                        {/* Card number */}
                        <div className="space-y-1">
                          <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                            {t('cardNumber')}
                          </label>
                          <div className="relative">
                            <input
                              dir="ltr"
                              inputMode="numeric"
                              value={cardNumber}
                              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder={t('cardNumberPlaceholder')}
                              maxLength={19}
                              className={`${inputClass} pr-20 text-left tracking-widest`}
                            />
                            {/* Card network logo */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                              {cardNet ? (
                                <CardNetworkLogo network={cardNet} />
                              ) : (
                                <CreditCard size={18} className="text-slate-300" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Name on card */}
                        <div className="space-y-1">
                          <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                            {t('nameOnCard')}
                          </label>
                          <input
                            dir="ltr"
                            value={cardName}
                            onChange={e => setCardName(e.target.value.toUpperCase())}
                            placeholder={t('nameOnCardPlaceholder')}
                            className={`${inputClass} text-left tracking-wide`}
                          />
                        </div>

                        {/* Expiry + CVV */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                              {t('expiry')}
                            </label>
                            <input
                              dir="ltr"
                              inputMode="numeric"
                              value={expiry}
                              onChange={e => setExpiry(formatExpiry(e.target.value))}
                              placeholder={t('expiryPlaceholder')}
                              maxLength={5}
                              className={`${inputClass} text-left tracking-widest`}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                              {t('cvv')}
                            </label>
                            <div className="relative">
                              <input
                                dir="ltr"
                                inputMode="numeric"
                                type="password"
                                value={cvv}
                                onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                placeholder={t('cvvPlaceholder')}
                                maxLength={4}
                                className={`${inputClass} pr-10 text-left`}
                              />
                              <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* Save card toggle */}
                        <button
                          type="button"
                          onClick={() => setSaveCard(s => !s)}
                          className={`w-full rounded-2xl p-4 transition-all duration-200 bg-[#6D28D9] ${isRtl ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                            {/* Left: icon + text */}
                            <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/20">
                                <CreditCard size={18} className="text-[#ECDCFF]" />
                              </div>
                              <div className={isRtl ? 'text-right' : 'text-left'}>
                                <p className="text-sm font-bold leading-tight text-white">{t('saveCard')}</p>
                                <p className="text-xs mt-0.5 text-[#D08CFF]">{t('saveCardSub')}</p>
                              </div>
                            </div>
                            {/* Emoji + toggle */}
                            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                              <span className="text-lg leading-none">{saveCard ? '🔥' : ''}</span>
                              <div className={`relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200 ${saveCard ? 'bg-[#ECDCFF]' : 'bg-white/30'}`}>
                                <span className={`absolute top-1 w-4 h-4 rounded-full shadow transition-all duration-200 bg-white ${
                                  saveCard ? (isRtl ? 'right-1' : 'left-6') : (isRtl ? 'right-6' : 'left-1')
                                }`} />
                              </div>
                            </div>
                          </div>
                        </button>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

                {/* ── Submit button ── */}
                {method === 'apple' ? (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white py-4 rounded-3xl font-bold text-base hover:bg-neutral-800 hover:shadow-xl hover:shadow-black/20 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        <span className="text-base font-semibold tracking-wide">Pay</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#7C3AED] text-white py-4 rounded-3xl font-bold text-base hover:bg-[#6D28D9] hover:shadow-xl hover:shadow-purple-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <CreditCard size={18} className="shrink-0" />
                        <span>{isRtl ? `ادفع ${total} ر.س` : `Pay ${total} SAR`}</span>
                      </>
                    )}
                  </button>
                )}

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
