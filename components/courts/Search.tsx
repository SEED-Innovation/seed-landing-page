"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search as SearchIcon, SlidersHorizontal, Map } from 'lucide-react';

// Custom Icons to match your UI
const PadelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const Search = () => {
  const t = useTranslations('CourtsPage.Search');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [activeCategory, setActiveCategory] = useState('padel');
  const [activeCity, setActiveCity] = useState('all');

  const categories = [
    { id: 'padel', icon: <PadelIcon /> },
    { id: 'tennis', icon: <div className="rotate-45">⚡</div> }, // Placeholder for your specific icons
    { id: 'indoor', icon: <div className="border-2 border-current w-5 h-4 rounded-sm" /> },
    { id: 'outdoor', icon: <div className="w-5 h-5 border-2 border-current border-dashed rounded-full" /> },
    { id: 'academies', icon: <div className="border-t-4 border-current w-5 h-1" /> },
  ];

  const cities = ['all', 'riyadh', 'jeddah', 'dammam', 'khobar', 'makkah', 'madinah', 'abha'];

  return (
    <section className="pt-16 pb-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-[#0F172A] mb-10 font-saudia text-center">
          {t('title')}
        </h1>

        {/* Search & Filter Bar */}
        <div className={`flex items-center gap-3 w-full max-w-3xl mb-12 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="relative flex-grow">
            <SearchIcon className={`absolute top-1/2 -translate-y-1/2 text-slate-300 ${isRtl ? 'right-5' : 'left-5'}`} size={22} />
            <input 
              type="text" 
              placeholder={t('placeholder')}
              className={`w-full p-5 rounded-2xl bg-[#F8FAFC] border border-slate-100 focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all font-saudia text-lg ${isRtl ? 'pr-14 text-right' : 'pl-14 text-left'}`}
            />
          </div>
          <button className="bg-[#7C3AED] text-white p-5 rounded-2xl flex items-center gap-2 hover:bg-[#6D28D9] transition-shadow shadow-lg shadow-purple-100 active:scale-95">
             <SlidersHorizontal size={22} />
             <span className="font-bold hidden md:block font-saudia">{t('filter')}</span>
          </button>
        </div>

        {/* Sport Categories */}
        <div className={`flex gap-6 md:gap-10 overflow-x-auto pb-6 w-full justify-start md:justify-center no-scrollbar ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex flex-col items-center gap-4 min-w-[90px] group"
            >
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-300 ${
                activeCategory === cat.id 
                ? 'bg-[#F5F3FF] text-[#7C3AED] shadow-sm scale-105' 
                : 'bg-white text-slate-300 hover:bg-slate-50 border border-slate-50'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-sm font-bold font-saudia ${
                activeCategory === cat.id ? 'text-[#7C3AED]' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {t(`categories.${cat.id}`)}
              </span>
            </button>
          ))}
        </div>

        {/* City Filter Chips */}
        <div className={`flex flex-wrap gap-3 mt-10 justify-center ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-all font-saudia flex items-center gap-2 ${
                activeCity === city 
                ? 'bg-[#4C1D95] text-white shadow-lg shadow-purple-900/10' 
                : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300'
              }`}
            >
              {city === 'all' && <Map size={16} />}
              {t(`cities.${city}`)}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Search;