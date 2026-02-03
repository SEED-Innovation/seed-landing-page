"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Smartphone, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Common.Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const isRtl = locale === 'ar';

  // Prevent background interaction when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { name: t('home'), href: `/${locale}` },
    { name: t('explore'), href: `/${locale}/courts` },
    { name: t('technology'), href: `/${locale}/techs` },
    { name: t('business'), href: `/${locale}/business` },
    { name: t('about'), href: `/${locale}/about` },
  ];

  return (
    <nav className={`w-full py-6 px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-50`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between `}>
        
        {/* Mobile Hamburger Menu - Perspective adjusted for RTL */}
        <button 
          onClick={() => setIsOpen(true)} 
          className="md:hidden p-2 text-[#1E293B] cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
        >
          <Menu size={28} />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center">
          <Link href={`/${locale}`} className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        {/* Desktop Center Links */}
        <div className={`hidden md:flex items-center gap-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`font-bold transition-colors ${
                pathname === link.href ? 'text-[#7C3AED]' : 'text-slate-500 hover:text-[#7C3AED]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions Section */}
        <div className={`flex items-center gap-6`}>
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          <button className={`bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-[#0F172A] transition-all shadow-lg font-medium text-sm cursor-pointer active:scale-95 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Smartphone size={18} />
            <span className="hidden sm:inline">{t('getApp')}</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop with Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-[110] md:hidden"
            />
            
            {/* Sidebar Content - Dynamic Perspective */}
            <motion.div 
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 h-[100vh] w-[85%] max-w-sm bg-white shadow-2xl p-8 flex flex-col md:hidden z-[120] ${isRtl ? 'right-0 text-right' : 'left-0 text-left'}`}
            >
              {/* Close Button Row */}
              <div className={`flex justify-between items-center mb-10 `}>
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="p-2 bg-slate-50 rounded-full cursor-pointer"
                 >
                    <X size={20} className="text-slate-500" />
                 </button>
              </div>

              {/* Mobile Navigation Links with Flipped Arrows */}
              <div className="flex flex-col border-t border-slate-50">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between py-6 border-b border-slate-50 group`}
                  >
                    <span className="font-bold text-[#0F172A] text-lg group-hover:text-[#7C3AED] transition-colors">
                      {link.name}
                    </span>
                    {/* Perspective flipped icons: ChevronRight for English, ChevronLeft for Arabic */}
                    {isRtl ? 
                      <ChevronLeft size={20} className="text-slate-300 group-hover:text-[#7C3AED] transition-transform group-hover:-translate-x-1" /> : 
                      <ChevronRight size={20} className="text-slate-300 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-1" />
                    }
                  </Link>
                ))}
              </div>

              {/* Mobile Footer Perspective */}
              <div className="mt-auto pt-8 space-y-8 bg-white">
                <div className={`flex items-center justify-between bg-slate-50/50 p-4 rounded-2xl `}>
                  <LanguageSwitcher />
                </div>

                <button className={`w-full bg-[#1E293B] text-white py-5 rounded-[24px] flex items-center justify-center gap-3 font-bold shadow-xl shadow-slate-200 active:scale-95 transition-all ${isRtl ? 'flex-row-reverse' : ''}`}>
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

export default Navbar;