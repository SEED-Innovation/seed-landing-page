"use client";

import React from 'react';
import { useTranslations } from 'next-intl';

const PARTNERS = [
  "/images/partners/MCIT.png",
  "/images/partners/Monshaat.png",
  "/images/partners/NTDP.png",
  "/images/partners/The_Garage.png"
];

const Partners = () => {
  const t = useTranslations('LandingPage.Partners');

  return (
    <section className="py-12  w-full overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-gray-400 text-2xl md:text-3xl font-normal uppercase tracking-widest">
          {t('title')}
        </h3>
      </div>

      {/* Marquee Container */}
      <div className="marquee-wrapper w-full">
        <div className="marquee-content">
          {/* Tripled logos for a seamless infinite loop */}
          {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <div key={`${partner}-${idx}`} >
              <img 
              src={partner} 
              alt={partner} 
              className="w-64 h-auto mx-2 opacity-60 hover:opacity-100 filter grayscale hover:grayscale-0 transition-all duration-200"/>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee-wrapper {
          display: flex;
          overflow: hidden;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }

        .marquee-content {
          display: flex;
          flex-shrink: 0;
          min-width: 100%;
          align-items: center;
          justify-content: space-around;
        }

        /* LTR Animation */
        :global([dir="ltr"]) .marquee-content {
          animation: scroll-ltr 15s linear infinite;
        }

        /* RTL Animation */
        :global([dir="rtl"]) .marquee-content {
          animation: scroll-rtl 15s linear infinite;
        }

        @keyframes scroll-ltr {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }

        @keyframes scroll-rtl {
          from { transform: translateX(0); }
          to { transform: translateX(33.33%); }
        }

        .partner-logo {
          flex-shrink: 0;
        }

        .marquee-wrapper:hover .marquee-content {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default Partners;