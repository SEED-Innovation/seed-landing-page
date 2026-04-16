"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import {
  ArrowLeft, ArrowRight, MapPin, CalendarDays, Clock,
  Loader2, AlertCircle, Video, CreditCard, Lock,
} from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from '@/i18n/routing';
import { clearCheckout, readCheckout, type CheckoutPayload } from '@/lib/checkout';

const LANDING_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.seedco.sa/api/landing_page';

type CardNetwork = 'visa' | 'mastercard' | 'amex' | null;

interface PaymentQuoteResponse {
  bookingType: string;
  sport: string;
  courtId: string;
  courtName: string | null;
  coachId: string | null;
  coachName: string | null;
  packageSlug: string | null;
  date: string;
  startTime: string;
  duration: number;
  cameraEnabled: boolean;
  courtFee: number;
  cameraFee: number;
  totalPrice: number;
}

interface PaymentInitiateResponse {
  success: boolean;
  orderId?: string;
  transId?: string;
  threedsHtml?: string;
  error?: string;
}

const SPORT_TYPE_AR: Record<string, string> = {
  TENNIS: 'تنس', PADEL: 'بادل', SQUASH: 'إسكواش',
  FOOTBALL: 'كرة قدم', BASKETBALL: 'كرة سلة', VOLLEYBALL: 'كرة طائرة',
  BADMINTON: 'ريشة طائرة', TABLE_TENNIS: 'تنس طاولة',
};

const SPORT_ICONS: Record<string, string> = {
  TENNIS: '🎾', PADEL: '🏓', SQUASH: '🏸', FOOTBALL: '⚽',
  BASKETBALL: '🏀', VOLLEYBALL: '🏐', BADMINTON: '🏸', TABLE_TENNIS: '🏓',
};

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

function detectCardNetwork(raw: string): CardNetwork {
  const d = raw.replace(/\D/g, '');
  if (d.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  return null;
}

function extractTime(value: string): string {
  if (!value) return '';
  if (value.includes('T')) return value.split('T')[1]?.slice(0, 5) ?? '';
  return value.slice(0, 5);
}

function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem('seed-tokens');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    return parsed.accessToken ?? null;
  } catch {
    return null;
  }
}

