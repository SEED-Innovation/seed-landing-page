"use client";

import React from 'react';
import * as Icons from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TagItem {
  key: string;
  name: string;
  icon: string;
  color: string;
}

const MarqueeRow = ({ items, reverse = false }: { items: TagItem[], reverse?: boolean }) => {
  return (
    <div className="flex overflow-hidden select-none gap-4 py-2 w-full mask-fade">

      <div className={`flex flex-nowrap gap-4 min-w-full shrink-0 items-center ${reverse ? 'animate-reverse' : 'animate-forward'}`}>
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = (Icons as any)[item.icon];
          return (
            <div 
              key={idx} 
              className={`flex items-center gap-2 px-5 py-3 rounded-full border shadow-sm transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm md:text-base font-semibold ${item.color}`}
            >
              {Icon && <Icon className="w-4 h-4" />}
              {item.name}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .animate-forward {
            /* Default speed/timing */
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }
        .animate-reverse {
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }

        /* --- LTR (English) Logic --- */
        :global([dir="ltr"]) .animate-forward {
            animation-name: marquee-ltr;
            animation-duration: 30s;
        }
        :global([dir="ltr"]) .animate-reverse {
            animation-name: marquee-reverse-ltr;
            animation-duration: 30s;
        }

        @keyframes marquee-ltr {
            from { transform: translateX(0); }
            to { transform: translateX(-33.33%); }
        }
        @keyframes marquee-reverse-ltr {
            from { transform: translateX(-33.33%); }
            to { transform: translateX(0); }
        }

        /* --- RTL (Arabic) Logic --- */
        :global([dir="rtl"]) .animate-forward {
            animation-name: marquee-rtl;
            animation-duration: 30s;
        }
        :global([dir="rtl"]) .animate-reverse {
            animation-name: marquee-reverse-rtl;
            animation-duration: 30s;
        }

        @keyframes marquee-rtl {
            /* In RTL, moving 'forward' usually means following the text flow (Right to Left) 
            which requires a positive translation in a flipped coordinate system. */
            from { transform: translateX(0); }
            to { transform: translateX(33.33%); }
        }
        @keyframes marquee-reverse-rtl {
            /* Moving 'reverse' in RTL means moving Left to Right. */
            from { transform: translateX(33.33%); }
            to { transform: translateX(0); }
        }

        .mask-fade {
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        `}</style>
    </div>
  );
};

const TagSlider = () => {
  const t = useTranslations('LandingPage.Marquee');

  const row1Tags: TagItem[] = [
    { key: "dataAnalysis", name: t('dataAnalysis'), icon: "BarChart3", color: "bg-orange-50 text-orange-700 border-orange-100" },
    { key: "continuousSupport", name: t('continuousSupport'), icon: "Users", color: "bg-slate-50 text-slate-700 border-slate-100" },
    { key: "anywhere", name: t('anywhere'), icon: "MapPin", color: "bg-red-50 text-red-700 border-red-100" },
    { key: "bookingMgmt", name: t('bookingMgmt'), icon: "Calendar", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    { key: "fastEntry", name: t('fastEntry'), icon: "Zap", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { key: "padel", name: t('padel'), icon: "Trophy", color: "bg-purple-50 text-purple-700 border-purple-100" },
  ];

  const row2Tags: TagItem[] = [
    { key: "tennis", name: t('tennis'), icon: "Circle", color: "bg-lime-50 text-lime-700 border-lime-100" },
    { key: "eventBooking", name: t('eventBooking'), icon: "CalendarCheck", color: "bg-sky-50 text-sky-700 border-sky-100" },
    { key: "highSecurity", name: t('highSecurity'), icon: "Lock", color: "bg-gray-50 text-gray-700 border-gray-100" },
    { key: "performanceMonitor", name: t('performanceMonitor'), icon: "Activity", color: "bg-cyan-50 text-cyan-700 border-cyan-100" },
    { key: "exclusiveDiscounts", name: t('exclusiveDiscounts'), icon: "Star", color: "bg-rose-50 text-rose-700 border-rose-100" },
    { key: "support247", name: t('support247'), icon: "Clock", color: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  ];

  const row3Tags: TagItem[] = [
    { key: "skillRecording", name: t('skillRecording'), icon: "Smartphone", color: "bg-orange-50 text-orange-700 border-orange-100" },
    { key: "timeMgmt", name: t('timeMgmt'), icon: "Clock3", color: "bg-pink-50 text-pink-700 border-pink-100" },
    { key: "easyAccess", name: t('easyAccess'), icon: "Rocket", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { key: "instantNotif", name: t('instantNotif'), icon: "Bell", color: "bg-blue-50 text-blue-700 border-blue-100" },
    { key: "lifestyle", name: t('lifestyle'), icon: "Heart", color: "bg-purple-50 text-purple-700 border-purple-100" },
    { key: "smoothExp", name: t('smoothExp'), icon: "Sparkles", color: "bg-violet-50 text-violet-700 border-violet-100" },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden w-full">
      <div className="flex flex-col gap-4 md:gap-6">
        <MarqueeRow items={row1Tags} />
        <MarqueeRow items={row2Tags} reverse={true} />
        <MarqueeRow items={row3Tags} />
      </div>
    </section>
  );
};

export default TagSlider;