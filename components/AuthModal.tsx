"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Phone, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthContext';
import { normalizeSaudiPhone } from '@/lib/auth-api';
import AuthSignInForm from '@/components/AuthSignInForm';
import AuthSignUpForm from '@/components/AuthSignUpForm';
import AuthConfirmForm from '@/components/AuthConfirmForm';

// Accepts +966XXXXXXXXX, 966XXXXXXXXX, 0XXXXXXXXX, or plain 5XXXXXXXX
const SAUDI_PHONE_RE = /^(?:\+966|966|0)?5\d{8}$/;

function PhoneCollectView() {
  const t = useTranslations('Auth');
  const { updatePhone, closeAuth } = useAuth();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Strip all non-digit chars except leading +
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (!SAUDI_PHONE_RE.test(cleaned)) {
      setError(t('errors.invalidPhone'));
      return;
    }
    setLoading(true);
    // Normalize to +966XXXXXXXXX before saving
    const result = await updatePhone(normalizeSaudiPhone(cleaned));
    setLoading(false);
    if (!result.ok) setError(t('errors.phoneSaveFailed'));
  };

  return (
    <div className="flex flex-col gap-0">
      <div className="text-center mb-6">
        <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#a855f7] rounded-[14px] mx-auto mb-3 flex items-center justify-center text-xl">
          📱
        </div>
        <h2 className="text-lg font-extrabold text-slate-900">{t('phone.title')}</h2>
        <p className="text-xs text-slate-400 mt-1">{t('phone.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label htmlFor="phone-collect" className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            {t('phoneNumber')}
          </label>
          <div className="relative">
            <Phone size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="phone-collect"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              placeholder="05XXXXXXXX"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(null); }}
              className="w-full ps-9 pe-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED] transition-colors"
              autoComplete="tel"
            />
          </div>
          {error && <p role="alert" className="text-red-500 text-[10px] mt-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : t('phone.save')}
        </button>

        <button
          type="button"
          onClick={closeAuth}
          className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
        >
          {t('phone.skip')}
        </button>
      </form>
    </div>
  );
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export default function AuthModal() {
  const t = useTranslations('Auth');
  const { isOpen, view, pendingUsername, linkingChallenge, closeAuth, confirmAccountLink, dismissLinkingChallenge } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);
  const [linkingLoading, setLinkingLoading] = useState(false);
  const [linkingError, setLinkingError] = useState<string | null>(null);

  const activeView: 'signin' | 'signup' | 'confirm' | 'linking' | 'phone' =
    linkingChallenge ? 'linking' : pendingUsername ? 'confirm' : view;

  const handleConfirmLink = async () => {
    setLinkingLoading(true);
    setLinkingError(null);
    const result = await confirmAccountLink();
    setLinkingLoading(false);
    if (!result.ok) {
      const key = result.errorKey === 'accountLinkedSignIn'
        ? 'errors.accountLinkedSignIn'
        : 'errors.socialLoginFailed';
      setLinkingError(t(key));
    }
  };

  const handleDismissLink = () => {
    setLinkingError(null);
    dismissLinkingChallenge();
  };

  // Close on Escape + focus trap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') { closeAuth(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeAuth]);

  // Move initial focus into panel when it opens
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current).focus();
  }, [isOpen, activeView]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="auth-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuth}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="auth-panel"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-label={
              activeView === 'confirm' ? t('confirm.title') :
              activeView === 'phone'   ? t('phone.title') :
              activeView === 'signin'  ? t('signIn') :
                                         t('signUp')
            }
            ref={panelRef}
            tabIndex={-1}
            className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90dvh] overflow-y-auto pointer-events-auto p-6">
              {/* Close button */}
              <button
                onClick={closeAuth}
                aria-label={t('close')}
                className="absolute top-4 end-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10"
              >
                <X size={18} />
              </button>

              {/* 4-view swap */}
              <AnimatePresence mode="wait" initial={false}>
                {activeView === 'signin' && (
                  <motion.div key="signin"
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.15 }}>
                    <AuthSignInForm />
                  </motion.div>
                )}
                {activeView === 'signup' && (
                  <motion.div key="signup"
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.15 }}>
                    <AuthSignUpForm />
                  </motion.div>
                )}
                {activeView === 'confirm' && (
                  <motion.div key="confirm"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <AuthConfirmForm />
                  </motion.div>
                )}
                {activeView === 'phone' && (
                  <motion.div key="phone"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <PhoneCollectView />
                  </motion.div>
                )}
                {activeView === 'linking' && linkingChallenge && (
                  <motion.div key="linking"
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
                    <div className="flex flex-col gap-4 text-center">
                      <div className="w-11 h-11 bg-gradient-to-br from-[#7C3AED] to-[#a855f7] rounded-[14px] mx-auto flex items-center justify-center text-xl">
                        🔗
                      </div>
                      <h2 className="text-lg font-extrabold text-slate-900">{t('linking.title')}</h2>
                      <p className="text-sm text-slate-600">{linkingChallenge.message}</p>
                      <p className="text-xs text-slate-400">
                        {t('linking.existingMethod', { method: linkingChallenge.existingAuthMethod })}
                      </p>
                      {linkingError && (
                        <p role="alert" className="text-red-500 text-xs">{linkingError}</p>
                      )}
                      <button
                        onClick={handleConfirmLink}
                        disabled={linkingLoading}
                        className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#9333ea] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {linkingLoading ? '…' : t('linking.confirm')}
                      </button>
                      <button
                        onClick={handleDismissLink}
                        disabled={linkingLoading}
                        className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                      >
                        {t('linking.cancel')}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
