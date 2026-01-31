"use client";

import React from 'react';
import { useLocale } from 'next-intl';
import About from '@/components/about/about';


const AboutUsPage = () => {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <main className={`min-h-screen bg-white ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Section 1: Hero & Story (Your imported code) */}
      <About/>

    </main>
  );
};

export default AboutUsPage;