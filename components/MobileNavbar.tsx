"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import Link from 'next/link';

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('explore'), href: `/${locale}/discover` },
    { name: t('tech'), href: `/${locale}/technology` },
    { name: t('business'), href: `/${locale}/business` },
    { name: t('about'), href: `/${locale}/about` },
  ];

  return (
    <nav className="lg:hidden w-full py-4 px-6 bg-white sticky top-0 z-[60] border-b border-slate-50">
      <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
        {/* Hamburger Menu */}
        <button onClick={() => setIsOpen(true)} className="p-2 -ml-2">
          <Menu size={28} className="text-[#0F172A]" />
        </button>

        {/* Brand Logo */}
        <Link href={`/${locale}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-[#7F22FE] to-[#C800DE] rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-100">
             <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
          </div>
        </Link>
      </div>

      {/* Slide-out Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70]"
            />
            
            {/* Sidebar Content */}
            <motion.div 
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 w-[85%] max-w-sm bg-white z-[80] shadow-2xl p-8 flex flex-col ${isRtl ? 'right-0' : 'left-0'}`}
            >
              <div className={`flex justify-between items-center mb-10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                 <button onClick={() => setIsOpen(false)} className="p-2 bg-slate-50 rounded-full">
                    <X size={20} className="text-slate-500" />
                 </button>
              </div>

              {/* Navigation Links with Chevrons */}
              <div className="flex flex-col border-t border-slate-50">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-6 border-b border-slate-50 group ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="font-saudia font-black text-[#0F172A] text-lg">{link.name}</span>
                    {isRtl ? <ChevronLeft size={20} className="text-slate-300" /> : <ChevronRight size={20} className="text-slate-300" />}
                  </Link>
                ))}
              </div>

              {/* Mobile Footer Actions */}
              <div className="mt-auto pt-8 space-y-8">
                <div className={`flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="font-saudia font-black text-slate-800">{isRtl ? 'الإنجليزية' : 'English'}</span>
                  <LanguageSwitcher />
                </div>

                <button className="w-full bg-[#7C3AED] text-white py-5 rounded-[24px] flex items-center justify-center gap-3 font-saudia font-black shadow-xl shadow-purple-100 active:scale-95 transition-all">
                  <Smartphone size={20} />
                  <span>{t('getApp')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default MobileNavbar;