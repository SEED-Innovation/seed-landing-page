"use client";

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  X, 
  CircleDot,     
  Activity,      
  Home,          
  Sun,           
  GraduationCap, 
  Map as MapIcon,
  Building2,     
  Waves,         
  Anchor,        
  Palmtree,      
  Landmark,      
  MapPin,        
  Mountain       
} from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const Search = () => {
  const t = useTranslations('CourtsPage.Search');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('padel');
  const [activeCity, setActiveCity] = useState('all');

  const categories = [
    { id: 'padel', icon: <CircleDot size={24} /> },
    { id: 'tennis', icon: <Activity size={24} /> }, 
    { id: 'indoor', icon: <Home size={24} /> },
    { id: 'outdoor', icon: <Sun size={24} /> },
    { id: 'academies', icon: <GraduationCap size={24} /> },
  ];

  const cities = [
    { id: 'all', icon: <MapIcon size={16} /> },
    { id: 'riyadh', icon: <Building2 size={16} /> },
    { id: 'jeddah', icon: <Waves size={16} /> },
    { id: 'dammam', icon: <Anchor size={16} /> },
    { id: 'khobar', icon: <Palmtree size={16} /> },
    { id: 'makkah', icon: <Landmark size={16} /> },
    { id: 'madinah', icon: <MapPin size={16} /> },
    { id: 'abha', icon: <Mountain size={16} /> },
  ];

  return (
    <section className="pt-16 pb-12 px-6 bg-[#FBFCFE]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        <SectionTitle>{t('title')}</SectionTitle>

        <div className={`flex items-center gap-3 w-full max-w-3xl mt-10 mb-8 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="relative flex-grow group">
            <SearchIcon className={`absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#7C3AED] transition-colors ${isRtl ? 'right-5' : 'left-5'}`} size={22} />
            <input 
              type="text" 
              placeholder={t('placeholder')}
              className={`w-full p-5 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all font-saudia text-lg ${isRtl ? 'pr-14 text-right' : 'pl-14 text-left'}`}
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-5 rounded-2xl flex items-center gap-2 hover:cursor-pointer shadow-lg transition-all duration-300 font-saudia  ${
              showFilters ? 'bg-[#4C1D95] text-white shadow-purple-900/20' : 'bg-[#7C3AED] text-white shadow-purple-200'
            }`}
          >
             {showFilters ? <X size={22} /> : <SlidersHorizontal size={22} />}
             <span className="font-bold hidden md:block">{t('filter')}</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              <div className="py-8 flex flex-col items-center border-b border-slate-100 mb-8">
                
                {/* --- Sport Categories Slider --- */}
                {/* Added 'flex-nowrap' and 'overflow-x-auto' for the slider effect */}
                <div className={`
                  flex gap-6 md:gap-10 pb-4 w-full 
                  overflow-x-auto flex-nowrap scrollbar-hide px-4
                  justify-start md:justify-center
                `}>
                  {categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="flex flex-col items-center gap-4 min-w-[90px] shrink-0 group hover:cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-300 relative ${
                        activeCategory === cat.id 
                        ? 'bg-[#F5F3FF] text-[#7C3AED] shadow-sm ' 
                        : 'bg-white text-slate-300 hover:bg-slate-50 border border-slate-50'
                      }`}>
                        {cat.icon}
                        {activeCategory === cat.id && (
                          <motion.div layoutId="active-cat" className="absolute inset-0 rounded-[24px] border-2 border-[#7C3AED]/30" />
                        )}
                      </div>
                      <span className={`text-sm font-bold font-saudia transition-colors ${
                        activeCategory === cat.id ? 'text-[#7C3AED]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}>
                        {t(`categories.${cat.id}`)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* --- City Pill Slider --- */}
                {/* Added 'flex-nowrap' and 'overflow-x-auto' for the slider effect */}
                {/* --- City Pill Slider --- */}
                <div className={`
                  flex gap-3 w-full 
                  overflow-x-auto flex-nowrap scrollbar-hide px-4
                  justify-start md:justify-center pb-4 pt-2
                `}>
                  <AnimatePresence>
                    {cities.map((city, index) => (
                      <motion.button
                        key={city.id}
                        // Staggered Animation variants
                        initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                        animate={{ 
                          opacity: 1, 
                          x: 0,
                          transition: { delay: index * 0.05, duration: 0.3 } 
                        }}
                        whileHover={{ y: -2 }} // Small lift on hover
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCity(city.id)}
                        className={`
                          px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shrink-0 group font-saudia
                          ${activeCity === city.id 
                            ? 'bg-[#4C1D95] text-white shadow-[0_10px_20px_rgba(76,29,149,0.2)]' 
                            : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:cursor-pointer'
                          } 
                          ${isRtl ? 'flex-row-reverse' : 'flex-row'}
                        `}
                      >
                        <span>{t(`cities.${city.id}`)}</span>
                        <span className={`transition-colors ${activeCity === city.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {city.icon}
                        </span>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default Search;