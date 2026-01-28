"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

// Simple X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 ltr:text-left rtl:text-right">
          
          {/* Brand & Description */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                 <span className="text-black font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-black tracking-tighter">SEED</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('quickLinks')}</h4>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">{t('home')}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{t('about')}</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">{t('forCompanies')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('support')}</h4>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm">
              <li><Link href="/faq" className="hover:text-white transition-colors">{t('faq')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="text-lg font-bold mb-6 ">{t('contact')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <XIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs md:text-sm">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;