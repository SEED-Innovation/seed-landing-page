"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal = ({ isOpen, onClose }: DownloadModalProps) => {
  const t = useTranslations('DownloadModal');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 h-[100vh]">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl z-10 text-center"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className={`absolute top-8 ${isRtl ? 'left-8' : 'right-8'} p-2 hover:bg-slate-50 rounded-full transition-colors`}
            >
              <X size={24} className="text-slate-400" />
            </button>

            {/* Gradient Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-[#F5F3FF] rounded-3xl flex items-center justify-center relative">
                 <Smartphone size={40} className="text-[#7F22FE] relative z-10" />
                 <div className="absolute inset-0 bg-gradient-to-br from-[#7F22FE]/10 to-[#C800DE]/10 rounded-3xl blur-sm" />
              </div>
            </div>

            {/* Content */}
            <h2 className="text-3xl md:text-4xl font-saudia font-black text-[#0F172A] mb-4">
              {t('title')}
            </h2>
            <p className="text-slate-500 font-saudia font-medium text-base md:text-lg mb-10 px-4 leading-relaxed">
              {t('description')}
            </p>

            {/* Buttons: Responsive arrangement */}
            <div className={`flex flex-col md:flex-row gap-4 justify-center items-stretch w-full max-w-md mx-auto`}>
              <a 
                href="#" 
                className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
                </svg>
                <div className="text-left">
                  <p className="text-xs  font-medium opacity-60 leading-none mb-1">Download on the</p>
                  <p className="text-lg font-bold leading-none">App Store</p>
                </div>
              </a>

              <a 
                href="#" 
                className="flex-1 bg-[#0F172A] hover:bg-slate-800 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-google-play" viewBox="0 0 16 16">
                <path d="M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27"/>
                </svg>                
                <div className="text-left">
                  <p className="text-[10px]  font-medium opacity-60 leading-none mb-1">GET IT ON</p>
                  <p className="text-lg font-bold leading-none">Google Play</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DownloadModal;