"use client";
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import InfoBar from './InfoBar';
import DownloadModal from '@/app/[locale]/download/page';
import { Link } from '@/i18n/routing';
import {  Smartphone } from 'lucide-react';
export default function Hero() {
  const t = useTranslations('LandingPage.Hero');
  const locale = useLocale();
  const isRtl = locale === 'ar';
const [isModalOpen, setIsModalOpen] = useState(false);
  return (

    <section className="relative h-[90vh] min-h-[600px] w-full flex items-center bg-black ">
      {/* Background Video */}
      <video 
        key={isRtl ? 'rtl-vid' : 'ltr-vid'}
        autoPlay muted loop playsInline 
        className={`absolute inset-0 w-full h-full object-cover z-0 ${
          isRtl 
            ? 'object-[20%_center]' // 15% from the left for Arabic
            : 'object-[75%_center]' // 85% from the left (near the right) for English
        }`}
      >
        <source src={isRtl ? "/videos/hero-rtl.webm" : "/videos/hero-ltr.webm"} type="video/mp4" />
      </video>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60 md:opacity-30 z-[5] transition-opacity duration-500" />
      {/* Content Container */}
      <div className="relative z-10 px-6 md:px-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-normal">
          {t.rich('title', {
            br: () => <br />,
            highlight: (chunks) => <span className="text-[#C4E009]">{chunks}</span>
          })}
        </h1>
        
        <p className="mt-4 text-lg text-white/80">
          {t('description')}
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
          onClick={() => setIsModalOpen(true)}
          className="h-14 w-full sm:w-56 cursor-pointer bg-[#7C3AED] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95">
            <span className="whitespace-nowrap">{t('download')}</span>
            <span className="text-xl"><Smartphone></Smartphone></span>
          </button>

            <Link 
            href="/courts" 
            className="group h-14 w-52 cursor-pointer /10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-between ps-6 pe-2 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="text-white font-medium text-lg whitespace-nowrap">{t('findCourt')}</span>
            <div className=" w-10 h-10 rounded-full flex items-center justify-center text-slate-900 transition-all duration-300 rtl:-scale-x-100 group-hover:translate-x-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
            </Link>

        </div>
      </div>
      {/* Render the modal component */}
      {isModalOpen && <DownloadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}

      <div className="absolute bottom-0 left-0 w-full translate-y-1/2 z-20">
        <div className="container mx-auto px-6 md:px-12">
           <InfoBar />
        </div>
      </div>
    </section>
  );
}