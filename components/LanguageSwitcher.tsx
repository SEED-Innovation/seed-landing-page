'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [visualLocale, setVisualLocale] = useState(locale);
  const isRtl = visualLocale === 'ar';
  // Treat Arabic as the 'active' (purple) state
  const isPurple = visualLocale === 'en';

  useEffect(() => {
    setVisualLocale(locale);
  }, [locale]);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    setVisualLocale(nextLocale);

    setTimeout(() => {
      router.replace(pathname, { locale: nextLocale });
    }, 450); 
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <span className="text-sm font-medium text-slate-400  ">
        {isPurple ? 'العربية' : 'English'}
      </span>

      <button 
        onClick={toggleLanguage}
        className="relative w-[52px] h-[28px] rounded-full p-1 transition-all duration-500 overflow-hidden shadow-inner group hover:cursor-pointer"
        aria-label="Toggle Language"
      >
        {/* Animated Background Layer */}
        <motion.div 
          initial={false}
          animate={{ 
            backgroundColor: isPurple ? '#7F22FE' : '#E2E8F0' 
          }}
          className="absolute inset-0 transition-colors duration-500"
        />

        {/* The White Handle */}
        <motion.div 
          className="relative w-5 h-5 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-10"
          initial={false}
          animate={{ 
            /* IMPORTANT: In RTL, x: 24 moves the dot to the LEFT. 
               In LTR, x: 24 moves the dot to the RIGHT.
               We use negative values for Arabic to keep it inside the track.
            */
            x: isRtl ? (locale === 'ar' ? -24 : 0) : (locale === 'en' ? 24 : 0),
          }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30 
          }}
        />
      </button>
    </div>
  );
}