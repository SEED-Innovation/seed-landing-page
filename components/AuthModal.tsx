"use client";

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/components/AuthContext';
import AuthSignInForm from '@/components/AuthSignInForm';
import AuthSignUpForm from '@/components/AuthSignUpForm';

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
  const { isOpen, view, closeAuth } = useAuth();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape + focus trap (Tab / Shift+Tab cycling)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        closeAuth();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeAuth]);

  // Move initial focus into the panel when it opens
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const first = panelRef.current.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current).focus();
  }, [isOpen]);

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
            aria-label={view === 'signin' ? t('signIn') : t('signUp')}
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

              {/* Swap between sign in and sign up */}
              <AnimatePresence mode="wait" initial={false}>
                {view === 'signin' ? (
                  <motion.div
                    key="signin"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AuthSignInForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.15 }}
                  >
                    <AuthSignUpForm />
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
