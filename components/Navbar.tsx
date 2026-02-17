"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Smartphone, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// This is the correct import you requested
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import DownloadModal from '@/app/[locale]/download/page';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('Common.Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Updated navLinks: Remove the `/${locale}` prefix. 
  // The localized Link component handles this automatically.
  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('explore'), href: '/courts' },
    { name: t('technology'), href: '/techs' },
    { name: t('business'), href: '/business' },
    { name: t('about'), href: '/about' },
  ];

  // Helper to check active state since pathname includes the locale (e.g., /ar/courts)
  const isActive = (href : string) => {
    if (href === '/' && (pathname === `/${locale}` || pathname === `/`)) return true;
    return pathname === `/${locale}${href}` || pathname === href;
  };

  return (
    <nav className="w-full py-6 px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <button 
          onClick={() => setIsOpen(true)} 
          className="lg:hidden p-2 text-[#1E293B] cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>

        <div className="flex items-center mx-3">
          {/* Changed to localized Link */}
          <Link href="/" className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-bold transition-colors ${
                isActive(link.href) ? 'text-[#7C3AED]' : 'text-slate-500 hover:text-[#7C3AED]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          <div className="hidden lg:block">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:cursor-pointer">
              <Smartphone size={18} />
              <span>{t('getApp')}</span>
            </button>
            <DownloadModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] lg:hidden"
            />
            
            <motion.div 
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 h-[100vh] w-[85%] max-w-sm bg-white shadow-2xl p-8 flex flex-col lg:hidden z-[120] ${isRtl ? 'right-0 text-right' : 'left-0 text-left'}`}
            >
              <div className="flex justify-between items-center mb-10">
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="p-2 bg-slate-50 rounded-full cursor-pointer"
                 >
                    <X size={20} className="text-slate-500" />
                 </button>
              </div>

              <div className="flex flex-col border-t border-slate-50">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between py-6 border-b border-slate-50 group"
                  >
                    <span className={`font-bold text-lg group-hover:text-[#7C3AED] transition-colors ${isActive(link.href) ? 'text-[#7C3AED]' : 'text-[#0F172A]'}`}>
                      {link.name}
                    </span>
                    {isRtl ? 
                      <ChevronLeft size={20} className="text-slate-300 group-hover:text-[#7C3AED] transition-transform group-hover:-translate-x-1" /> : 
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-1" />
                    }
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8 space-y-8 bg-white">
                <div className="flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl">
                  <LanguageSwitcher />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 w-full justify-center">
                  <Smartphone size={18} />
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

export default Navbar;