function CardNetworkLogo({ network }: { network: CardNetwork }) {
  if (!network) return null;
  if (network === 'visa') {
    return (
      <svg viewBox="0 0 50 16" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.5 0.5L17.6 15.5H21.3L24.2 0.5H20.5Z" fill="#1A1F71"/>
        <path d="M34.9 0.8C34.1 0.5 32.8 0.2 31.2 0.2C27.5 0.2 24.9 2.1 24.9 4.8C24.8 6.8 26.7 7.9 28.1 8.6C29.6 9.3 30.1 9.7 30.1 10.3C30.1 11.2 29 11.6 28 11.6C26.6 11.6 25.8 11.4 24.6 10.9L24.1 10.7L23.5 14.1C24.5 14.5 26.2 14.9 28 14.9C32 14.9 34.5 13 34.5 10.1C34.5 8.5 33.5 7.3 31.3 6.3C29.9 5.6 29.1 5.2 29.1 4.5C29.1 3.9 29.8 3.3 31.3 3.3C32.5 3.3 33.4 3.5 34.1 3.8L34.4 3.9L34.9 0.8Z" fill="#1A1F71"/>
        <path d="M39.8 0.5H37C36.2 0.5 35.5 0.7 35.2 1.5L29.8 15.5H33.8L34.6 13.3H39.4L39.9 15.5H43.4L39.8 0.5ZM35.7 10.4C36 9.6 37.3 5.9 37.3 5.9C37.3 5.9 37.6 5.1 37.8 4.6L38.1 5.8C38.1 5.8 38.9 9.4 39.1 10.4H35.7Z" fill="#1A1F71"/>
        <path d="M14.2 0.5L10.5 10.6L10.1 8.7C9.4 6.4 7.2 3.9 4.8 2.7L8.2 15.5H12.2L18.2 0.5H14.2Z" fill="#1A1F71"/>
        <path d="M7.1 0.5H1L0.9 0.8C5.6 2 8.8 4.8 10.1 8.7L8.8 1.6C8.6 0.8 7.9 0.5 7.1 0.5Z" fill="#F9A533"/>
      </svg>
    );
  }

  if (network === 'mastercard') {
    return (
      <svg viewBox="0 0 38 24" className="h-4 w-auto" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="24" rx="4" fill="white"/>
        <circle cx="15" cy="12" r="7" fill="#EB001B"/>
        <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
        <path d="M19 6.8C20.5 7.9 21.5 9.3 21.5 12C21.5 14.7 20.5 16.1 19 17.2C17.5 16.1 16.5 14.7 16.5 12C16.5 9.3 17.5 7.9 19 6.8Z" fill="#FF5F00"/>
      </svg>
    );
  }

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

  const [booking, setBooking] = useState<CheckoutPayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [quote, setQuote] = useState<PaymentQuoteResponse | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const [fullName, setFullName] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');

  const [applePayAvailable, setApplePayAvailable] = useState(false);
  const [isApplePayLoading, setIsApplePayLoading] = useState(false);
  const [isCardSubmitting, setIsCardSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    const data = readCheckout();
    if (!data) {
      router.replace('/facilities');
      return;
    }
    setBooking(data);
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    if (user) {
      setFullName((value) => value || user.username);
      setEmail((value) => value || user.email);
      setPhone((value) => value || user.phone);
    }
  }, [user]);

  useEffect(() => {
    try {
      const applePayWindow = window as Window & {
        ApplePaySession?: { canMakePayments?: () => boolean };
      };
      if (applePayWindow.ApplePaySession?.canMakePayments?.()) {
        setApplePayAvailable(true);
      }
    } catch {
      setApplePayAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (!booking) return;

    const quoteBody = {
      facilityId: booking.facilityId,
      courtId: String(booking.courtId),
      date: booking.date,
      startTime: extractTime(booking.time),
      duration: booking.durationMinutes,
      camera: booking.recording,
      bookingType: booking.bookingType,
      sport: booking.sportType,
    };
    console.log('[checkout] fetching quote', { facilityId: booking.facilityId, body: quoteBody });

    let cancelled = false;
    setIsLoadingQuote(true);
    setQuoteError(null);

    fetch(`${LANDING_API_BASE}/payment/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteBody),
      cache: 'no-store',
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message =
            (data as { message?: string; error?: string }).message ??
            (data as { message?: string; error?: string }).error ??
            t('errors.quoteFailed');
          console.error('[checkout] quote HTTP error', { status: response.status, data });
          throw new Error(message);
        }
        return data as PaymentQuoteResponse;
      })
      .then((data) => {
        if (cancelled) return;
        setQuote(data);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('[checkout] quote fetch failed', error);
        setQuoteError(error instanceof Error ? error.message : t('errors.quoteFailed'));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingQuote(false);
      });

    return () => {
      cancelled = true;
    };
  }, [booking, t]);

  const displayDate = useMemo(() => {
    if (!booking?.date) return '—';
    return new Date(`${booking.date}T00:00:00`).toLocaleDateString(
      locale === 'ar' ? 'ar-SA' : 'en-GB',
      { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
    );
  }, [booking?.date, locale]);

  const displayTime = useMemo(() => extractTime(booking?.time ?? ''), [booking?.time]);

  const sportLabel = useMemo(() => {
    const sportKey = booking?.sportType?.toUpperCase() ?? '';
    if (!sportKey) return '';
    return isRtl
      ? (SPORT_TYPE_AR[sportKey] ?? booking?.sportType ?? '')
      : sportKey.charAt(0) + sportKey.slice(1).toLowerCase();
  }, [booking?.sportType, isRtl]);

  const sportIcon = SPORT_ICONS[booking?.sportType?.toUpperCase() ?? ''] ?? '🏅';
  const cardNet = detectCardNetwork(cardNumber);

  const total = quote?.totalPrice ?? null;
  const courtFee = quote?.courtFee ?? null;
  const cameraFee = quote?.cameraFee ?? null;

  const inputClass = 'w-full bg-slate-50 border-2 border-transparent rounded-2xl py-3.5 px-5 outline-none transition-all text-sm font-medium focus:border-[#7C3AED]/30 focus:bg-white';
  const lockedClass = 'w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3.5 px-5 text-sm font-medium text-slate-500 select-none truncate';
  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  if (!loaded || !booking) return null;

  const authToken = getStoredAccessToken();

  const ensureCommonFields = (): string | null => {
    if (!fullName.trim()) return t('errors.nameRequired');
    if (!user?.phone && !phone.trim()) return t('errors.phoneRequired');
    if (!user?.email && !email.trim()) return t('errors.emailRequired');
    if (!quote) return quoteError ?? t('errors.quoteFailed');
    if (!authToken) return t('errors.authRequired');
    return null;
  };

  const buildBasePayload = () => {
    const rawPhone = (user?.phone || phone).trim();
    const normalizedPhone = rawPhone.startsWith('+')
      ? rawPhone
      : `+966${rawPhone.replace(/^0/, '')}`;
    const fullNameParts = fullName.trim().split(/\s+/);

    return {
      payerFirstName: fullNameParts[0] ?? fullName.trim(),
      payerLastName: fullNameParts.slice(1).join(' ') || fullNameParts[0] || fullName.trim(),
      payerEmail: (user?.email || email).trim(),
      payerPhone: normalizedPhone,
      orderId: `LAND-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      description: `${booking.facilityName} booking ${booking.date} ${extractTime(booking.time)}`,
      facilityId: booking.facilityId,
      returnBaseUrl: typeof window !== 'undefined' ? window.location.origin : undefined,
      courtId: String(booking.courtId),
      date: booking.date,
      startTime: extractTime(booking.time),
      duration: booking.durationMinutes,
      camera: booking.recording,
      bookingType: booking.bookingType,
      sport: booking.sportType.toUpperCase(),
    };
  };

  const handleSuccessfulPayment = (orderId?: string) => {
    if (!orderId) {
      setSubmitError(t('errors.paymentFailed'));
      return;
    }
    clearCheckout();
    router.push(`/payment/complete?order_id=${encodeURIComponent(orderId)}`);
  };

  const handleCardSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError(null);

    const commonError = ensureCommonFields();
    if (commonError) {
      setSubmitError(commonError);
      return;
    }

    if (cardNumber.replace(/\D/g, '').length < 13) {
      setSubmitError(t('errors.cardNumberRequired'));
      return;
    }
    if (!cardName.trim()) {
      setSubmitError(t('errors.cardNameRequired'));
      return;
    }
    if (expiry.length < 5) {
      setSubmitError(t('errors.cardExpiryRequired'));
      return;
    }
    if (cvv.length < 3) {
      setSubmitError(t('errors.cardCvvRequired'));
      return;
    }

    const exp = expiry.replace(/\D/g, '');
    const payload = buildBasePayload();

    setIsCardSubmitting(true);
    try {
      const response = await fetch(`${LANDING_API_BASE}/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...payload,
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardExpMonth: exp.slice(0, 2),
          cardExpYear: exp.slice(2, 4),
          cardCvv: cvv,
        }),
      });

      const data = await response.json().catch(() => ({})) as PaymentInitiateResponse;
      if (data.success) {
        handleSuccessfulPayment(data.orderId ?? payload.orderId);
        return;
      }
      if (data.threedsHtml) {
        clearCheckout();
        document.open('text/html');
        document.write(data.threedsHtml);
        document.close();
        return;
      }
      setSubmitError(data.error ?? t('errors.paymentFailed'));
    } catch {
      setSubmitError(t('errors.paymentFailed'));
    } finally {
      setIsCardSubmitting(false);
    }
  };

  const handleApplePay = () => {
    const commonError = ensureCommonFields();
    if (commonError) {
      setSubmitError(commonError);
      return;
    }

    const appleWindow = window as Window & {
      ApplePaySession?: {
        new (version: number, request: Record<string, unknown>): {
          onvalidatemerchant: ((event: { validationURL: string }) => void | Promise<void>) | null;
          onpaymentauthorized: ((event: { payment: { token: unknown } }) => void | Promise<void>) | null;
          oncancel: (() => void) | null;
          completeMerchantValidation: (session: unknown) => void;
          completePayment: (status: number) => void;
          abort: () => void;
          begin: () => void;
        };
        canMakePayments?: () => boolean;
        STATUS_SUCCESS: number;
        STATUS_FAILURE: number;
      };
    };

    if (!appleWindow.ApplePaySession) {
      setSubmitError(t('errors.applePayUnavailable'));
      return;
    }

    setSubmitError(null);
    setIsApplePayLoading(true);

    const ApplePaySessionCtor = appleWindow.ApplePaySession;
    const payload = buildBasePayload();

    const session = new ApplePaySessionCtor(3, {
      countryCode: 'SA',
      currencyCode: 'SAR',
      supportedNetworks: ['visa', 'masterCard', 'mada'],
      merchantCapabilities: ['supports3DS'],
      total: { label: booking.facilityName, amount: (total ?? 0).toFixed(2) },
    });

    session.onvalidatemerchant = async (event) => {
      try {
        const response = await fetch(`${LANDING_API_BASE}/payment/apple-pay/validate-merchant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ validationURL: event.validationURL, facilityId: booking.facilityId }),
        });
        const merchantSession = await response.json();
        if (!response.ok) {
          throw new Error((merchantSession as { error?: string }).error ?? t('errors.applePayValidationFailed'));
        }
        session.completeMerchantValidation(merchantSession);
      } catch {
        session.abort();
        setIsApplePayLoading(false);
        setSubmitError(t('errors.applePayValidationFailed'));
      }
    };

    session.onpaymentauthorized = async (event) => {
      try {
        const response = await fetch(`${LANDING_API_BASE}/payment/apple-pay/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...payload,
            applePayToken: event.payment.token,
          }),
        });
        const data = await response.json().catch(() => ({})) as PaymentInitiateResponse;

        if (data.success) {
          session.completePayment(ApplePaySessionCtor.STATUS_SUCCESS);
          handleSuccessfulPayment(data.orderId ?? payload.orderId);
          return;
        }

        session.completePayment(ApplePaySessionCtor.STATUS_FAILURE);
        setSubmitError(data.error ?? t('errors.applePayChargeFailed'));
        setIsApplePayLoading(false);
      } catch {
        session.completePayment(ApplePaySessionCtor.STATUS_FAILURE);
        setSubmitError(t('errors.applePayChargeFailed'));
        setIsApplePayLoading(false);
      }
    };

    session.oncancel = () => {
      setIsApplePayLoading(false);
    };

    session.begin();
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <div className="max-w-lg mx-auto px-4 py-8">
        <button
          onClick={() => booking?.facilityId ? router.replace(`/facilities/${booking.facilityId}`) : router.replace('/facilities')}
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
          <div className={`px-7 pt-7 pb-5 border-b border-slate-100 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
            <div className={`flex items-center gap-1.5 text-[#7C3AED] mt-1 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <MapPin size={13} />
              <span className="text-xs font-bold">{booking.facilityName} · {booking.location}</span>
            </div>
          </div>

          <form onSubmit={handleCardSubmit} className="px-7 py-6 space-y-5">
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
                <span>{quote?.courtName ?? booking.courtName} · {displayDate}</span>
              </div>
              <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <Clock size={14} className="text-[#7C3AED] shrink-0" />
                <span>{displayTime} · {booking.duration}h</span>
              </div>
              {booking.recording && (
                <div className={`flex items-center gap-2 text-sm font-semibold text-slate-700 pt-2 border-t border-[#E9E0FF] ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Video size={14} className="text-[#7C3AED] shrink-0" />
                  <span>{t('recordingIncluded')}</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                {t('fullName')}
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`}
                placeholder={t('fullNamePlaceholder')}
                autoComplete="name"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t('mobile')}{!user?.phone && <span className="text-red-500 ms-0.5">*</span>}
                </label>
                {user?.phone ? (
                  <div className={`${lockedClass} ${isRtl ? 'text-right' : 'text-left'}`}>{user.phone}</div>
                ) : (
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="05xxxxxxxx"
                    required
                    autoComplete="tel"
                    className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                )}
              </div>
              <div className="space-y-1">
                <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t('email')}{!user?.email && <span className="text-red-500 ms-0.5">*</span>}
                </label>
                {user?.email ? (
                  <div className={`${lockedClass} ${isRtl ? 'text-right' : 'text-left'}`}>{user.email}</div>
                ) : (
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    required
                    autoComplete="email"
                    className={`${inputClass} ${isRtl ? 'text-right' : 'text-left'}`}
                  />
                )}
              </div>
            </div>

            <div className="bg-slate-50 rounded-[24px] p-5 space-y-2">
              {isLoadingQuote ? (
                <div className={`flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{t('loadingQuote')}</span>
                </div>
              ) : quoteError ? (
                <div className={`flex items-center gap-2 text-sm font-semibold text-red-600 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <AlertCircle size={16} />
                  <span>{quoteError}</span>
                </div>
              ) : (
                <>
                  <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="text-slate-400">{t('courtPrice')}</span>
                    <span>{courtFee != null ? `${courtFee.toFixed(2)} SAR` : '—'}</span>
                  </div>
                  {booking.recording && (
                    <div className={`flex justify-between items-center text-sm font-semibold ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span className="text-slate-400">{t('recording')}</span>
                      <span>{cameraFee != null ? `${cameraFee.toFixed(2)} SAR` : '—'}</span>
                    </div>
                  )}
                  <div className={`flex justify-between items-center pt-2 border-t border-slate-200 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-slate-800">{t('total')}</span>
                    <span className="text-xl font-bold text-[#7C3AED]">{total != null ? `${total.toFixed(2)} SAR` : '—'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Apple Pay native button — only shown on supported Safari/Apple devices */}
            {applePayAvailable && (
              <>
                <button
                  type="button"
                  className="apple-pay-btn"
                  onClick={handleApplePay}
                  disabled={isApplePayLoading || isLoadingQuote}
                  aria-label="Pay with Apple Pay"
                />
                <div className="payment-divider">
                  <span>{isRtl ? 'أو ادفع بالبطاقة' : 'or pay with card'}</span>
                </div>
              </>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t('cardNumber')}
                </label>
                <div className="relative">
                  <input
                    dir="ltr"
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
                    placeholder={t('cardNumberPlaceholder')}
                    maxLength={19}
                    autoComplete="cc-number"
                    className={`${inputClass} pr-20 text-left tracking-widest`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {cardNet ? <CardNetworkLogo network={cardNet} /> : <CreditCard size={18} className="text-slate-300" />}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                  {t('nameOnCard')}
                </label>
                <input
                  dir="ltr"
                  value={cardName}
                  onChange={(event) => setCardName(event.target.value.toUpperCase())}
                  placeholder={t('nameOnCardPlaceholder')}
                  autoComplete="cc-name"
                  className={`${inputClass} text-left tracking-wide`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold text-slate-500 uppercase tracking-wide block ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t('expiry')}
                  </label>
                  <input
                    dir="ltr"
                    type="text"
                    inputMode="numeric"
                    value={expiry}
                    onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                    placeholder={t('expiryPlaceholder')}
                    maxLength={5}
                    autoComplete="cc-exp"
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
                      onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder={t('cvvPlaceholder')}
                      maxLength={4}
                      autoComplete="cc-csc"
                      className={`${inputClass} pr-10 text-left`}
                    />
                    <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <AlertCircle size={16} />
                  {submitError}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isCardSubmitting || isLoadingQuote}
              className="w-full bg-[#7C3AED] text-white py-4 rounded-3xl font-bold text-base hover:bg-[#6D28D9] hover:shadow-xl hover:shadow-purple-200 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isCardSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CreditCard size={18} className="shrink-0" />
                  <span>{t('payCard', { amount: total != null ? total.toFixed(2) : '0.00' })}</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
