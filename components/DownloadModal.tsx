"use client";

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const t = useTranslations('DownloadModal');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="bg-white rounded-[28px] w-full max-w-sm p-8 relative shadow-2xl text-center">

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 end-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Phone icon */}
        <div className="flex justify-center mb-5">
          <div className="w-[84px] h-[84px] rounded-2xl bg-[#EDE9FE] flex items-center justify-center">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="#7C3AED" strokeWidth="2"/>
              <circle cx="12" cy="18" r="1" fill="#7C3AED"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('title')}</h2>

        {/* Description */}
        <p className="text-sm text-slate-500 leading-relaxed mb-7">{t('description')}</p>

        {/* Store buttons */}
        <div className="flex gap-3">
          {/* Google Play */}
          <a
            href="https://play.google.com/store/apps/details?id=com.devarch.tennis2&hl=ar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] text-white rounded-2xl py-3.5 px-3 hover:bg-[#0F172A] transition-colors"
          >
            {/* Play Store icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.18 23.28c.34.19.72.23 1.08.12l11.1-11.1-2.53-2.53L3.18 23.28zM20.47 10.34l-2.75-1.57-3.07 3.07 3.07 3.07 2.77-1.58c.79-.45.79-1.54-.02-1.99zM2.01 1.42C1.99 1.56 2 1.7 2 1.85v20.3c0 .15.01.29.03.43l10.32-10.32L2.01 1.42zM13.36 12.3l2.51-2.51L4.28.67C3.93.55 3.55.58 3.21.77L13.36 12.3z"/>
            </svg>
            <span className="text-left leading-tight">
              <span className="block text-[9px] text-white/70 font-normal">GET IT ON</span>
              <span className="block text-sm font-bold">Google Play</span>
            </span>
          </a>

          {/* App Store */}
          <a
            href="https://apps.apple.com/sa/app/seed-%D8%B3%D9%8A%D9%8A%D8%AF/id6754299638"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1E293B] text-white rounded-2xl py-3.5 px-3 hover:bg-[#0F172A] transition-colors"
          >
            {/* Apple icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="text-left leading-tight">
              <span className="block text-[9px] text-white/70 font-normal">Download on the</span>
              <span className="block text-sm font-bold">App Store</span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
