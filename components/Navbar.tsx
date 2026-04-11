"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Smartphone, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import DownloadModal from '@/app/[locale]/download/page';
import { useAuth } from '@/components/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Common.Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === 'ar';
  const { openAuth, user, authLoading, signOut } = useAuth();
  const tAuth = useTranslations('Auth');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isDropdownOpen]);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('explore'), href: '/courts' },
    { name: t('technology'), href: '/techs' },
    { name: t('business'), href: '/business' },
    { name: t('about'), href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && (pathname === `/${locale}` || pathname === `/`)) return true;
    return pathname === `/${locale}${href}` || pathname === href;
  };

  return (
    <nav className="w-full py-6 px-8 bg-white/80 backdrop-blur-md sticky top-0 z-[100] border-b border-slate-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* 1. Mobile Hamburger - Left side in LTR, Right side in RTL */}
        <div className="lg:hidden z-20">
          <button 
            onClick={() => setIsOpen(true)} 
            className="p-2 text-[#1E293B] cursor-pointer hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Menu size={28} />
          </button>
        </div>

        {/* 2. Centered Logo on Mobile / Flex-start on Desktop */}
        <div className="absolute inset-0 flex items-center justify-center lg:static lg:inset-auto lg:justify-start pointer-events-none lg:pointer-events-auto z-10">
          <Link href="/" className="flex items-center gap-2 pointer-events-auto">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
        </div>

        {/* 3. Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 mx-10">
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

        {/* 4. Desktop Actions & Mobile Spacer */}
        <div className="flex items-center gap-6 z-20">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>
          {authLoading ? (
            <div className="w-9 h-9 rounded-full bg-slate-200 animate-pulse hidden lg:block" />
          ) : user ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="w-9 h-9 rounded-full bg-[#7C3AED] text-white font-bold text-sm flex items-center justify-center hover:opacity-90 transition-opacity"
                aria-label="Account menu"
              >
                {(user.username[0] ?? user.email[0] ?? '?').toUpperCase()}
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full end-0 mt-2 w-48 rounded-xl shadow-lg bg-white border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 pt-3 pb-2">
                    <p className="font-semibold text-slate-900 text-sm truncate">{user.username || '—'}</p>
                    <p className="text-slate-400 text-xs truncate">{user.email || '—'}</p>
                  </div>
                  <hr className="border-slate-100" />
                  <button
                    onClick={() => { signOut(); setIsDropdownOpen(false); }}
                    className="w-full text-start px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    {tAuth('signOut')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:block">
              <button
                onClick={() => openAuth('signin')}
                className="border border-[#7C3AED] text-[#7C3AED] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#7C3AED]/5 transition-colors"
              >
                {t('signIn')}
              </button>
            </div>
          )}
          <div className="hidden lg:block">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#1E293B] text-white px-6 py-3 rounded-full flex items-center gap-2 hover:cursor-pointer transition-transform active:scale-95"
            >
              <Smartphone size={18} />
              <span>{t('getApp')}</span>
            </button>
          </div>
          
          {/* Mobile Spacer to balance the hamburger and keep logo centered */}
          <div className="lg:hidden w-10 h-10" />
        </div>
      </div>

      {/* --- Mobile Sidebar --- */}
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
              className={`fixed top-0 bottom-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl p-8 flex flex-col lg:hidden z-[120] ${isRtl ? 'right-0 text-right' : 'left-0 text-left'}`}
            >
              <div className="flex justify-between items-center mb-10">
                 <button 
                   onClick={() => setIsOpen(false)} 
                   className="p-2 bg-slate-50 rounded-full cursor-pointer hover:bg-slate-100"
                 >
                    <X size={20} className="text-slate-500" />
                 </button>
                 <img src="/logo.png" alt="Logo" className="h-8 w-auto grayscale opacity-50" />
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

              <div className="mt-auto pt-8 space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                  <span className="text-sm font-bold text-slate-500">{isRtl ? 'اللغة' : 'Language'}</span>
                  <LanguageSwitcher />
                </div>
                {authLoading ? null : user ? (
                  <>
                    <span className="font-semibold text-slate-900 text-sm px-1 block truncate">
                      {user.username || user.email || '—'}
                    </span>
                    <button
                      onClick={() => { signOut(); setIsOpen(false); }}
                      className="border-2 border-red-400 text-red-500 px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold hover:bg-red-50 transition-colors"
                    >
                      {tAuth('signOut')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); openAuth('signin'); }}
                    className="border-2 border-[#7C3AED] text-[#7C3AED] px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold hover:bg-[#7C3AED]/5 transition-colors"
                  >
                    {t('signIn')}
                  </button>
                )}
                <button
                  onClick={() => { setIsOpen(false); setIsModalOpen(true); }}
                  className="bg-[#1E293B] text-white px-6 py-4 rounded-2xl flex items-center gap-2 w-full justify-center font-bold"
                >
                  <Smartphone size={18} />
                  <span>{t('getApp')}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DownloadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </nav>
  );
};

export default Navbar;