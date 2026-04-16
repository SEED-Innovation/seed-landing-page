"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation'; // Added for URL params
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
  MapPin,
} from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

interface CityOption {
  en: string;
  ar: string;
}

interface SearchProps {
  onFilterChange: (filters: { query: string; category: string; city: string }) => void;
  cities?: CityOption[];
}

// Separate component to handle Search logic within Suspense
const SearchContent = ({ onFilterChange, cities = [] }: SearchProps) => {
  const t = useTranslations('CourtsPage.Search');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const searchParams = useSearchParams();

  /* --- Initializing state from URL Parameters --- */
  const initialCategory = searchParams.get('category') || 'all';
  const initialCity = searchParams.get('city') || 'all';
  
  const [showFilters, setShowFilters] = useState(initialCategory !== 'all' || initialCity !== 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeCity, setActiveCity] = useState(initialCity);

  // Sync state if user clicks a different card while already on the page
  useEffect(() => {
    const cat = searchParams.get('category');
    const cit = searchParams.get('city');
    if (cat) setActiveCategory(cat);
    if (cit) setActiveCity(cit);
    if (cat || cit) setShowFilters(true);
  }, [searchParams]);

  useEffect(() => {
    onFilterChange({
      query: searchTerm,
      category: activeCategory,
      city: activeCity
    });
  }, [searchTerm, activeCategory, activeCity, onFilterChange]);

  const categories = [
    { id: 'all', icon: <MapIcon size={24} /> }, 
    { id: 'padel', icon: <CircleDot size={24} /> },
    { id: 'tennis', icon: <Activity size={24} /> }, 
    { id: 'indoor', icon: <Home size={24} /> },
    { id: 'outdoor', icon: <Sun size={24} /> },
    { id: 'academies', icon: <GraduationCap size={24} /> },
  ];

  // "all" option always first, then one entry per city from facilities
  const cityButtons = [
    { id: 'all', label: t('cities.all'), icon: <MapIcon size={16} /> },
    ...cities.map((c) => ({
      id: c.en,
      label: isRtl ? c.ar : c.en,
      icon: <MapPin size={16} />,
    })),
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('placeholder')}
              className={`w-full p-5 rounded-2xl bg-white border border-slate-100 shadow-sm focus:ring-2 focus:ring-[#7C3AED] outline-none transition-all font-saudia text-lg ${isRtl ? 'pr-14 text-right' : 'pl-14 text-left'} text-black`}
            />
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-6 py-5 rounded-2xl flex items-center gap-2 hover:cursor-pointer shadow-lg transition-all duration-300 font-saudia ${
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
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full overflow-hidden"
            >
              <div className="py-8 flex flex-col items-center border-b border-slate-100 mb-8">
                {/* Category Selection */}
                <div className="flex gap-6 md:gap-10 pb-4 w-full overflow-x-auto flex-nowrap scrollbar-hide px-4 justify-start md:justify-center">
                  {categories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="flex flex-col items-center gap-4 min-w-[90px] shrink-0 group hover:cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-300 relative ${
                        activeCategory === cat.id 
                        ? 'bg-[#F5F3FF] text-[#7C3AED] shadow-sm' 
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

                {/* City Selection — built from facilities that have a city set */}
                <div className="flex gap-3 w-full overflow-x-auto flex-nowrap scrollbar-hide px-4 justify-start md:justify-center pb-4 pt-2">
                  {cityButtons.map((city, index) => (
                    <motion.button
                      key={city.id}
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05, duration: 0.3 } }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCity(city.id)}
                      className={`px-6 py-3 rounded-full font-bold text-sm transition-all flex items-center gap-2 shrink-0 group font-saudia
                        ${activeCity === city.id
                          ? 'bg-[#4C1D95] text-white shadow-[0_10px_20px_rgba(76,29,149,0.2)]'
                          : 'bg-white text-slate-500 border border-slate-100 hover:border-slate-300 hover:cursor-pointer'
                        }
                        ${isRtl ? 'flex-row-reverse' : 'flex-row'}
                      `}
                    >
                      <span>{city.label}</span>
                      <span className={`transition-colors ${activeCity === city.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {city.icon}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const Search = (props: SearchProps) => (
  <Suspense fallback={<div className="h-40 w-full animate-pulse bg-slate-50" />}>
    <SearchContent {...props} />
  </Suspense>
);

export default Search;