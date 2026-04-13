"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const LANDING_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.seedco.sa/api/landing_page';
const API_ROOT = LANDING_API_BASE.replace(/\/landing_page\/?$/, '');

interface BookingSummary {
  startTime?: string;
  endTime?: string;
  seedRecordingEnabled?: boolean;
  totalPrice?: number;
  court?: { name?: string | null; location?: string | null } | null;
  coach?: {
    coachId?: number | null;
    coachName?: string | null;
    subtotalSar?: number | null;
  } | null;
}

interface PaymentCompleteClientProps {
  orderId: string;
  homeHref: string;
}

export default function PaymentCompleteClient({
  orderId,
  homeHref,
}: PaymentCompleteClientProps) {
  const t = useTranslations('PaymentCompletePage');
  const missingOrderId = !orderId;
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    missingOrderId ? 'error' : 'processing'
  );
  const [message, setMessage] = useState<string>(
    missingOrderId ? t('missingOrderId') : t('processingMessage')
  );
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    if (!orderId) return;

    let attempts = 0;
    const maxAttempts = 20;

    const poll = () => {
      fetch(`${API_ROOT}/bookings/status/${encodeURIComponent(orderId)}`, {
        cache: 'no-store',
      })
        .then(async (response) => {
          if (!response.ok) throw new Error('status lookup failed');
          return response.json();
        })
        .then((data: { status?: string; message?: string; booking?: BookingSummary | null }) => {
          const bookingStatus = data.status ?? '';
          if (bookingStatus === 'APPROVED') {
            setMessage(data.message ?? t('successMessage'));
            setBooking(data.booking ?? null);
            setStatus('success');
            return;
          }
          if (['FAILED', 'CANCELLED', 'REJECTED', 'EXPIRED'].includes(bookingStatus)) {
            setMessage(data.message ?? t('failedMessage'));
            setStatus('error');
            return;
          }

          attempts += 1;
          if (attempts >= maxAttempts) {
            setMessage(t('pendingMessage'));
            setStatus('success');
            return;
          }
          window.setTimeout(poll, 3000);
        })
        .catch(() => {
          attempts += 1;
          if (attempts >= maxAttempts) {
            setMessage(t('unverifiedMessage'));
            setStatus('success');
            return;
          }
          window.setTimeout(poll, 3000);
        });
    };

    poll();
  }, [orderId, t]);

  if (status === 'processing') {
    return (
      <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl shadow-purple-100/40 p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#E9D5FF] border-t-[#7C3AED] animate-spin" />
          <h1 className="text-2xl font-bold text-slate-900 mt-6">{t('processingTitle')}</h1>
          <p className="text-slate-500 mt-2 text-sm">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7FF] flex items-center justify-center px-6 py-10">
      <div className="max-w-lg w-full bg-white rounded-[32px] shadow-xl shadow-purple-100/40 p-8 text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
          status === 'success' ? 'bg-green-50' : 'bg-amber-50'
        }`}>
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke={status === 'success' ? '#22C55E' : '#D97706'}
            strokeWidth="1.8"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mt-5">
          {status === 'success' ? t('successTitle') : t('errorTitle')}
        </h1>
        <p className="text-slate-500 mt-2 text-sm">{message}</p>

        <p className="mt-4 text-sm text-slate-600">
          {t('referenceLabel')} <strong>{orderId}</strong>
        </p>

        {booking && (
          <div className="mt-6 text-left bg-slate-50 rounded-3xl p-5 space-y-2 text-sm text-slate-700">
            <p><strong>{t('courtLabel')}</strong> {booking.court?.name ?? '—'}</p>
            <p><strong>{t('coachLabel')}</strong> {booking.coach?.coachName ?? '—'}</p>
            {booking.coach?.subtotalSar != null ? (
              <p><strong>{t('coachPriceLabel')}</strong> SAR {booking.coach.subtotalSar}</p>
            ) : null}
            <p><strong>{t('cameraLabel')}</strong> {booking.seedRecordingEnabled ? t('cameraOn') : t('cameraOff')}</p>
            {booking.startTime ? (
              <p><strong>{t('startLabel')}</strong> {new Date(booking.startTime).toLocaleString()}</p>
            ) : null}
            {booking.endTime ? (
              <p><strong>{t('endLabel')}</strong> {new Date(booking.endTime).toLocaleString()}</p>
            ) : null}
            {booking.totalPrice != null ? (
              <p><strong>{t('totalLabel')}</strong> SAR {booking.totalPrice}</p>
            ) : null}
          </div>
        )}

        <Link
          href={homeHref}
          className="mt-6 inline-flex items-center justify-center w-full bg-[#7C3AED] text-white py-3.5 rounded-2xl font-bold hover:bg-[#6D28D9] transition-colors"
        >
          {t('homeAction')}
        </Link>
      </div>
    </main>
  );
}
