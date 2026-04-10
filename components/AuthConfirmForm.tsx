"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthContext';

export default function AuthConfirmForm() {
  const t = useTranslations('Auth');
  const { confirmEmail, resendVerification, cancelConfirm } = useAuth();

  const [code, setCode]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg]     = useState<{ ok: boolean; text: string } | null>(null);

  const resendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (resendTimerRef.current) clearTimeout(resendTimerRef.current); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6 || loading) return;
    setError(null);
    setLoading(true);
    const result = await confirmEmail(code);
    if (!result.ok) {
      setError(t(`errors.${result.errorKey ?? 'signUpFailed'}` as Parameters<typeof t>[0]));
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    setResendMsg(null);
    const result = await resendVerification();
    setResendLoading(false);
    if (result.ok) {
      setError(null);
      setResendMsg({ ok: true,  text: t('confirm.resendSuccess') });
    } else {
      setResendMsg({ ok: false, text: t('errors.signUpFailed') });
    }
    if (resendTimerRef.current) clearTimeout(resendTimerRef.current);
    resendTimerRef.current = setTimeout(() => setResendMsg(null), 4000);
  };

  const handleBack = () => {
    cancelConfirm();
    setCode('');
    setError(null);
    setResendMsg(null);
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Envelope icon */}
      <div className="text-center mb-5">
        <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#a855f7] rounded-[14px] mx-auto mb-3 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="1.8" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <polyline points="2,4 12,13 22,4" />
          </svg>
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">{t('confirm.title')}</h2>
        <p className="text-xs text-slate-400 mt-1">{t('confirm.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="confirm-code" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('confirm.codeLabel')}
          </label>
          <input
            id="confirm-code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t('confirm.codePlaceholder')}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
              setError(null);
            }}
            autoComplete="one-time-code"
            className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors tracking-widest text-center text-lg font-bold ${
              error ? 'border-red-400' : 'border-slate-200'
            }`}
          />
          {error && <p className="text-red-500 text-[10px] mt-1">{error}</p>}
        </div>

        {resendMsg && (
          <p className={`text-[11px] text-center font-medium ${resendMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
            {resendMsg.text}
          </p>
        )}

        <button
          type="submit"
          disabled={code.length < 6 || loading}
          className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed mt-1"
        >
          {loading ? '…' : t('confirm.verify')}
        </button>
      </form>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="text-[11px] text-[#7C3AED] font-semibold hover:underline disabled:opacity-50"
        >
          {resendLoading ? '…' : t('confirm.resend')}
        </button>
        <span className="text-slate-300 text-xs">·</span>
        <button
          type="button"
          onClick={handleBack}
          className="text-[11px] text-slate-400 hover:text-slate-600 hover:underline"
        >
          {t('confirm.backToSignIn')}
        </button>
      </div>
    </div>
  );
}
